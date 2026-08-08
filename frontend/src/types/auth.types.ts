export interface LoginCredentials {
  email: string;
  password: string;
  remember: boolean;
}

/** Shape of the claims embedded in the JWT payload — adjust keys to match your NestJS JwtService.sign() payload. */
export interface AuthTokenPayload {
  sub: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'faculty' | 'staff' | 'student';
  instituteName: string;
  iat: number;
  exp: number;
}

export interface LoginResponse {
  token: string;
}

export interface AuthUser {
  userid: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'faculty' | 'staff' | 'student';
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
