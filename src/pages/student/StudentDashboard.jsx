import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoArrowForward,
  IoDownloadOutline,
  IoDocumentTextOutline,
  IoEyeOutline,
  IoSearchOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import MaterialCard from "../../components/MaterialCard.jsx";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  getPopularMaterials,
  getStudentRecommendations,
  getStudentStats,
} from "../../services/api.js";

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

export default function StudentDashboard() {
  const { user } = useAuth();

  const [recommendations, setRecommendations] = useState([]);
  const [popular, setPopular] = useState([]);
  const [stats, setStats] = useState({ totalMaterials: 0, myDownloads: 0, myViewed: 0 });
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [loadingPop, setLoadingPop] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    document.title = "UniLibrary | Dashboard";
  }, []);

  useEffect(() => {
    setLoadingStats(true);
    getStudentStats()
      .then(setStats)
      .finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
    setLoadingRecs(true);
    getStudentRecommendations()
      .then((data) => setRecommendations(data.slice(0, 6)))
      .finally(() => setLoadingRecs(false));
  }, []);

  useEffect(() => {
    setLoadingPop(true);
    getPopularMaterials(user?.department)
      .then((data) => setPopular(data.slice(0, 4)))
      .finally(() => setLoadingPop(false));
  }, [user?.department]);

  const statCards = [
    {
      label: "Total Materials",
      value: loadingStats ? "—" : stats.totalMaterials,
      icon: <IoDocumentTextOutline />,
    },
    {
      label: "My Downloads",
      value: loadingStats ? "—" : stats.myDownloads,
      icon: <IoDownloadOutline />,
    },
    {
      label: "Viewed Materials",
      value: loadingStats ? "—" : stats.myViewed,
      icon: <IoEyeOutline />,
    },
  ];

  return (
    <StudentLayout>
      <div className="px-6 py-8">
        {/* ── Hero / Welcome ──────────────────────────────────────── */}
        <section className="grid gap-6 rounded-[2rem] bg-[linear-gradient(135deg,#0d1c30_0%,#173456_60%,#234876_100%)] px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
              Student Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Welcome back,{" "}
              <span className="text-sky-200">{user?.name?.split(" ")[0] || "Scholar"}</span>.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              Discover lecture notes, past questions, and AI-powered recommendations tailored
              to your department and level.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-campus-700 transition hover:bg-slate-100"
                to="/search"
              >
                <IoSearchOutline />
                Search materials
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                to="/browse"
              >
                Browse library
                <IoArrowForward />
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-200">{card.label}</p>
                  <span className="text-lg text-sky-200">{card.icon}</span>
                </div>
                <p className="mt-4 text-3xl font-semibold">{card.value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recommended For You ─────────────────────────────────── */}
        <section className="mt-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                <IoSparklesOutline className="mr-1.5 inline-block" />
                AI Picks
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Recommended For You
              </h2>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-campus-700 hover:text-campus-900"
              to="/browse"
            >
              View all
              <IoArrowForward />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loadingRecs
              ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
              : recommendations.length
                ? recommendations.map((item) => (
                    <MaterialCard
                      key={item.id}
                      title={item.title}
                      courseCode={item.courseCode}
                      department={item.department}
                      level={item.level}
                      academicSession={item.year ?? item.academicSession}
                      downloadCount={item.downloadCount}
                      fileUrl={item.fileUrl}
                    />
                  ))
                : (
                  <div className="col-span-full rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                    <p className="text-base font-semibold text-slate-900">
                      No recommendations yet
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Browse the library to get personalised suggestions.
                    </p>
                  </div>
                )}
          </div>
        </section>

        {/* ── Popular in Your Department ───────────────────────────── */}
        <section className="mt-10 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                Trending
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Popular in{" "}
                {user?.department ? (
                  <span className="text-campus-700">{user.department}</span>
                ) : (
                  "Your Department"
                )}
              </h2>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-campus-700 hover:text-campus-900"
              to="/browse"
            >
              View all
              <IoArrowForward />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loadingPop
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
              : popular.length
                ? popular.map((item) => (
                    <MaterialCard
                      key={item.id}
                      title={item.title}
                      courseCode={item.courseCode}
                      department={item.department}
                      level={item.level}
                      academicSession={item.year ?? item.academicSession}
                      downloadCount={item.downloadCount}
                      fileUrl={item.fileUrl}
                    />
                  ))
                : (
                  <div className="col-span-full rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                    <p className="text-base font-semibold text-slate-900">
                      Nothing trending yet
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Check back soon as more students engage with materials.
                    </p>
                  </div>
                )}
          </div>
        </section>
      </div>
    </StudentLayout>
  );
}
