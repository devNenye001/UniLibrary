import {
  addToStoredHistory,
  getStoredHistory,
} from "../utils/auth.js";
import axiosClient from "./axiosClient.js";
import {
  filterDocuments,
  getAllDocuments,
  getStoredDocuments,
  normalizeMaterial,
  paginateItems,
  seedDocuments,
  setStoredDocuments,
  wait,
} from "./_helpers.js";

// ── Browse / fetch ────────────────────────────────────────────────────────────

export async function getMaterials(filters = {}) {
  const page = Number(filters.page) || 1;
  const pageSize = Number(filters.pageSize) || 12;

  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value).trim() !== "") {
        params.set(key, String(value).trim());
      }
    });
    const query = params.toString();
    const data = await axiosClient.get(`/materials${query ? `?${query}` : ""}`);
    const payload = data?.data ?? data ?? {};
    const rawItems = Array.isArray(payload)
      ? payload
      : payload.materials ?? payload.items ?? payload.documents ?? [];
    const items = rawItems.map(normalizeMaterial);
    const departments = [
      ...new Set(items.map((item) => item.department).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));
    return {
      items,
      total: Number(payload.total ?? payload.totalCount ?? items.length),
      totalPages:
        Number(payload.totalPages) ||
        Math.max(1, Math.ceil(Number(payload.total ?? items.length) / pageSize)),
      page: Number(payload.page ?? page),
      pageSize: Number(payload.pageSize ?? pageSize),
      departments,
    };
  } catch {
    await wait(250);
    const filtered = filterDocuments(getAllDocuments(), filters).map(normalizeMaterial);
    const paginated = paginateItems(filtered, page, pageSize);
    const departments = [
      ...new Set(
        getAllDocuments()
          .map((item) => normalizeMaterial(item)?.department)
          .filter(Boolean),
      ),
    ].sort((a, b) => a.localeCompare(b));
    return { ...paginated, departments };
  }
}

export async function getMaterial(id) {
  try {
    const data = await axiosClient.get(`/materials/${id}`);
    return normalizeMaterial(data?.data ?? data?.material ?? data);
  } catch {
    await wait(220);
    const material = getAllDocuments()
      .map(normalizeMaterial)
      .find((item) => item.id === String(id));
    if (!material) throw new Error("This material could not be found.");
    return material;
  }
}

// Legacy alias kept for backwards-compat
export const getMaterialById = getMaterial;

export async function getDocuments() {
  try {
    const data = await axiosClient.get("/documents");
    return data?.documents ?? data?.data ?? data ?? [];
  } catch {
    await wait(250);
    return getAllDocuments();
  }
}

// ── Upload / mutate ───────────────────────────────────────────────────────────

export async function uploadMaterial(payload, onUploadProgress) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  try {
    return await axiosClient.post("/materials/upload", formData, { onUploadProgress });
  } catch {
    await wait(1400);
    const uploaded = {
      id: `doc-${Date.now()}`,
      title: payload.title,
      courseCode: payload.courseCode,
      department: payload.department,
      level: payload.level,
      year: payload.academicSession,
      type: payload.type ?? "Lecture Note",
      status: "Pending",
      downloadCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setStoredDocuments([uploaded, ...getStoredDocuments()]);
    return uploaded;
  }
}

// Legacy name used by the old Upload.jsx page
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

export async function updateMaterial(id, data) {
  try {
    return await axiosClient.put(`/materials/${id}`, data);
  } catch {
    await wait(400);
    return { ...data, id, mode: "demo" };
  }
}

export async function deleteMaterial(id) {
  try {
    return await axiosClient.delete(`/materials/${id}`);
  } catch {
    await wait(300);
    setStoredDocuments(getStoredDocuments().filter((d) => String(d.id) !== String(id)));
    return { success: true, mode: "demo" };
  }
}

// ── View tracking ─────────────────────────────────────────────────────────────

export async function viewMaterial(id, material) {
  if (material) {
    addToStoredHistory({
      materialId: String(id),
      title: material.title ?? "Untitled",
      courseCode: material.courseCode ?? "",
      department: material.department ?? "",
      viewedAt: new Date().toISOString(),
    });
  }
  try {
    return await axiosClient.post(`/materials/${id}/view`, {});
  } catch {
    await wait(120);
    return { success: true, mode: "demo" };
  }
}

// Legacy alias
export const logMaterialView = viewMaterial;

// ── Lecturer-specific ─────────────────────────────────────────────────────────

export async function getLecturerStats() {
  try {
    return await axiosClient.get("/users/lecturer-stats");
  } catch {
    await wait(200);
    const docs = getStoredDocuments();
    const totalDownloads = docs.reduce((sum, d) => sum + Number(d.downloadCount ?? 0), 0);
    return {
      totalUploads: docs.length + seedDocuments.length,
      totalDownloads: totalDownloads + 12,
      pendingApproval: docs.filter((d) => d.status === "Pending").length + 2,
    };
  }
}

export async function getLecturerMaterials() {
  try {
    const data = await axiosClient.get("/materials/my-uploads");
    const items = data?.data ?? data?.materials ?? data ?? [];
    return items.map((m) => ({ ...normalizeMaterial(m), status: m.status ?? "Pending" }));
  } catch {
    await wait(250);
    return [...getStoredDocuments(), ...seedDocuments].map((m, i) => ({
      ...normalizeMaterial(m),
      status: m.status ?? (i % 3 === 0 ? "Pending" : i % 5 === 0 ? "Rejected" : "Approved"),
      createdAt: m.createdAt ?? "2026-01-15",
    }));
  }
}

// ── Student stats ─────────────────────────────────────────────────────────────

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

// ── View history ──────────────────────────────────────────────────────────────

export async function getViewHistory() {
  try {
    const data = await axiosClient.get("/users/history");
    return data?.history ?? data?.data ?? data ?? [];
  } catch {
    await wait(200);
    const stored = getStoredHistory();
    if (stored.length) return stored;
    const now = Date.now();
    return [
      {
        materialId: "doc-1",
        title: "CSC 401 Machine Learning Lecture Notes",
        courseCode: "CSC 401",
        department: "Computer Science",
        viewedAt: new Date(now - 1000 * 60 * 25).toISOString(),
      },
      {
        materialId: "doc-2",
        title: "GST 102 Past Questions and Answers",
        courseCode: "GST 102",
        department: "General Studies",
        viewedAt: new Date(now - 1000 * 60 * 60 * 26).toISOString(),
      },
      {
        materialId: "doc-3",
        title: "MTH 201 Linear Algebra Revision Pack",
        courseCode: "MTH 201",
        department: "Mathematics",
        viewedAt: new Date(now - 1000 * 60 * 60 * 50).toISOString(),
      },
    ];
  }
}
