import { createContext, useContext, useLayoutEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/react';
import { setAuthTokenGetter } from '../services/api.js';

export const AuthContext = createContext(null);

/**
 * Bridges Clerk session to the app's existing useAuth() API,
 * and hands the API client a way to get the Clerk session token the backend verifies.
 */
function AuthBridge({ children }) {
  const { user, isLoaded } = useUser();
  const { isSignedIn, signOut, getToken: clerkGetToken } = useClerkAuth();

  // Layout effect: a protected page can mount in the same commit that Clerk finishes
  // loading, and its useEffect fetch would otherwise run before this and go out unauthenticated.
  // Not registered before load, because getToken() waits for Clerk and would stall anonymous requests.
  useLayoutEffect(() => {
    setAuthTokenGetter(isLoaded ? clerkGetToken : null);
  }, [isLoaded, clerkGetToken]);

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
