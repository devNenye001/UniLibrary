import { createDemoToken } from "../utils/auth.js";
import axiosClient from "./axiosClient.js";
import { wait } from "./_helpers.js";

export async function login(credentials) {
  try {
    return await axiosClient.post("/auth/login", credentials);
  } catch (error) {
    if (error.status) throw error;

    await wait();
    const email = credentials.email?.toLowerCase() ?? "";
    const role = email.includes("admin")
      ? "admin"
      : email.includes("lect")
        ? "lecturer"
        : "student";
    const user = {
      id: String(Date.now()),
      name: credentials.email?.split("@")[0] ?? "UniLibrary User",
      email: credentials.email,
      role,
    };
    return { token: createDemoToken(user), user, mode: "demo" };
  }
}

export async function register(payload) {
  try {
    return await axiosClient.post("/auth/register", payload);
  } catch (error) {
    if (error.status) throw error;

    await wait();
    return {
      message: "Account created successfully. Awaiting admin approval.",
      mode: "demo",
    };
  }
}

export async function forgotPassword(email) {
  try {
    return await axiosClient.post("/auth/forgot-password", { email });
  } catch (error) {
    if (error.status) throw error;

    await wait();
    return {
      message:
        "If this email is registered, a password reset link has been sent to your inbox.",
    };
  }
}
