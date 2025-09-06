import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NoteCard from "../components/NoteCard.jsx";
import NoteCardLoader from "../components/NoteCardLoader.jsx";

export default function SearchPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("q") || "";

  useEffect(() => {
    const getNotes = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://apiunibib.onrender.com/api/v1/books?search=${search}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = await res.json();

        setNotes(data.data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };
    getNotes();
  }, [search]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <section className="py-10 max-w-6xl mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-8 mt-8 ">
          Search Results for <span className="text-blue-600">"{search}"</span>
        </h2>

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
              <p className="text-gray-500 w-full">Note not found.</p>
            )}
          </>
        )}
      </section>
      <Footer />
    </div>
  );
}
