import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { IoArrowBack, IoDownloadOutline } from "react-icons/io5";
import Footer from "../components/Footer";
import { fetchBookBySlug, getBookReadUrl } from "../services/notesAPI.js";

export default function ReadBook() {
  const [book, setBook] = useState(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBookBySlug(id);
        setBook(data);
        setUrl(getBookReadUrl(id)); // stream directly
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const downloadPdf = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowPopup(true);
  };

  /* -------------------- STATES -------------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!book) return null;

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['DM_Sans'] flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/library"
              className="p-2 hover:bg-blue-50 rounded-full transition-colors text-gray-600"
            >
              <IoArrowBack size={20} />
            </Link>

            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[200px] md:max-w-md">
                {book?.title}
              </h1>
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest mt-1">
                {book?.courseCode} • {book?.year}
              </p>
            </div>
          </div>

          <button
            onClick={() => downloadPdf(url, `${book?.title}.pdf`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-all active:scale-95"
          >
            <IoDownloadOutline size={18} />
            <span className="hidden md:inline">Download PDF</span>
          </button>
        </div>
      </header>

      {/* Reader */}
      <main className="grow p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-2xl shadow-blue-900/5 rounded-4xl overflow-hidden border border-blue-50"
          >
            {/* Metadata */}
            <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center text-[12px] text-gray-500">
              <span>Uploaded</span>
              <span>
                Date Uploaded:{" "}
                {book?.createdAt
                  ? new Date(book.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>

            {/* PDF */}
            <div className="bg-gray-200/30 p-4 md:p-10 flex justify-center">
              {url && (
                <iframe
                  src={url}
                  title={book?.title || "Book preview"}
                  className="w-full h-[75vh] rounded-xl shadow-2xl border border-white/50"
                />
              )}
            </div>
          </Motion.div>
        </div>
      </main>

      {/* Success Popup */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-blue-900/20 backdrop-blur-sm">
            <Motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl border border-white"
            >
              <div className="text-5xl mb-6">🎓</div>
              <h2 className="text-2xl font-semibold mb-3">
                Found this useful?
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Help other students by uploading your lecture notes or past
                questions.
              </p>

              <Link
                to="/upload"
                className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Upload a Resource
              </Link>

              <button
                onClick={() => setShowPopup(false)}
                className="mt-4 text-gray-400 text-xs hover:text-gray-600"
              >
                Maybe later
              </button>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
