import { useEffect, useState } from "react";
import { IoSparklesOutline } from "react-icons/io5";
import MaterialCard from "../components/MaterialCard.jsx";
import StudentLayout from "../components/student/StudentLayout.jsx";
import { getStudentRecommendations } from "../services/api.js";

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-6 w-24 rounded-full bg-slate-100" />
      <div className="mt-4 h-5 w-full rounded-xl bg-slate-100" />
      <div className="mt-2 h-4 w-3/4 rounded-xl bg-slate-100" />
      <div className="mt-3 flex gap-3">
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
      <div className="mt-5 h-9 w-full rounded-2xl bg-slate-100" />
    </div>
  );
}

export default function RecommendationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "UniLibrary | Recommendations";
  }, []);

  useEffect(() => {
    let active = true;

    getStudentRecommendations()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load recommendations.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <StudentLayout>
      <div className="px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">Recommendations</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            Suggested materials based on your academic activity and available library resources.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
            : items.length
              ? items.map((item) => (
                  <MaterialCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    courseCode={item.courseCode}
                    department={item.department}
                    level={item.level}
                    academicSession={item.academicSession}
                    downloadCount={item.downloadCount}
                    fileUrl={item.fileUrl}
                  />
                ))
              : (
                <div className="col-span-full rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-campus-100">
                    <IoSparklesOutline className="text-2xl text-campus-700" />
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">
                    No recommendations available
                  </p>
                  <p className="mt-2 text-sm leading-7 text-slate-500">
                    Explore more materials and return later for better personalised suggestions.
                  </p>
                </div>
              )}
        </div>
      </div>
    </StudentLayout>
  );
}
