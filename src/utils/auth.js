const AUTH_STORAGE_KEY = "golibrary_auth";

function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function normalizeAuth(session) {
  return {
    token: session?.token ?? "",
    user: session?.user ?? null,
  };
}

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { token: "", user: null };
    return normalizeAuth(JSON.parse(raw));
  } catch {
    return { token: "", user: null };
  }
}

export function setStoredAuth(session) {
  const normalized = normalizeAuth(session);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getUserRole(auth) {
  return auth?.user?.role ?? decodeJwt(auth?.token ?? "")?.role ?? "student";
}

export function hasAllowedRole(role, allowedRoles) {
  if (!allowedRoles?.length) return true;
  return allowedRoles.includes(role);
}
