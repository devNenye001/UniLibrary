import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Upload = () => {
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
      setMessage("Please select a file before uploading.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("courseCode", courseCode);
      formData.append("year", year);
      formData.append("file", file);

      const res = await fetch("https://apiunibib.onrender.com/api/v1/books", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      console.log(data);
      setMessage("✅ File uploaded successfully!");

      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-[80%] max-w-3xl">
          <h1 className="text-3xl text-gray-800 mb-6 mt-6 text-center">
            Upload Lecture Notes
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <input
              type="text"
              placeholder="Enter the Course Title"
              className="block w-full text-base text-gray-700 border border-gray-300 rounded-lg px-2 py-3"
              value={title}
              name="title"
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Course Code */}
            <input
              type="text"
              placeholder="Enter the Course Code"
              className="block w-full text-base text-gray-700 border border-gray-300 rounded-lg px-2 py-3"
              name="code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              required
            />

            {/* Year */}
            <input
              type="text"
              placeholder="Enter the Year You’re uploading this note"
              className="block w-full text-base text-gray-700 border border-gray-300 rounded-lg px-2 py-3"
              name="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />

            <h3 className="text-lg text-gray-600 mb-3">
              Upload your file (pdf)
            </h3>

            {/* File Upload */}
            <input
              type="file"
              accept=".pdf"
              className="block w-full text-base text-gray-700
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:text-sm file:font-semibold
                         file:bg-gray-300 file:text-black
                         hover:file:bg-gray-200
                         border border-gray-300 rounded-lg
                         px-2 py-2"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />

            {/* Submit */}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700 text-base font-semibold disabled:opacity-50"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </form>

          {/* Message */}
          {message && (
            <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Upload;
