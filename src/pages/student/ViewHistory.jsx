import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  IoArrowForward,
  IoCalendarOutline,
  IoSchoolOutline,
  IoTimeOutline,
  IoLibraryOutline,
} from "react-icons/io5";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import { getViewHistory } from "../../services/api.js";

// ── Date grouping ────────────────────────────────────────────────────────────
function groupByDate(items) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  const groups = { Today: [], Yesterday: [], Earlier: [] };

  for (const item of items) {
    const d = new Date(item.viewedAt);
    if (d >= todayStart) {
      groups.Today.push(item);
    } else if (d >= yesterdayStart) {
      groups.Yesterday.push(item);
    } else {
      groups.Earlier.push(item);
    }
  }

  return groups;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatEarlierDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Skeleton ─────────────────────────────────────────────────────────────────
function ItemSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2.5">
          <div className="h-5 w-3/4 rounded-xl bg-slate-100" />
          <div className="flex gap-3">
            <div className="h-3.5 w-20 rounded-lg bg-slate-100" />
            <div className="h-3.5 w-24 rounded-lg bg-slate-100" />
          </div>
        </div>
        <div className="h-9 w-28 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

// ── History item ──────────────────────────────────────────────────────────────
function HistoryItem({ item, showDate }) {
  return (
    <Motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
          {item.title}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
          {item.courseCode ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex rounded-full bg-campus-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-campus-700">
                {item.courseCode}
              </span>
            </span>
          ) : null}
          {item.department ? (
            <span className="inline-flex items-center gap-1.5">
              <IoSchoolOutline className="shrink-0" />
              {item.department}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <IoTimeOutline className="shrink-0" />
            {showDate ? formatEarlierDate(item.viewedAt) : formatTime(item.viewedAt)}
          </span>
        </div>
      </div>

      <Link
        to={`/materials/${item.materialId}`}
        className="inline-flex shrink-0 items-center gap-2 rounded-full bg-campus-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-campus-700"
      >
        View again
        <IoArrowForward className="text-sm" />
      </Link>
    </Motion.div>
  );
}

// ── Group section ─────────────────────────────────────────────────────────────
function HistoryGroup({ label, items }) {
  if (!items.length) return null;
  const showDate = label === "Earlier";

  return (
    <section>
      <div className="mb-4 flex items-center gap-3">
        <IoCalendarOutline className="text-slate-400" />
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
          {items.length}
        </span>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <HistoryItem key={`${item.materialId}-${i}`} item={item} showDate={showDate} />
        ))}
      </div>
    </section>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-[1.25rem] bg-campus-100">
        <IoLibraryOutline className="text-3xl text-campus-700" />
      </div>
      <p className="mt-5 text-lg font-semibold text-slate-900">No history yet</p>
      <p className="mt-2 max-w-sm text-sm leading-7 text-slate-500">
        Materials you open will appear here, grouped by date so you can quickly revisit
        anything you have studied before.
      </p>
      <Link
        to="/browse"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-campus-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-campus-700"
      >
        Browse materials
        <IoArrowForward />
      </Link>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ViewHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "UniLibrary | View History";
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    getViewHistory()
      .then(setHistory)
      .catch((err) => setError(err.message || "Unable to load view history."))
      .finally(() => setLoading(false));
  }, []);

  const groups = groupByDate(history);
  const hasAny = Object.values(groups).some((g) => g.length > 0);

  return (
    <StudentLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">View History</h1>
          <p className="mt-2 text-sm leading-7 text-slate-500">
            All materials you have opened, grouped by when you viewed them. Jump back in with
            one click.
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <ItemSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : !hasAny ? (
          <EmptyState />
        ) : (
          <div className="space-y-10">
            <HistoryGroup label="Today" items={groups.Today} />
            <HistoryGroup label="Yesterday" items={groups.Yesterday} />
            <HistoryGroup label="Earlier" items={groups.Earlier} />
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
