import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { AuthSession, LoginCredentials } from '@/types/auth.types';
import { login as loginRequest } from '@/services/authService';
import { clearSession, readSession, saveSession } from '@/utils/storage';

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticating: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadInitialSession(): AuthSession | null {
  const raw = readSession();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(loadInitialSession);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    setIsAuthenticating(true);
    try {
      const result = await loginRequest(credentials);
      setSession(result);
      saveSession(JSON.stringify(result), credentials.remember);
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setSession(null);
    clearSession();
  }, []);

  const value = useMemo(
    () => ({ session, isAuthenticating, signIn, signOut }),
    [session, isAuthenticating, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
