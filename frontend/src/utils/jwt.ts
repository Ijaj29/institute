/**
 * Decodes a JWT's payload segment (base64url) into a plain JS object.
 * Does NOT verify the signature — verification happens server-side.
 * Returns null if the token is missing, malformed, or unparsable.
 */
export function decodeJwt<T = Record<string, unknown>>(token: string | null): T | null {
  if (!token) return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

export function isJwtExpired(token: string | null): boolean {
  const payload = decodeJwt<{ exp?: number }>(token);
  if (!payload?.exp) return false; // no exp claim -> treat as non-expiring
  return Date.now() >= payload.exp * 1000;
}