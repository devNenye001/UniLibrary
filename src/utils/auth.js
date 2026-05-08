const AUTH_STORAGE_KEY = "unilibrary_auth";
const DOCUMENTS_STORAGE_KEY = "unilibrary_documents";

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

export function createDemoToken(payload) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(
    JSON.stringify({
      sub: payload.id ?? String(Date.now()),
      name: payload.name,
      email: payload.email,
      role: payload.role,
    }),
  );

  return `${header}.${body}.signature`;
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
  return (
    auth?.user?.role ??
    decodeJwt(auth?.token ?? "")?.role ??
    "student"
  );
}

export function hasAllowedRole(role, allowedRoles) {
  if (!allowedRoles?.length) return true;
  return allowedRoles.includes(role);
}

export function getStoredDocuments() {
  try {
    const raw = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setStoredDocuments(documents) {
  localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(documents));
  return documents;
}

const HISTORY_STORAGE_KEY = "unilibrary_history";

export function getStoredHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToStoredHistory(item) {
  try {
    const existing = getStoredHistory();
    const deduped = existing.filter((h) => h.materialId !== item.materialId);
    const updated = [
      { ...item, viewedAt: item.viewedAt ?? new Date().toISOString() },
      ...deduped,
    ].slice(0, 50);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
