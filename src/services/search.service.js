import axiosClient from "./axiosClient.js";
import { extractArray, extractMaterials, normalizeMaterial } from "./apiUtils.js";

export async function semanticSearch(query) {
  return extractMaterials(await axiosClient.post("/search", { query }));
}

export async function keywordSearch(query) {
  return extractArray(
    await axiosClient.get(`/documents/search?q=${encodeURIComponent(query)}`),
    ["documents", "items", "materials", "results"],
  ).map(normalizeMaterial);
}
