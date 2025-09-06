// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { fetchNotes } from "../services/notesAPI.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NoteCard from "../components/NoteCard.jsx";
import NoteCardLoader from "../components/NoteCardLoader.jsx";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // fetch notes from backend
    const getNotes = async () => {
      // Set loading to true before fetching
      setLoading(true);

      // Fetch notes and ensure loading is set to false afterwards
      const response = await fetchNotes().finally(() => setLoading(false));

      // Update state with fetched notes
      setNotes(response);
    };

    // Call the async function to fetch notes
    getNotes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Library Heading */}
      <section className="py-10 ">
        <h1 className="text-3xl font-semibold text-center mb-8 mt-8">
          Library
        </h1>
        {/* Notes Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 mx-auto lg:grid-cols-4 gap-6 max-w-6xl ">
            {Array.from({ length: 8 }).map((_, i) => (
              <NoteCardLoader key={i} />
            ))}
          </div>
        ) : (
          <>
            {notes.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 mx-auto lg:grid-cols-4 gap-6 max-w-6xl ">
                {notes.map((note, i) => (
                  <NoteCard key={i} note={note} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 w-full">No notes uploaded yet.</p>
            )}
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
