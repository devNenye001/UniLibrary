import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchNotes } from "../services/notesAPI.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NoteCard from "../components/NoteCard.jsx";

export default function SearchPage() {
  const [notes, setNotes] = useState([]);
  const [results, setResults] = useState([]);
  const location = useLocation();

  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("q") || "";

  useEffect(() => {
    const getNotes = async () => {
      try {
        const res = await fetchNotes();
        setNotes(res);

        // filter results by query
        if (search.trim()) {
          const filtered = res.filter(
            (note) =>
              note.title.toLowerCase().includes(search.toLowerCase()) ||
              note.course.toLowerCase().includes(search.toLowerCase()) ||
              note.year.toString().includes(search.toLowerCase())
          );
          setResults(filtered);
        } else {
          setResults(res);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    };
    getNotes();
  }, [search]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="py-10">
        <h2 className="text-2xl font-semibold mb-8 mt-8 mx-6">
          Search Results for <span className="text-indigo-600">"{search}"</span>
        </h2>

        {/* Notes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-6">
          {results.length > 0 ? (
            results.map((note) => <NoteCard key={note._id} note={note} />)
          ) : (
            <p className="text-center text-gray-500 w-full">No results found.</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
