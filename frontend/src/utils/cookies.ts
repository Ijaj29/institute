interface CookieOptions {
  days?: number;
  path?: string;
  sameSite?: 'Strict' | 'Lax' | 'None';
  secure?: boolean;
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  const { days, path = '/', sameSite = 'Lax', secure = window.location.protocol === 'https:' } = options;

  let cookieStr = `${name}=${encodeURIComponent(value)}; path=${path}; SameSite=${sameSite}`;

  if (days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    cookieStr += `; expires=${expires.toUTCString()}`;
  }
  // omit expires entirely -> session cookie (cleared when browser closes), used for "don't remember me"

  if (secure) cookieStr += '; Secure';

  document.cookie = cookieStr;
}

export function getCookie(name: string): string | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

export function removeCookie(name: string, path = '/'): void {
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}