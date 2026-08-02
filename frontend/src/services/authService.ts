import type { AuthSession, LoginCredentials } from '@/types/auth.types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

class AuthApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AuthApiError';
  }
}

/**
 * Calls the NestJS `/auth/login` endpoint.
 * Swap the mock branch below for a real fetch once your backend route is ready.
 */
export async function login(credentials: LoginCredentials): Promise<AuthSession> {
  const useMock = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

  if (useMock) {
    return mockLogin(credentials);
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: credentials.email,
      password: credentials.password,
    }),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new AuthApiError(payload?.message ?? 'Invalid email or password.', response.status);
  }

  return response.json();
}

async function mockLogin({ email, password }: LoginCredentials): Promise<AuthSession> {
  await new Promise((resolve) => setTimeout(resolve, 700));

  if (password.length < 6) {
    throw new AuthApiError('Invalid email or password.', 401);
  }

  return {
    token: 'mock-jwt-token',
    user: {
      id: 'usr_001',
      name: email.split('@')[0],
      email,
      role: 'admin',
      instituteName: 'Meridian Institute',
    },
  };
}

export { AuthApiError };
