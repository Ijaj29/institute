import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { AuthTokenPayload, LoginCredentials } from '@/types/auth.types';
import { login as loginRequest } from '@/services/authService';
import { sessionService } from '@/services/sessionService';

interface AuthContextValue {
  user: AuthTokenPayload | null;
  isAuthenticating: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthTokenPayload | null>(() => sessionService.getUser());
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signIn = useCallback(async (credentials: LoginCredentials) => {
    setIsAuthenticating(true);
    try {
      const { token } = await loginRequest(credentials);
      sessionService.saveToken(token, credentials.remember); // cookie set here
      setUser(sessionService.getUser()); // decoded straight from the token
    } finally {
      setIsAuthenticating(false);
    }
  }, []);

  const signOut = useCallback(() => {
    sessionService.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticating, signIn, signOut }),
    [user, isAuthenticating, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}