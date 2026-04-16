import { createDemoToken, getStoredDocuments, setStoredDocuments } from "../utils/auth.js";

const API_BASE = "http://localhost:8000";

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
    description: "Week-by-week lecture notes covering supervised learning, model evaluation, and neural networks.",
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
    description: "Curated past questions for first-year students preparing for general studies examinations.",
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
    description: "Student-friendly summary sheets with worked examples on matrices, eigenvalues, and vector spaces.",
    createdAt: "2026-02-18",
  },
];

function wait(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getAllDocuments() {
  const uploadedDocuments = getStoredDocuments();
  return [...uploadedDocuments, ...seedDocuments];
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

async function requestForm(path, formData, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    body: formData,
    ...options,
  });

  const contentType = response.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export async function loginUser(credentials) {
  try {
    return await request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  } catch {
    await wait();

    const inferredRole = credentials.email?.toLowerCase().includes("admin")
      ? "admin"
      : credentials.email?.toLowerCase().includes("lect")
        ? "lecturer"
        : "student";

    const user = {
      id: String(Date.now()),
      name: credentials.email?.split("@")[0] ?? "UniLibrary User",
      email: credentials.email,
      role: inferredRole,
    };

    return {
      token: createDemoToken(user),
      user,
      mode: "demo",
    };
  }
}

export async function registerUser(payload) {
  try {
    return await request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch {
    await wait();

    const user = {
      id: String(Date.now()),
      name: payload.name,
      email: payload.email,
      role: payload.role,
    };

    return {
      token: createDemoToken(user),
      user,
      mode: "demo",
    };
  }
}

export async function getDocuments() {
  try {
    const data = await request("/documents");
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
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    return await requestForm("/documents/upload", formData);
  } catch {
    await wait();

    const uploadedDocument = {
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

    setStoredDocuments([uploadedDocument, ...getStoredDocuments()]);
    return uploadedDocument;
  }
}

export async function searchDocuments(query) {
  try {
    const data = await request(`/documents/search?q=${encodeURIComponent(query)}`);
    return data?.documents ?? data?.data ?? data ?? [];
  } catch {
    await wait(250);
    const normalizedQuery = query.trim().toLowerCase();

    return getAllDocuments().filter((document) => {
      const haystack = [
        document.title,
        document.courseCode,
        document.department,
        document.type,
        document.description,
        ...(document.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }
}

export async function getRecommendations(role = "student") {
  try {
    const data = await request(`/documents/recommendations?role=${encodeURIComponent(role)}`);
    return data?.documents ?? data?.data ?? data ?? [];
  } catch {
    await wait(250);
    const documents = getAllDocuments();

    if (role === "lecturer") {
      return documents.filter((document) => document.type !== "Past Question").slice(0, 3);
    }

    if (role === "admin") {
      return documents.slice(0, 3);
    }

    return documents
      .filter((document) =>
        ["Past Question", "Lecture Note", "Study Guide"].includes(document.type),
      )
      .slice(0, 3);
  }
}
