import axios from "axios";
import { clearStoredAuth, getStoredAuth } from "../utils/auth.js";

const RENDER_API_URL = "https://unilibrary-server.onrender.com/api/v1";

function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_URL;

  if (!configured || configured.includes("railway.app")) {
    return RENDER_API_URL;
  }

  return configured;
}

const axiosClient = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ── Request interceptor: attach Bearer token + strip Content-Type for FormData
axiosClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  try {
    const { token } = getStoredAuth();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore storage errors
  }
  return config;
});

// ── Response interceptor: unwrap data, handle 401 globally, retry once on timeout
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const isTimeout =
      error.code === "ECONNABORTED" || error.message?.toLowerCase().includes("timeout");

    // Retry once on timeout — Render free tier cold starts can exceed 60 s
    if (isTimeout && !error.config._retried) {
      error.config._retried = true;
      error.config.timeout = 30000;
      return axiosClient.request(error.config);
    }

    if (error.response?.status === 401) {
      const url = error.config?.url ?? "";
      const isLoginRequest = url.includes("login") || url.includes("register");
      if (!isLoginRequest) {
        clearStoredAuth();
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
        return Promise.reject(new Error("Session expired. Please log in again."));
      }
    }

    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      (isTimeout ? "Server is taking too long to respond. Please try again." : null) ??
      error.message ??
      "Request failed";

    const normalized = new Error(message);
    normalized.status = error.response?.status ?? null;
    normalized.response = error.response?.data ?? null;
    return Promise.reject(normalized);
  },
);

export default axiosClient;
