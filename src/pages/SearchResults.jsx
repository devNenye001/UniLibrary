import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import NoteCard from "../components/NoteCard.jsx";
import NoteCardLoader from "../components/NoteCardLoader.jsx";
import PastQuestionCard from "../components/PastQuestionCard.jsx";
import PastQuestionLoader from "../components/PastQuestionLoader.jsx";
import { motion as Motion } from "framer-motion";
import { fetchBooks } from "../services/notesAPI.js";

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("q") || "";

  useEffect(() => {
    const getResults = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks({ search });
        setResults(data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    if (search) getResults();
  }, [search]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-['DM_Sans']">
      <Navbar />

      <main className="grow py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Search Header */}
          <div className="mb-12">
            <Motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-3xl font-semibold text-gray-900 tracking-tight"
            >
              Results for <span className="text-blue-600">"{search}"</span>
            </Motion.h2>
            {!loading && (
              <p className="text-gray-500 text-sm mt-2 font-normal">
                Found {results.length} resources matches for your query.
              </p>
            )}
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                // Alternating loaders for a balanced look
                i % 2 === 0 ? <NoteCardLoader key={i} /> : <PastQuestionLoader key={i} />
              ))}
            </div>
          ) : (
            <>
              {results.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {results.map((item, i) => (
                    // Logic to render either Note or PQ Card
                    item.type === "pq" ||
                    item.category === "past-question" ||
                    ["jpg", "jpeg", "png", "webp", "gif"].includes(item?.file?.format?.toLowerCase?.()) ? (
                      <PastQuestionCard key={i} pq={item} />
                    ) : (
                      <NoteCard key={i} note={item} />
                    )
                  ))}
                </div>
              ) : (
                <Motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-24 text-center"
                >
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-900">No matches found</h3>
              
                </Motion.div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}