import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  IoArrowForward,
  IoCheckmarkCircleOutline,
  IoCloudUploadOutline,
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoHourglassOutline,
  IoTimeOutline,
} from "react-icons/io5";
import LecturerLayout from "../../components/lecturer/LecturerLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getLecturerMaterials, getLecturerStats } from "../../services/api.js";

const STATUS_STYLES = {
  Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200",
};

function StatSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-10 w-10 rounded-2xl bg-slate-100" />
      <div className="mt-4 h-8 w-20 rounded-xl bg-slate-100" />
      <div className="mt-2 h-4 w-28 rounded-lg bg-slate-100" />
    </div>
  );
}

function RowSkeleton() {
  return (
    <tr className="border-t border-slate-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 rounded-lg bg-slate-100" style={{ width: `${50 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function LecturerDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({ totalUploads: 0, totalDownloads: 0, pendingApproval: 0 });
  const [materials, setMaterials] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(true);

  useEffect(() => {
    document.title = "UniLibrary | Lecturer Dashboard";
  }, []);

  useEffect(() => {
    setLoadingStats(true);
    getLecturerStats()
      .then(setStats)
      .finally(() => setLoadingStats(false));
  }, []);

  useEffect(() => {
    setLoadingMaterials(true);
    getLecturerMaterials()
      .then((data) => setMaterials(data.slice(0, 8)))
      .finally(() => setLoadingMaterials(false));
  }, []);

  const statCards = [
    {
      label: "Total Uploads",
      value: loadingStats ? null : stats.totalUploads,
      icon: <IoDocumentTextOutline className="text-xl text-campus-700" />,
    },
    {
      label: "Total Downloads",
      value: loadingStats ? null : stats.totalDownloads,
      icon: <IoDownloadOutline className="text-xl text-campus-700" />,
    },
    {
      label: "Pending Approval",
      value: loadingStats ? null : stats.pendingApproval,
      icon: <IoHourglassOutline className="text-xl text-amber-600" />,
      accent: true,
    },
  ];

  return (
    <LecturerLayout>
      <div className="px-6 py-8">
        {/* Hero */}
        <section className="grid gap-6 rounded-[2rem] bg-[linear-gradient(135deg,#0d1c30_0%,#173456_60%,#234876_100%)] px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.18)] md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
              Lecturer Dashboard
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Welcome back,{" "}
              <span className="text-sky-200">{user?.name?.split(" ")[0] || "Lecturer"}</span>.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300">
              Manage your uploaded materials, track downloads, and contribute to the UniLibrary
              academic archive.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-campus-700 transition hover:bg-slate-100"
                to="/lecturer/upload"
              >
                <IoCloudUploadOutline />
                Upload material
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                to="/lecturer/uploads"
              >
                My uploads
                <IoArrowForward />
              </Link>
            </div>
          </div>

          {/* Quick stat highlights */}
          <div className="flex flex-row gap-4 md:flex-col md:justify-center">
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-2">
                <IoCheckmarkCircleOutline className="text-lg text-emerald-300" />
                <p className="text-sm text-slate-200">Approved</p>
              </div>
              <p className="mt-3 text-3xl font-semibold">
                {loadingStats ? "—" : Math.max(0, stats.totalUploads - stats.pendingApproval)}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center gap-2">
                <IoHourglassOutline className="text-lg text-amber-300" />
                <p className="text-sm text-slate-200">Pending</p>
              </div>
              <p className="mt-3 text-3xl font-semibold">
                {loadingStats ? "—" : stats.pendingApproval}
              </p>
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {loadingStats
            ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
            : statCards.map((card) => (
                <Motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                      card.accent ? "bg-amber-50" : "bg-campus-100"
                    }`}
                  >
                    {card.icon}
                  </div>
                  <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value ?? "—"}</p>
                  <p className="mt-1 text-sm text-slate-500">{card.label}</p>
                </Motion.div>
              ))}
        </section>

        {/* Recent uploads */}
        <section className="mt-8 mb-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                <IoTimeOutline className="mr-1.5 inline-block" />
                Recent
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Recent Uploads</h2>
            </div>
            <Link
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-campus-700 hover:text-campus-900"
              to="/lecturer/uploads"
            >
              View all
              <IoArrowForward />
            </Link>
          </div>

          <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Title
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Course Code
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Downloads
                    </th>
                    <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loadingMaterials
                    ? Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)
                    : materials.length === 0
                      ? (
                        <tr>
                          <td colSpan={5} className="px-5 py-12 text-center">
                            <p className="text-sm font-semibold text-slate-900">No uploads yet</p>
                            <p className="mt-1 text-xs text-slate-500">
                              Upload your first material to get started.
                            </p>
                            <Link
                              to="/lecturer/upload"
                              className="mt-4 inline-flex items-center gap-2 rounded-full bg-campus-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-campus-700"
                            >
                              <IoCloudUploadOutline />
                              Upload now
                            </Link>
                          </td>
                        </tr>
                      )
                      : materials.map((m) => (
                          <tr
                            key={m.id}
                            className="border-t border-slate-100 transition hover:bg-slate-50"
                          >
                            <td className="px-5 py-4">
                              <p className="line-clamp-1 font-medium text-slate-900">{m.title}</p>
                            </td>
                            <td className="px-5 py-4">
                              <span className="inline-flex rounded-full bg-campus-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-campus-700">
                                {m.courseCode || "—"}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  STATUS_STYLES[m.status] ?? STATUS_STYLES.Pending
                                }`}
                              >
                                {m.status ?? "Pending"}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-slate-600">
                              {m.downloadCount ?? 0}
                            </td>
                            <td className="px-5 py-4 text-slate-500">
                              {m.createdAt
                                ? new Date(m.createdAt).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                            </td>
                          </tr>
                        ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </LecturerLayout>
  );
}
