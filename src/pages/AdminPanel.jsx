import { useEffect, useMemo, useState } from "react";
import Footer from "../components/layouts/Footer.jsx";
import Navbar from "../components/layouts/Navbar.jsx";
import { getDocuments } from "../services/api.js";

export default function AdminPanel() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "GoLibrary | Admin Panel";
  }, []);

  useEffect(() => {
    const loadAdminData = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getDocuments();
        setDocuments(data);
      } catch (requestError) {
        setError(requestError.message || "Unable to load admin data.");
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const metrics = useMemo(() => {
    const total = documents.length;
    const pastQuestions = documents.filter((item) => item.type === "Past Question").length;
    const lecturerUploads = documents.filter((item) => item.role === "lecturer").length;

    return [
      { label: "Total documents", value: total },
      { label: "Past questions", value: pastQuestions },
      { label: "Lecturer uploads", value: lecturerUploads },
    ];
  }, [documents]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-semibold text-slate-900">Platform oversight for GoLibrary</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
            Review document coverage, monitor uploads, and inspect the current academic archive from one administrative control surface.
          </p>

          {error ? (
            <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="rounded-3xl bg-campus-50 p-5">
                <p className="text-sm text-slate-500">{metric.label}</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200">
            <div className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.9fr] gap-4 bg-slate-100 px-5 py-4 text-sm font-semibold text-slate-600">
              <span>Title</span>
              <span>Course</span>
              <span>Type</span>
              <span>Uploaded by</span>
            </div>

            <div className="divide-y divide-slate-200 bg-white">
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-18 animate-pulse bg-slate-50" />
                ))
              ) : documents.length ? (
                documents.map((document) => (
                  <div key={document.id} className="grid grid-cols-[1.3fr_0.8fr_0.8fr_0.9fr] gap-4 px-5 py-4 text-sm text-slate-600">
                    <span className="font-medium text-slate-900">{document.title}</span>
                    <span>{document.courseCode}</span>
                    <span>{document.type}</span>
                    <span>{document.uploadedBy}</span>
                  </div>
                ))
              ) : (
                <div className="px-5 py-8 text-sm text-slate-500">No documents available for review.</div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
