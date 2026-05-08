import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../services/api.js";
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

  const value = useMemo(() => {
    const role = getUserRole(auth);

    const setSession = (session) => {
      const nextAuth = setStoredAuth(session);
      setAuth(nextAuth);
      return nextAuth;
    };

    const login = async (credentials) => {
      const session = await loginUser(credentials);
      return setSession(session);
    };

    const register = async (payload) => {
      const session = await registerUser(payload);
      return setSession(session);
    };

    const logout = () => {
      clearStoredAuth();
      setAuth({ token: "", user: null });
    };

    return {
      auth,
      token: auth?.token ?? "",
      user: auth?.user ?? null,
      role,
      isAuthenticated: Boolean(auth?.token),
      login,
      register,
      logout,
      setSession,
      hasRole: (roles) => hasAllowedRole(role, roles),
    };
  }, [auth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
