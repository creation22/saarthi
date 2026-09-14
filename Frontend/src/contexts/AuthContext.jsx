import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase.js';
import { login as backendLogin, register as backendRegister } from '../services/auth.js';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'saarthi_local_user';
const TOKEN_KEY = 'ls_token';

/**
 * Best-effort sync of the backend JWT session.
 * The Firebase user object alone can't authorize backend routes (matters,
 * tracker) — those expect the backend `ls_token`. After any email/password
 * sign-in we mirror the credentials to the backend: login, falling back to
 * register for first-time users. Failures are swallowed so the app still
 * works anonymously when the backend is unreachable.
 */
async function syncBackendToken({ name, email, password }) {
  if (!password) return;
  try {
    const { token } = await backendLogin(email, password);
    localStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    const status = err?.response?.status;
    if (status === 401 || status === 404) {
      try {
        const { token } = await backendRegister(name || email.split('@')[0], email, password);
        localStorage.setItem(TOKEN_KEY, token);
      } catch {
        /* backend unavailable or conflict — stay on Firebase session */
      }
    }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsub = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return unsub;
    } else {
      // Local Auth Fallback when Firebase is removed / omitted
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    if (auth) {
      const { user: u } = await signInWithEmailAndPassword(auth, email, password);
      await syncBackendToken({ email, password });
      return u;
    }
    const mockUser = { displayName: email.split('@')[0], email, uid: 'local_' + Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    await syncBackendToken({ email, password });
    return mockUser;
  };

  const register = async (name, email, password) => {
    if (auth) {
      const { user: u } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(u, { displayName: name });
      setUser({ ...u, displayName: name });
      await syncBackendToken({ name, email, password });
      return u;
    }
    const mockUser = { displayName: name || email.split('@')[0], email, uid: 'local_' + Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    await syncBackendToken({ name, email, password });
    return mockUser;
  };

  const loginWithGoogle = async () => {
    if (auth && googleProvider) {
      const { user: u } = await signInWithPopup(auth, googleProvider);
      return u;
    }
    const mockUser = { displayName: 'Demo User', email: 'demo@saarthi.ai', uid: 'local_demo' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const getToken = async () => {
    if (auth && auth.currentUser) {
      return auth.currentUser.getIdToken();
    }
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        getToken,
        userDisplay: user
          ? { name: user.displayName || user.email?.split('@')[0], email: user.email, photo: user.photoURL }
          : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
