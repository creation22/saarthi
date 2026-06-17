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

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email, password) => {
    const { user: u } = await signInWithEmailAndPassword(auth, email, password);
    return u;
  };

  const register = async (name, email, password) => {
    const { user: u } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(u, { displayName: name });
    // Refresh so displayName is reflected immediately
    setUser({ ...u, displayName: name });
    return u;
  };

  const loginWithGoogle = async () => {
    const { user: u } = await signInWithPopup(auth, googleProvider);
    return u;
  };

  const logout = () => signOut(auth);

  // Helpers for existing backend calls — returns Firebase ID token
  const getToken = async () => {
    if (!auth.currentUser) return null;
    return auth.currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      getToken,
      // Compat shim so existing code using user.name still works
      userDisplay: user
        ? { name: user.displayName || user.email?.split('@')[0], email: user.email, photo: user.photoURL }
        : null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
