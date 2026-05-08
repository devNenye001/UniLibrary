import { createDemoToken, getStoredDocuments, setStoredDocuments } from "../utils/auth.js";
import axiosClient from "./axiosClient.js";

const seedDocuments = [
  {
    id: "doc-1",
    title: "CSC 401 Machine Learning Lecture Notes",
    courseCode: "CSC 401",
    department: "Computer Science",
    type: "Lecture Note",
    level: "400",
    uploadedBy: "Dr. Ibrahim Musa",
    role: "lecturer",
    year: "2025",
    tags: ["machine learning", "ai", "lecture notes"],
    description:
      "Week-by-week lecture notes covering supervised learning, model evaluation, and neural networks.",
    createdAt: "2026-01-12",
  },
  {
    id: "doc-2",
    title: "GST 102 Past Questions and Answers",
    courseCode: "GST 102",
    department: "General Studies",
    type: "Past Question",
    level: "100",
    uploadedBy: "Faculty Archive",
    role: "admin",
    year: "2024",
    tags: ["past question", "gst", "revision"],
    description:
      "Curated past questions for first-year students preparing for general studies examinations.",
    createdAt: "2026-02-02",
  },
  {
    id: "doc-3",
    title: "MTH 201 Linear Algebra Revision Pack",
    courseCode: "MTH 201",
    department: "Mathematics",
    type: "Study Guide",
    level: "200",
    uploadedBy: "Amina Yusuf",
    role: "student",
    year: "2025",
    tags: ["linear algebra", "mathematics", "revision"],
    description:
      "Student-friendly summary sheets with worked examples on matrices, eigenvalues, and vector spaces.",
    createdAt: "2026-02-18",
  },
];

function wait(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAllDocuments() {
  return [...getStoredDocuments(), ...seedDocuments];
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function loginUser(credentials) {
  try {
    return await axiosClient.post("/auth/login", credentials);
  } catch (error) {
    // Re-throw real HTTP errors (401 wrong password, 403 not approved, etc.)
    if (error.status) throw error;

    // Network / server unreachable → demo fallback
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

export async function registerUser(payload) {
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

// ─── Student-specific ────────────────────────────────────────────────────────

export async function getStudentRecommendations() {
  try {
    const data = await axiosClient.get("/recommendations");
    return data?.documents ?? data?.data ?? data ?? [];
  } catch {
    await wait(250);
    return getAllDocuments()
      .filter((d) => ["Past Question", "Lecture Note", "Study Guide"].includes(d.type))
      .slice(0, 6);
  }
}

export async function getPopularMaterials(department) {
  try {
    const params = department ? `?department=${encodeURIComponent(department)}` : "";
    const data = await axiosClient.get(`/recommendations/popular${params}`);
    return data?.documents ?? data?.data ?? data ?? [];
  } catch {
    await wait(250);
    return getAllDocuments().slice(0, 4);
  }
}

export async function getStudentStats() {
  try {
    return await axiosClient.get("/users/stats");
  } catch {
    await wait(200);
    return {
      totalMaterials: getAllDocuments().length,
      myDownloads: 0,
      myViewed: 0,
    };
  }
}

// ─── Documents ───────────────────────────────────────────────────────────────

export async function getDocuments() {
  try {
    const data = await axiosClient.get("/documents");
    return data?.documents ?? data?.data ?? data ?? [];
  } catch {
    await wait(250);
    return getAllDocuments();
  }
}

export async function uploadDocument(payload) {
  try {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value);
    });
    return await axiosClient.post("/documents/upload", formData);
  } catch {
    await wait();
    const uploaded = {
      id: `doc-${Date.now()}`,
      title: payload.title,
      courseCode: payload.courseCode,
      department: payload.department,
      type: payload.type,
      level: payload.level,
      year: payload.year,
      uploadedBy: payload.uploadedBy,
      role: payload.role,
      description: payload.description,
      tags: payload.tags ?? [],
      fileName: payload.file?.name ?? "document.pdf",
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setStoredDocuments([uploaded, ...getStoredDocuments()]);
    return uploaded;
  }
}

export async function searchDocuments(query) {
  try {
    const data = await axiosClient.get(
      `/documents/search?q=${encodeURIComponent(query)}`,
    );
    return data?.documents ?? data?.data ?? data ?? [];
  } catch {
    await wait(250);
    const q = query.trim().toLowerCase();
    return getAllDocuments().filter((doc) =>
      [doc.title, doc.courseCode, doc.department, doc.type, doc.description, ...(doc.tags ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
}

export async function getRecommendations(role = "student") {
  try {
    const data = await axiosClient.get(
      `/documents/recommendations?role=${encodeURIComponent(role)}`,
    );
    return data?.documents ?? data?.data ?? data ?? [];
  } catch {
    await wait(250);
    const docs = getAllDocuments();
    if (role === "lecturer") return docs.filter((d) => d.type !== "Past Question").slice(0, 3);
    if (role === "admin") return docs.slice(0, 3);
    return docs
      .filter((d) => ["Past Question", "Lecture Note", "Study Guide"].includes(d.type))
      .slice(0, 3);
  }
}
