import axiosClient from "./axiosClient.js";
import { extractPayload, extractSession } from "./apiUtils.js";

export async function login(credentials) {
  const response = await axiosClient.post("/auth/login", credentials);
  return extractSession(response);
}

export async function register(payload) {
  const response = await axiosClient.post("/auth/register", payload);
  return extractPayload(response) ?? {};
}

export async function forgotPassword(email) {
  const response = await axiosClient.post("/auth/forgot-password", { email });
  return extractPayload(response) ?? {};
}

export async function resetPassword(token, password) {
  const response = await axiosClient.patch(`/auth/reset-password/${token}`, { password });
  return extractSession(response);
}

export async function getCurrentUser() {
  const response = await axiosClient.get("/auth/me");
  return extractSession(response);
}
