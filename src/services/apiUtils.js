export function extractPayload(response) {
  return response?.data ?? response ?? null;
}

export function extractArray(response, keys = []) {
  const payload = extractPayload(response);
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    const value = payload?.[key];
    if (Array.isArray(value)) return value;
  }

  for (const key of keys) {
    const nested = payload?.data?.[key];
    if (Array.isArray(nested)) return nested;
  }

  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function normalizeUser(user) {
  const approved =
    typeof user?.approved === "boolean"
      ? user.approved
      : String(user?.status ?? "").toLowerCase() === "approved" ||
        String(user?.status ?? "").toLowerCase() === "active";

  return {
    ...user,
    id: String(user?.id ?? user?._id ?? user?.userId ?? ""),
    name: user?.name ?? user?.fullName ?? "Unnamed User",
    email: user?.email ?? "",
    role: String(user?.role ?? "student").toLowerCase(),
    department: user?.department ?? user?.faculty ?? "",
    level: user?.level ? String(user.level) : "",
    approved,
    status: approved ? "Approved" : "Pending",
    createdAt: user?.createdAt ?? user?.dateRegistered ?? user?.registeredAt ?? "",
  };
}

export function normalizeMaterial(material) {
  if (!material) return null;

  return {
    ...material,
    id: String(material.id ?? material._id ?? material.slug ?? ""),
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
    uploadedBy: (() => {
      const raw = material.uploadedBy ?? material.uploaded_by;
      if (raw && typeof raw === "object") return raw.name ?? raw.email ?? "";
      return raw ?? material.author ?? material.uploaderName ?? material.lecturerName ?? "";
    })(),
    downloads: Number(material.downloads ?? material.downloadCount ?? 0),
    downloadCount: Number(material.downloads ?? material.downloadCount ?? 0),
    views: Number(material.views ?? material.viewCount ?? 0),
    viewCount: Number(material.views ?? material.viewCount ?? 0),
    fileUrl:
      material.fileUrl ??
      material.file_url ??
      material.url ??
      material.file?.url ??
      material.documentUrl ??
      "",
    fileName:
      material.fileName ?? material.file_name ?? material.title ?? "material.pdf",
    status:
      material.status ??
      (typeof material.approved === "boolean"
        ? material.approved
          ? "Approved"
          : "Pending"
        : undefined),
    tags: Array.isArray(material.tags) ? material.tags : [],
    description: material.description ?? "",
    createdAt: material.createdAt ?? material.uploadDate ?? material.uploadedAt ?? "",
    similarityScore: material.similarityScore ?? material.score ?? null,
  };
}

export function extractUsers(response) {
  return extractArray(response, ["users", "items"]).map(normalizeUser);
}

export function extractMaterials(response) {
  return extractArray(response, ["items", "materials", "documents", "results"]).map(
    normalizeMaterial,
  );
}

export function extractStats(response) {
  return extractPayload(response) ?? {};
}

export function extractSession(response) {
  const payload = extractPayload(response) ?? {};
  // response.data (the nested 'data' key) is what extractPayload returns,
  // but the token lives at the top-level response, so read both.
  const user = response?.user ?? payload?.user ?? payload?.data?.user ?? null;

  return {
    token: response?.token ?? payload?.token ?? payload?.data?.token ?? "",
    user: user ? normalizeUser(user) : null,
    message: response?.message ?? payload?.message ?? payload?.data?.message ?? "",
  };
}
