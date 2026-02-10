import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { IoArrowBack, IoDownloadOutline, IoExpandOutline } from "react-icons/io5";
import Footer from "../components/Footer";

export default function ViewPastQuestion() {
  const [pq, setPq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchPQ = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetching metadata for the Past Question
        const res = await fetch(`https://apiunibib.onrender.com/api/v1/books/${id}`);
        if (!res.ok) throw new Error("Failed to fetch past question");
        const data = await res.json();
        setPq(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPQ();
  }, [id]);

  const downloadImage = async (imageUrl, filename) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "past-question.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setShowPopup(true);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-100 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-500 font-['DM_Sans']">
      ⚠️ {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] font-['DM_Sans'] flex flex-col">
      {/* Premium Sticky Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-blue-50 rounded-full transition-colors text-gray-600">
              <IoArrowBack size={20} />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-[200px] md:max-w-md">
                {pq?.title}
              </h1>
              <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest mt-1">
                {pq?.courseCode} • Past Question
              </p>
            </div>
          </div>
          
          <button
            onClick={() => downloadImage(pq?.image || pq?.previewUrl, `${pq?.courseCode}-PQ.jpg`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 shadow-lg transition-all active:scale-95"
          >
            <IoDownloadOutline size={18} />
            <span className="hidden md:inline">Download Image</span>
          </button>
        </div>
      </header>

      {/* Main Content / Image Viewer */}
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-2xl shadow-blue-900/5 rounded-[2.5rem] overflow-hidden border border-blue-50"
          >
            {/* Top Metadata Bar */}
            <div className="px-8 py-4 bg-gray-50/50 border-b border-gray-100 flex justify-between items-center text-[12px] text-gray-500 font-medium">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Uploaded
              </span>
              <span>Exam Year: {pq?.year || "N/A"}</span>
            </div>

            {/* Image Container */}
            <div className="bg-gray-100/50 p-4 md:p-8 flex justify-center group relative">
              <img 
                src={pq?.image || pq?.previewUrl} 
                alt="Past Question Content"
                className="max-w-full h-auto rounded-xl shadow-xl border border-white"
              />
              <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-blue-600">
                    <IoExpandOutline size={20} />
                 </button>
              </div>
            </div>

            {/* Bottom Details */}
            <div className="p-8 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-tight">Resource Description</h4>
                <p className="text-sm text-gray-500 font-normal leading-relaxed">
                   This past question for {pq?.courseCode} was uploaded to help students prepare for their upcoming exams. Please ensure you cross-check solutions with current lecture notes.
                </p>
            </div>
          </Motion.div>
        </div>
      </main>

      {/* Success Popup (Same Premium Style) */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blue-900/20 backdrop-blur-sm">
            <Motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-2xl border border-white"
            >
              <div className="text-5xl mb-6">📝</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">Study hard!</h2>
              <p className="text-gray-500 font-normal text-sm leading-relaxed mb-8">
                Helping others is the best way to learn. Have the notes for this course? Upload them now!
              </p>
              <div className="space-y-3">
                <Link 
                  to="/upload"
                  className="block w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                  Upload Notes
                </Link>
                <button 
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 font-normal text-xs hover:text-gray-600 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </Motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}