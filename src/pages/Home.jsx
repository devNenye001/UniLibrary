import { useEffect, useState } from "react";
import { fetchBooks } from "../services/notesAPI.js";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import NoteCard from "../components/NoteCard.jsx";
import NoteCardLoader from "../components/NoteCardLoader.jsx";

import PastQuestionCard from "../components/PastQuestionCard.jsx";
import PastQuestionLoader from "../components/PastQuestionLoader.jsx";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [pastQuestions, setPastQuestions] = useState([]);

  useEffect(() => {
    const getLibraryData = async () => {
      setLoading(true);
      try {
        const books = await fetchBooks();

        const isImage = (item) => {
          const format = item?.file?.format?.toLowerCase?.();
          if (item?.type === "pq" || item?.category === "past-question") return true;
          if (!format) return false;
          return ["jpg", "jpeg", "png", "webp", "gif"].includes(format);
        };

        setNotes(books.filter((item) => !isImage(item)));
        setPastQuestions(books.filter((item) => isImage(item)));
      } catch (err) {
        console.error("Failed to fetch library data:", err);
      } finally {
        setLoading(false);
      }
    };

    getLibraryData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <Navbar />

      {/* ===== Page Heading ===== */}
      <section className="pt-20 pb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
          E-Library
        </h1>
        <p className="text-gray-500 mt-3">
          Access lecture notes and past questions shared by students and Lecturers
        </p>
      </section>

      {/* ===== Lecture Notes Section ===== */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Lecture Notes
          </h2>
          <div className="h-1 w-10 bg-blue-600 rounded-full mt-2" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto px-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <NoteCardLoader key={i} />
            ))}
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto px-6">
            {notes.map((note, i) => (
              <NoteCard key={i} note={note} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No lecture notes uploaded yet.
          </p>
        )}
      </section>

      {/* ===== Divider ===== */}
      <div className="max-w-[1200px] mx-auto px-6">
        <hr className="border-gray-100" />
      </div>

      {/* ===== Past Questions Section ===== */}
      <section className="py-12">
        <div className="max-w-[1200px] mx-auto px-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900">
            Past Questions
          </h2>
          <div className="h-1 w-10 bg-blue-600 rounded-full mt-2" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto px-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <PastQuestionLoader key={i} />
            ))}
          </div>
        ) : pastQuestions.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-[1200px] mx-auto px-6">
            {pastQuestions.map((pq, i) => (
              <PastQuestionCard key={i} pq={pq} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            No past questions uploaded yet.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
