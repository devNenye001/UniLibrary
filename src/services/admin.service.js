import axiosClient from "./axiosClient.js";
import {
  extractMaterials,
  extractPayload,
  extractStats,
  extractUsers,
} from "./apiUtils.js";

export async function getStats() {
  return extractStats(await axiosClient.get("/admin/stats"));
}

export async function getUsers() {
  return extractUsers(await axiosClient.get("/admin/users"));
}

export async function getPendingUsers() {
  return extractUsers(await axiosClient.get("/admin/pending-users"));
}

export async function approveUser(userId) {
  return extractPayload(await axiosClient.put(`/admin/users/${userId}/approve`, {}));
}

export async function rejectUser(userId) {
  return extractPayload(await axiosClient.put(`/admin/users/${userId}/reject`, {}));
}

export async function getPendingMaterials() {
  return extractMaterials(await axiosClient.get("/admin/materials/pending")).map((item) => ({
    ...item,
    lecturerName: item.uploadedBy ?? item.lecturerName ?? "",
    status: item.status ?? "Pending",
  }));
}

export async function approveMaterial(materialId) {
  return extractPayload(await axiosClient.put(`/admin/materials/${materialId}/approve`, {}));
}

export async function rejectMaterial(materialId) {
  return extractPayload(await axiosClient.put(`/admin/materials/${materialId}/reject`, {}));
}
