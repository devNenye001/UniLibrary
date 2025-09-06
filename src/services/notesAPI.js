// Simulate fetching notes from backend
export async function fetchNotes() {
  try {
    // Send GET request to backend API
    const response = await fetch(
      "https://apiunibib.onrender.com/api/v1/books",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Parse JSON response
    const data = await response.json();

    // Check if response is ok
    if (response.ok) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch notes");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

// Simulate uploading to backend
export async function uploadNote(formData) {
  try {
    // Send GET request to backend API
    const response = await fetch(
      "https://apiunibib.onrender.com/api/v1/books",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: formData,
      }
    );

    // Parse JSON response
    const data = await response.json();

    // Check if response is ok
    if (response.ok) {
      return data.data;
    } else {
      throw new Error(data.message || "Failed to upload note");
    }
  } catch (error) {
    console.error("Failed to upload note:", error);
    return null;
  }
}
