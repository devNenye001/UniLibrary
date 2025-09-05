// src/services/notesAPI.js

// Simulate fetching notes from backend
export async function fetchNotes() {
  return [
    {
      id: 1,
      title: "CSC101 - Introduction to Computing",
      course: "CSC101",
      year: "2023",
      fileUrl: "https://example.com/csc101.pdf",
    },
    {
      id: 2,
      title: "MTH102 - Calculus Notes",
      course: "MTH102",
      year: "2022",
      fileUrl: "https://example.com/mth102.pdf",
    },
  ];
}

// Simulate uploading to backend
export async function uploadNote({ title, course, year, file }) {
  console.log("Uploading note:", { title, course, year, file });

  // Here, your backend guy will replace this with real upload logic
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1500);
  });
}
