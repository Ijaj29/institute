import { getCookie, removeCookie, setCookie } from '@/utils/cookies';
import { decodeJwt, isJwtExpired } from '@/utils/jwt';
import type { AuthTokenPayload } from '@/types/auth.types';

const TOKEN_COOKIE = 'meridian_token';
const REMEMBER_DAYS = 7;

export const sessionService = {
  /** Stores only the JWT, in a cookie. `remember` controls persistence beyond the browser session. */
  saveToken(token: string, remember: boolean): void {
    setCookie(TOKEN_COOKIE, token, remember ? { days: REMEMBER_DAYS } : {});
  },

  getToken(): string | null {
    const token = getCookie(TOKEN_COOKIE);
    if (token && isJwtExpired(token)) {
      sessionService.clear();
      return null;
    }
    return token;
  },

  /** Decodes the JWT payload and hands back ready-to-use JSON — no manual parsing in components. */
  getUser(): AuthTokenPayload | null {
    return decodeJwt<AuthTokenPayload>(sessionService.getToken());
  },

  isAuthenticated(): boolean {
    return sessionService.getToken() !== null;
  },

  clear(): void {
    removeCookie(TOKEN_COOKIE);
  },
};