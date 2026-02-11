import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { IoCloudUploadOutline, IoDocumentTextOutline, IoImageOutline } from "react-icons/io5";
import { uploadResource } from "../services/notesAPI.js";

const Upload = () => {
  const [activeTab, setActiveTab] = useState("note"); // "note" or "pq"
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("⚠️ Please select a file before uploading.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await uploadResource({
        title,
        courseCode,
        year,
        // no explicit type field; backend treats all as books
        file, // appended under key "file" in the service
      });

      setMessage("✅ Resource uploaded successfully! Redirecting...");
      setTimeout(() => navigate("/library"), 2500);
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage(`❌ Error uploading file: ${err.message || "Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-['DM_Sans']">
      <Navbar />

      <main className="grow flex flex-col items-center py-16 px-6">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Share Your Knowledge
          </h1>
          <p className="text-gray-500 mt-2 font-normal">
            Help fellow students by contributing to the library.
          </p>
        </div>

        {/* Segmented Toggle */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-blue-50 flex gap-1 mb-12 w-full max-w-md">
          <button
            onClick={() => setActiveTab("note")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "note" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-500 hover:bg-blue-50"
            }`}
          >
            <IoDocumentTextOutline size={18} />
            Lecture Note
          </button>
          <button
            onClick={() => setActiveTab("pq")}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              activeTab === "pq" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-gray-500 hover:bg-blue-50"
            }`}
          >
            <IoImageOutline size={18} />
            Past Question
          </button>
        </div>

        {/* Form Card */}
        <Motion.div 
          layout
          className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-900/5 border border-blue-50 w-full max-w-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="title"
                  className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder={activeTab === "note" ? "e.g. Intro to Psych Notes" : "e.g. CSC 201 Midterm"}
                  className="block w-full text-base border-transparent rounded-2xl px-5 py-4 bg-blue-50/40 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="courseCode"
                  className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1"
                >
                  Course Code
                </label>
                <input
                  id="courseCode"
                  name="courseCode"
                  type="text"
                  placeholder="e.g. CSC 201"
                  className="block w-full text-base border-transparent rounded-2xl px-5 py-4 bg-blue-50/40 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="year"
                  className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1"
                >
                  Year
                </label>
                <input
                  id="year"
                  name="year"
                  type="text"
                  placeholder="e.g. 2026"
                  className="block w-full text-base border-transparent rounded-2xl px-5 py-4 bg-blue-50/40 focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-gray-300 font-normal"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                />
              </div>

            </div>

            <div className="space-y-2">
              <label
                htmlFor="file"
                className="text-xs font-semibold text-gray-400 uppercase tracking-widest ml-1"
              >
                {activeTab === "note" ? "PDF Document" : "Past Question File"}
              </label>
              <div className="relative group">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept={activeTab === "note" ? ".pdf" : "image/*"}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <div className="border-2 border-dashed border-blue-100 group-hover:border-blue-300 group-hover:bg-blue-50/30 transition-all rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                  <IoCloudUploadOutline size={32} className="text-blue-400 mb-2" />
                  <p className="text-sm font-semibold text-gray-700">
                    {file ? file.name : `Click to upload ${activeTab === "note" ? "PDF" : "File"}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1 font-normal">Max size: 10MB</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-base hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? "Uploading..." : `Upload ${activeTab === "note" ? 'Notes' : 'Question'}`}
            </button>
          </form>

          <AnimatePresence>
            {message && (
              <Motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center text-sm font-semibold text-gray-600"
              >
                {message}
              </Motion.p>
            )}
          </AnimatePresence>
        </Motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;