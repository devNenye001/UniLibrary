import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  IoArrowForward,
  IoSearchOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import MaterialCard from "../../components/MaterialCard.jsx";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import { searchMaterials } from "../../services/api.js";

function MaterialCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="h-6 w-24 rounded-full bg-slate-100" />
        <div className="h-6 w-20 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 h-5 w-full rounded-xl bg-slate-100" />
      <div className="mt-2 h-4 w-4/5 rounded-xl bg-slate-100" />
      <div className="mt-3 flex gap-3">
        <div className="h-3 w-24 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
      <div className="mt-5 h-10 w-full rounded-2xl bg-slate-100" />
    </div>
  );
}

function formatScore(score) {
  if (score == null || Number.isNaN(Number(score))) return null;
  const numericScore = Number(score);
  if (numericScore <= 1) return `${Math.round(numericScore * 100)}% match`;
  return `${Math.round(numericScore)}% match`;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(queryParam);
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "UniLibrary | Search";
  }, []);

  useEffect(() => {
    const trimmed = queryParam.trim();
    setQuery(trimmed);

    if (trimmed) {
      const performSearch = async () => {
        setLoading(true);
        setError("");
        setSubmittedQuery(trimmed);
        try {
          const data = await searchMaterials(trimmed);
          setResults(data);
        } catch (searchError) {
          setError(searchError.message || "Unable to search materials right now.");
          setResults([]);
        } finally {
          setLoading(false);
        }
      };
      performSearch();
    } else {
      setSubmittedQuery("");
      setResults([]);
      setError("");
    }
  }, [queryParam]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;
    setSearchParams({ q: trimmedQuery });
  };

  return (
    <StudentLayout>
      <div className="px-6 py-8">
        <div className="mx-auto max-w-4xl">
          {!queryParam && (
            <form onSubmit={handleSubmit} className="w-full md:hidden">
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <IoSearchOutline className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
                    <input
                      className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 py-4 pl-13 pr-4 text-sm outline-none transition focus:border-campus-600 focus:bg-white focus:ring-4 focus:ring-campus-100"
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="e.g. 300 level civil engineering past questions 2022"
                      type="search"
                      value={query}
                    />
                  </div>
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-campus-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading || !query.trim()}
                    type="submit"
                  >
                    {loading ? "Searching..." : "Search"}
                    {!loading ? <IoArrowForward /> : null}
                  </button>
                </div>
              </div>
            </form>
          )}

          {submittedQuery ? (
            <p className="mt-5 text-sm font-medium text-slate-500">
              {loading ? "Searching..." : `Results for "${submittedQuery}"`}
            </p>
          ) : null}

          {error ? (
            <div className="mt-6 w-full rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-left text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, index) => <MaterialCardSkeleton key={index} />)
              : results.length
                ? results.map((item) => (
                    <MaterialCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      courseCode={item.courseCode}
                      department={item.department}
                      level={item.level}
                      academicSession={item.academicSession ?? item.year ?? item.session}
                      downloadCount={item.downloadCount}
                      fileUrl={item.fileUrl}
                      badge={
                        formatScore(item.similarityScore ?? item.score) ? (
                          <span className="inline-flex rounded-full bg-campus-50 px-3 py-1 text-xs font-medium text-campus-700">
                            {formatScore(item.similarityScore ?? item.score)}
                          </span>
                        ) : null
                      }
                      actionLabel="Open material"
                      onView={({ id }) => navigate(`/materials/${id}`)}
                    />
                  ))
                : submittedQuery && !error
                  ? (
                    <div className="col-span-full rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                      <p className="text-lg font-semibold text-slate-900">
                        No close matches found
                      </p>
                      <p className="mt-2 text-sm leading-7 text-slate-500">
                        Try simplifying your request or use Browse to filter by department,
                        level, course code, and session.
                      </p>
                      <button
                        className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-campus-700 transition hover:border-slate-300 hover:bg-slate-50"
                        onClick={() => navigate("/browse")}
                        type="button"
                      >
                        Go to Browse
                        <IoArrowForward />
                      </button>
                    </div>
                  )
                  : null}
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}
