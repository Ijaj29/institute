const SESSION_KEY = 'meridian.session';

export function saveSession(raw: string, persist: boolean): void {
  const store = persist ? window.localStorage : window.sessionStorage;
  store.setItem(SESSION_KEY, raw);
}

export function readSession(): string | null {
  return (
    window.localStorage.getItem(SESSION_KEY) ?? window.sessionStorage.getItem(SESSION_KEY)
  );
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
}
