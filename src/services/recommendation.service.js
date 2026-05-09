import axiosClient from "./axiosClient.js";
import { extractArray, extractMaterials, normalizeMaterial } from "./apiUtils.js";

export async function getRecommendations() {
  return extractMaterials(await axiosClient.get("/recommendations"));
}

export async function getPopular(department) {
  const params = department ? `?department=${encodeURIComponent(department)}` : "";
  return extractMaterials(await axiosClient.get(`/recommendations/popular${params}`));
}

export async function getSimilar(id) {
  return extractMaterials(await axiosClient.get(`/materials/${id}/recommendations`));
}

export async function getRecommendationsByRole(role = "student") {
  return extractArray(
    await axiosClient.get(`/documents/recommendations?role=${encodeURIComponent(role)}`),
    ["documents", "items", "materials", "results"],
  ).map(normalizeMaterial);
}
