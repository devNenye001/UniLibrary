import axiosClient from "./axiosClient.js";
import { extractArray, extractMaterials, extractPayload, normalizeMaterial } from "./apiUtils.js";

export async function getMaterials(filters = {}) {
  const page = Number(filters.page) || 1;
  const pageSize = Number(filters.pageSize) || 12;
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      params.set(key, String(value).trim());
    }
  });

  const query = params.toString();
  const response = await axiosClient.get(`/materials${query ? `?${query}` : ""}`);
  const payload = extractPayload(response) ?? {};
  const items = extractMaterials(response);
  const departments = [...new Set(items.map((item) => item.department).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b),
  );

  return {
    items,
    total: Number(payload?.total ?? payload?.totalCount ?? items.length),
    totalPages:
      Number(payload?.totalPages) ||
      Math.max(1, Math.ceil(Number(payload?.total ?? items.length) / pageSize)),
    page: Number(payload?.page ?? page),
    pageSize: Number(payload?.pageSize ?? pageSize),
    departments,
  };
}

export async function getMaterial(id) {
  const response = await axiosClient.get(`/materials/${id}`);
  const payload = extractPayload(response) ?? {};
  return normalizeMaterial(payload?.material ?? payload);
}

export const getMaterialById = getMaterial;

export async function getDocuments() {
  const response = await axiosClient.get("/documents");
  return extractArray(response, ["documents", "items", "materials"]).map(normalizeMaterial);
}

export async function uploadMaterial(payload, onUploadProgress) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await axiosClient.post("/materials/upload", formData, { onUploadProgress });
  return normalizeMaterial(extractPayload(response));
}

export async function uploadDocument(payload) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await axiosClient.post("/documents/upload", formData);
  return normalizeMaterial(extractPayload(response));
}

export async function updateMaterial(id, data) {
  const response = await axiosClient.put(`/materials/${id}`, data);
  return normalizeMaterial(extractPayload(response));
}

export async function deleteMaterial(id) {
  return axiosClient.delete(`/materials/${id}`);
}

export async function viewMaterial(id) {
  return axiosClient.post(`/materials/${id}/view`, {});
}

export const logMaterialView = viewMaterial;

export async function getLecturerStats() {
  return extractPayload(await axiosClient.get("/users/lecturer-stats")) ?? {};
}

export async function getLecturerMaterials() {
  return extractMaterials(await axiosClient.get("/materials/my-uploads")).map((item) => ({
    ...item,
    status: item.status ?? "Pending",
  }));
}

export async function getStudentStats() {
  return extractPayload(await axiosClient.get("/users/stats")) ?? {};
}

export async function getViewHistory() {
  const response = await axiosClient.get("/users/history");
  return extractArray(response, ["history", "items"]).map((item) => ({
    materialId: String(item?.materialId ?? item?.id ?? item?._id ?? ""),
    title: item?.title ?? "",
    courseCode: item?.courseCode ?? "",
    department: item?.department ?? "",
    viewedAt: item?.viewedAt ?? item?.createdAt ?? "",
  }));
}
