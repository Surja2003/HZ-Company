export type SessionRole = "client" | "admin";

const TOKEN_KEY = "hz_session_token";
const ROLE_KEY = "hz_session_role";

export function getSessionToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSessionRole(): SessionRole | null {
  const v = localStorage.getItem(ROLE_KEY);
  return v === "client" || v === "admin" ? v : null;
}

export function setSession(token: string, role: SessionRole) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
}
