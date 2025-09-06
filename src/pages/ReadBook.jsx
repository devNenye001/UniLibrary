// src/pages/ReadBook.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ReadBook() {
  const [book, setBook] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const [blob, data] = await Promise.all([
          fetch(`https://apiunibib.onrender.com/api/v1/books/${id}/read`).then(
            (res) => {
              if (!res.ok) throw new Error("Failed to read book");
              return res.blob();
            }
          ),
          fetch(`https://apiunibib.onrender.com/api/v1/books/${id}`).then(
            (res) => {
              if (!res.ok) throw new Error("Failed to fetch book metadata");
              return res.json();
            }
          ),
        ]);

        // Create URL for PDF blob
        const url = URL.createObjectURL(blob);

        // Update state
        setUrl(url);

        // Set book metadata
        setBook(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const downloadPdf = async (url, filename) => {
    const res = await fetch(url);
    const blob = await res.blob();
    const href = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = href;
    link.download = filename; // force download instead of opening in new tab
    document.body.appendChild(link);
    link.click();

    // cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

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
    <div className=" bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto  py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">📄 {book.title}</h1>
          <span className="text-sm text-gray-500">
            {book.courseCode} • {book.year} level
          </span>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="flex-1 flex flex-col items-center py-6">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Book Meta */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {book.title}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Course Code:{" "}
                <span className="font-medium">{book.courseCode}</span>
              </p>
              <p className="text-gray-500 text-sm">
                Uploaded: {new Date(book?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="">
              <button
                onClick={() => downloadPdf(url, `${book.title}.pdf`)}
                className="px-4 cursor-pointer py-2 inline-block bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              >
                Download PDF
              </button>
            </div>
          </div>

          {/* PDF Frame */}
          <div className="relative bg-gray-50 ">
            {url && (
              <embed
                src={url}
                type="application/pdf"
                className="h-[80vh] w-[100%] max-w-[80%] mx-auto"
              />
            )}
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
