import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import Footer from "../components/layouts/Footer.jsx";
import Navbar from "../components/layouts/Navbar.jsx";
import { searchDocuments } from "../services/api.js";

export default function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  const query = useMemo(() => new URLSearchParams(location.search).get("q") || "", [location.search]);

  useEffect(() => {
    document.title = "GoLibrary | Search";
  }, []);

  useEffect(() => {
    const runSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await searchDocuments(query);
        setResults(data);
      } catch (searchError) {
        setError(searchError.message || "Search failed.");
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-campus-100 text-campus-700">
              <IoSearchOutline className="text-xl" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">
                {query ? `Results for "${query}"` : "Search the GoLibrary archive"}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
            Search by course code, topic, document title, or department to find the most relevant academic material.
          </p>

          {error ? (
            <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mt-8 grid gap-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-28 animate-pulse rounded-[1.5rem] bg-slate-100" />
              ))
            ) : results.length ? (
              results.map((document) => (
                <article key={document.id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-campus-600">
                        {document.courseCode} • {document.department}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-900">{document.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{document.description}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                      {document.type}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(document.tags ?? []).map((tag) => (
                      <span key={tag} className="rounded-full bg-campus-100 px-3 py-1 text-xs font-medium text-campus-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <p className="text-lg font-semibold text-slate-900">No documents found</p>
                <p className="mt-2 text-sm text-slate-500">
                  Try a course code like `CSC 401`, a topic like `machine learning`, or a department name.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
