// src/pages/ReadBook.jsx
import { useEffect, useState } from "react";

export default function ReadBook() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(
          "https://apiunibib.onrender.com/api/v1/books/68b858010a9c0be3b68d09bd"
        );
        if (!res.ok) throw new Error("Failed to fetch book");
        const data = await res.json();
        setBook(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-red-500 font-medium">⚠️ {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">📘 {book?.title}</h1>
          <span className="text-sm text-gray-500">
            {book?.course} • {book?.year} Level
          </span>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 flex flex-col items-center py-6">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Book Meta */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">
              {book?.title}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Course Code: <span className="font-medium">{book?.course}</span>
            </p>
            <p className="text-gray-500 text-sm">
              Uploaded: {new Date(book?.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* PDF Frame */}
          <div className="relative bg-gray-50">
            <iframe
              src={book?.fileUrl}
              title={book?.title}
              className="w-full h-[80vh]"
              frameBorder="0"
            ></iframe>
            <div className="absolute top-3 right-3">
              <a
                href={book?.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} UniLibrary — All rights reserved.
      </footer>
    </div>
  );
}
