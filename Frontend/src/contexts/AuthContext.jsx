import { createContext, useContext, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/react';

export const AuthContext = createContext(null);

const TOKEN_KEY = 'ls_token';

/**
 * Bridges Clerk session to the app's existing useAuth() API.
 * Backend matters/tracker still expect `ls_token` from /api/auth — wire Clerk JWT verification on the backend separately.
 */
function AuthBridge({ children }) {
  const { user, isLoaded } = useUser();
  const { isSignedIn, signOut, getToken: clerkGetToken } = useClerkAuth();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [isLoaded, isSignedIn]);

  const userDisplay = user
    ? {
        name: user.fullName || user.firstName || user.primaryEmailAddress?.emailAddress?.split('@')[0],
        email: user.primaryEmailAddress?.emailAddress,
        photo: user.imageUrl,
      }
    : null;

  const value = {
    user: isSignedIn ? user : null,
    isLoggedIn: !!isSignedIn,
    loading: !isLoaded,
    async logout() {
      localStorage.removeItem(TOKEN_KEY);
      await signOut();
    },
    async getToken() {
      return clerkGetToken();
    },
    /** @deprecated Use /login (Clerk SignIn) */
    async login() {
      throw new Error('Use the Sign In page');
    },
    /** @deprecated Use /register (Clerk SignUp) */
    async register() {
      throw new Error('Use the Sign Up page');
    },
    /** @deprecated OAuth is handled by Clerk on /login */
    async loginWithGoogle() {
      throw new Error('Use the Sign In page');
    },
    userDisplay,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }) {
  return <AuthBridge>{children}</AuthBridge>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
