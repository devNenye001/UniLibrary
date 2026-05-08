import axiosClient from "./axiosClient.js";
import { getAllDocuments, normalizeMaterial, wait } from "./_helpers.js";

export async function semanticSearch(query) {
  try {
    const data = await axiosClient.post("/search", { query });
    const payload = data?.data ?? data ?? {};
    const rawItems = Array.isArray(payload)
      ? payload
      : payload.results ?? payload.materials ?? payload.documents ?? [];
    return rawItems.map(normalizeMaterial);
  } catch {
    await wait(300);
    const q = query.trim().toLowerCase();
    return getAllDocuments()
      .map(normalizeMaterial)
      .filter((m) =>
        [m.title, m.courseCode, m.department, m.academicSession, m.description, ...(m.tags ?? [])]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .map((m) => ({
        ...m,
        similarityScore: Math.min(
          0.99,
          0.62 + (m.title.toLowerCase().includes(q) ? 0.2 : 0),
        ),
      }));
  }
}

export async function keywordSearch(query) {
  try {
    const data = await axiosClient.get(`/documents/search?q=${encodeURIComponent(query)}`);
    return data?.documents ?? data?.data ?? data ?? [];
  } catch {
    await wait(250);
    const q = query.trim().toLowerCase();
    return getAllDocuments().filter((doc) =>
      [
        doc.title,
        doc.courseCode,
        doc.department,
        doc.type,
        doc.description,
        ...(doc.tags ?? []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }
}
