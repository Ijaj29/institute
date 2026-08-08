import type { AuthSession, LoginCredentials } from '@/types/auth.types';
import { httpClient } from '@/services/httpClient';

class AuthApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AuthApiError';
  }
}

export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  try {
    const { data } = await httpClient.post<AuthSession>('/auth/login', {
      username: credentials.email,
      password: credentials.password,
    });
    return data;
  } catch (err: any) {
    const message = err.response?.data?.message ?? 'Invalid email or password.';
    throw new AuthApiError(message, err.response?.status);
  }
}

export { AuthApiError };
