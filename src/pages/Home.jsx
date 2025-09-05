// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { fetchNotes } from "../services/notesAPI.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NoteCard from "../components/NoteCard.jsx";

export default function Home() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // fetch notes from backend
    const getNotes = async () => {
      try {
        const res = await fetchNotes();
        setNotes(res);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };
    getNotes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Library Heading */}
      <section className="py-10">
        <h1 className="text-3xl font-semibold text-center mb-8 mt-8">Library</h1>

        {/* Notes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-6">
          {notes.length > 0 ? (
            notes.map((note) => <NoteCard key={note._id} note={note} />)
          ) : (
            <p className="text-center text-gray-500 w-full">
              No notes uploaded yet.
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
