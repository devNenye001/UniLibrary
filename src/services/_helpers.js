import { getStoredDocuments, setStoredDocuments } from "../utils/auth.js";

// ── Re-export storage helpers so service files have one import ───────────────
export { getStoredDocuments, setStoredDocuments };

// ── Seed documents used in demo / offline mode ───────────────────────────────
export const seedDocuments = [
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

// ── Shared utilities ──────────────────────────────────────────────────────────

export function wait(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getAllDocuments() {
  return [...getStoredDocuments(), ...seedDocuments];
}

export function normalizeMaterial(material) {
  if (!material) return null;
  return {
    ...material,
    id: String(material.id ?? material._id ?? material.slug ?? Date.now()),
    title: material.title ?? "Untitled Material",
    courseCode: material.courseCode ?? material.course_code ?? "",
    department: material.department ?? "",
    level: material.level ? String(material.level) : "",
    academicSession:
      material.academicSession ??
      material.session ??
      material.year ??
      material.academic_year ??
      "",
    year: material.year ?? material.academicSession ?? material.session ?? "",
    uploadedBy:
      material.uploadedBy ??
      material.uploaded_by ??
      material.author ??
      material.uploaderName ??
      "",
    downloadCount: Number(material.downloadCount ?? material.downloads ?? 0),
    viewCount: Number(material.viewCount ?? material.views ?? 0),
    fileUrl:
      material.fileUrl ??
      material.file_url ??
      material.url ??
      material.file?.url ??
      material.documentUrl ??
      "",
    fileName:
      material.fileName ?? material.file_name ?? material.title ?? "material.pdf",
    similarityScore: material.similarityScore ?? material.score ?? null,
    status: material.status ?? undefined,
  };
}

export function filterDocuments(documents, filters = {}) {
  const department = filters.department?.trim().toLowerCase();
  const level = String(filters.level ?? "").trim();
  const courseCode = filters.courseCode?.trim().toLowerCase();
  const academicSession = String(filters.academicSession ?? "").trim();

  return documents.filter((doc) => {
    const n = normalizeMaterial(doc);
    if (!n) return false;
    if (department && n.department.toLowerCase() !== department) return false;
    if (level && String(n.level) !== level) return false;
    if (courseCode && !n.courseCode.toLowerCase().includes(courseCode)) return false;
    if (
      academicSession &&
      String(n.academicSession ?? n.year ?? "") !== academicSession
    ) return false;
    return true;
  });
}

export function paginateItems(items, page = 1, pageSize = 12) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const start = (safePage - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total, totalPages, page: safePage, pageSize };
}
