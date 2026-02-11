const BASE_URL = "https://unilibrary-server.onrender.com/api/v1";

export function getBookReadUrl(slug) {
  return `${BASE_URL}/books/${encodeURIComponent(slug)}/read`;
}

export async function fetchBooks(params = {}) {
  // Keep URLs simple like Postman examples:
  // GET {{baseURL}}/books
  // GET {{baseURL}}/books?search=...
  const search = params?.search
    ? `?search=${encodeURIComponent(params.search)}`
    : "";

  const response = await fetch(`${BASE_URL}/books${search}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch books");
  }
  return data?.data ?? [];
}

export async function fetchBookBySlug(slug) {
  const response = await fetch(`${BASE_URL}/books/${encodeURIComponent(slug)}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch book");
  }
  return data?.data ?? null;
}

// Unified uploader for both lecture notes and past questions.
// Backend expects: title, courseCode, year in req.body,
// and uploaded files in req.files.file and req.files.image.
// We send the same file for both `file` and `image` to satisfy validation.
export async function uploadResource({ title, courseCode, year, file }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("courseCode", courseCode);
  formData.append("year", year);
  formData.append("file", file);   // for the main document (req.files.file)
  formData.append("image", file);  // for thumbnail / image (req.files.image)

  const response = await fetch(`${BASE_URL}/books`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to upload resource");
  }
  return data?.data ?? null;
}

// Backwards-compatible exports (so existing imports don't crash)
export const fetchNotes = fetchBooks;
export const uploadNote = uploadResource;
