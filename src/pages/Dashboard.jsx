import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoArrowForward,
  IoCalendarOutline,
  IoDocumentTextOutline,
  IoSchoolOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import Footer from "../components/layouts/Footer.jsx";
import Navbar from "../components/layouts/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getDocuments, getRecommendations } from "../services/api.js";

export default function Dashboard() {
  const { role, user, hasRole } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "GoLibrary | Dashboard";
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [documentResults, recommendationResults] = await Promise.all([
          getDocuments(),
          getRecommendations(role),
        ]);

        setDocuments(documentResults);
        setRecommendations(recommendationResults);
      } catch (requestError) {
        setError(requestError.message || "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [role]);

  const stats = [
    { label: "Documents", value: documents.length, icon: <IoDocumentTextOutline /> },
    { label: "Recommendations", value: recommendations.length, icon: <IoSparklesOutline /> },
    { label: "Role", value: role, icon: <IoSchoolOutline /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="grid gap-6 rounded-4xl bg-[linear-gradient(135deg,#0d1c30_0%,#173456_60%,#234876_100%)] px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h1 className="text-4xl font-semibold leading-tight">
              Welcome back, {user?.name || "Scholar"}.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              GoLibrary gives you a focused view of documents, AI recommendations, and role-specific actions for your academic workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-campus-700 transition hover:bg-slate-100" to="/search">
                Search documents
              </Link>
              {hasRole(["lecturer", "admin"]) ? (
                <Link className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10" to="/upload">
                  Upload new material
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-200">{stat.label}</p>
                  <span className="text-lg text-sky-200">{stat.icon}</span>
                </div>
                <p className="mt-4 text-3xl font-semibold capitalize">{stat.value}</p>
              </div>
            ))}
          </div>
        </section>

        {error ? (
          <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Library</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent documents</h2>
              </div>
              <Link className="inline-flex items-center gap-2 text-sm font-semibold text-campus-700 hover:text-campus-900" to="/search">
                View all
                <IoArrowForward />
              </Link>
            </div>

            {loading ? (
              <div className="mt-6 grid gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-3xl bg-slate-100" />
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {documents.slice(0, 5).map((document) => (
                  <article key={document.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-campus-600">
                          {document.courseCode}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold text-slate-900">{document.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-slate-600">{document.description}</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                        {document.type}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <IoSchoolOutline />
                        {document.department}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <IoCalendarOutline />
                        {document.year}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">AI Picks</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recommended for your role</h2>
              <div className="mt-6 grid gap-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-100" />
                  ))
                ) : recommendations.length ? (
                  recommendations.map((item) => (
                    <div key={item.id} className="rounded-3xl bg-campus-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-campus-600">
                        {item.courseCode}
                      </p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No recommendations available yet.</p>
                )}
              </div>
            </section>

            <section className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Role Access</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-600">
                <div className="rounded-3xl bg-slate-50 px-4 py-4">
                  Students can search and view documents across the archive.
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-4">
                  Lecturers can upload lecture notes, revision packs, and academic resources.
                </div>
                <div className="rounded-3xl bg-slate-50 px-4 py-4">
                  Admins can review system metrics from the GoLibrary admin panel.
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
