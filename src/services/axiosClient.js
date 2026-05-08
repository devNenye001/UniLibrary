import axios from "axios";

const AUTH_STORAGE_KEY = "unilibrary_auth";

const axiosClient = axios.create({
  baseURL: "https://unilibrary-server.onrender.com/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

axiosClient.interceptors.request.use((config) => {
  // Let axios set Content-Type + boundary automatically for FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      const { token } = JSON.parse(raw);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore storage parse errors
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.response?.data?.error ??
      error.message ??
      "Request failed";
    const normalized = new Error(message);
    normalized.status = error.response?.status ?? null;
    return Promise.reject(normalized);
  },
);

export default axiosClient;
