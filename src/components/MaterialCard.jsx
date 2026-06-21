import { motion as Motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoDownloadOutline,
  IoLayersOutline,
  IoSchoolOutline,
} from "react-icons/io5";

export default function MaterialCard({
  id,
  title,
  courseCode,
  department,
  level,
  academicSession,
  downloadCount,
  fileUrl,
  onView,
  badge,
  actionLabel = "View",
}) {
  const handleView = () => {
    if (onView) {
      onView({
        id,
        title,
        courseCode,
        department,
        level,
        academicSession,
        fileUrl,
      });
    } else if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex flex-col glass-card p-6 transition-all hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex rounded-full bg-campus-600/10 px-3 py-1 text-xs font-bold tracking-widest text-campus-700">
          {courseCode || "-"}
        </span>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {badge}
          {downloadCount != null ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/80 px-3 py-1 text-xs font-semibold text-slate-500 backdrop-blur-md">
              <IoDownloadOutline />
              {downloadCount}
            </span>
          ) : null}
        </div>
      </div>

      <h3 className="mt-5 line-clamp-2 text-lg font-bold leading-snug text-slate-900 tracking-tight">
        {title || "Untitled Material"}
      </h3>

      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-500">
        {department ? (
          <span className="inline-flex items-center gap-1.5">
            <IoSchoolOutline className="shrink-0 text-slate-400" />
            {department}
          </span>
        ) : null}
        {level ? (
          <span className="inline-flex items-center gap-1.5">
            <IoLayersOutline className="shrink-0 text-slate-400" />
            {level} Level
          </span>
        ) : null}
        {academicSession ? (
          <span className="inline-flex items-center gap-1.5">
            <IoCalendarOutline className="shrink-0 text-slate-400" />
            {academicSession}
          </span>
        ) : null}
      </div>

      <div className="mt-auto pt-6">
        <button
          onClick={handleView}
          className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
        >
          {actionLabel}
        </button>
      </div>
    </Motion.article>
  );
}
