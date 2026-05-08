import axiosClient from "./axiosClient.js";
import { getAllDocuments, normalizeMaterial, wait } from "./_helpers.js";

export async function getRecommendations() {
  try {
    const data = await axiosClient.get("/recommendations");
    const items = data?.documents ?? data?.data ?? data ?? [];
    return items.map(normalizeMaterial);
  } catch {
    await wait(250);
    return getAllDocuments()
      .filter((d) => ["Past Question", "Lecture Note", "Study Guide"].includes(d.type))
      .map(normalizeMaterial)
      .slice(0, 6);
  }
}

export async function getPopular(department) {
  try {
    const params = department ? `?department=${encodeURIComponent(department)}` : "";
    const data = await axiosClient.get(`/recommendations/popular${params}`);
    const items = data?.documents ?? data?.data ?? data ?? [];
    return items.map(normalizeMaterial);
  } catch {
    await wait(250);
    return getAllDocuments().map(normalizeMaterial).slice(0, 4);
  }
}

export async function getSimilar(id) {
  try {
    const data = await axiosClient.get(`/materials/${id}/recommendations`);
    const payload = data?.data ?? data ?? {};
    const rawItems = Array.isArray(payload)
      ? payload
      : payload.materials ?? payload.items ?? payload.documents ?? [];
    return rawItems.map(normalizeMaterial);
  } catch {
    await wait(220);
    const all = getAllDocuments().map(normalizeMaterial);
    const current = all.find((item) => item.id === String(id));
    if (!current) return [];
    const prefix = current.courseCode.split(" ")[0];
    return all
      .filter(
        (item) =>
          item.id !== current.id &&
          (item.department === current.department ||
            item.level === current.level ||
            item.courseCode.split(" ")[0] === prefix),
      )
      .slice(0, 3);
  }
}

// Role-based variant used by legacy pages
export async function getRecommendationsByRole(role = "student") {
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
