import { createContext, useContext, useMemo, useState } from "react";
import {
  clearStoredAuth,
  getStoredAuth,
  getUserRole,
  hasAllowedRole,
  setStoredAuth,
} from "../utils/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());

  const setSession = (session) => {
    const nextAuth = setStoredAuth(session);
    setAuth(nextAuth);
    return nextAuth;
  };

  const logout = () => {
    clearStoredAuth();
    setAuth({ token: "", user: null });
  };

  const value = useMemo(() => {
    const role = getUserRole(auth);

    return {
      auth,
      token: auth?.token ?? "",
      user: auth?.user ?? null,
      role,
      isAuthenticated: Boolean(auth?.token),
      setSession,
      logout,
      hasRole: (roles) => hasAllowedRole(role, roles),
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
