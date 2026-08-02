export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'staff' | 'student';
  instituteName: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}
