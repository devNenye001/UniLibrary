import { motion as Motion } from "framer-motion";
import {
  IoCalendarOutline,
  IoDownloadOutline,
  IoLayersOutline,
  IoSchoolOutline,
} from "react-icons/io5";

export default function MaterialCard({
  title,
  courseCode,
  department,
  level,
  academicSession,
  downloadCount,
  fileUrl,
  onView,
}) {
  const handleView = () => {
    if (onView) {
      onView({ title, courseCode, department, level, academicSession, fileUrl });
    } else if (fileUrl) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="flex flex-col rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-campus-900/8"
    >
      {/* Header row: course code + download count */}
      <div className="flex items-start justify-between gap-2">
        <span className="inline-flex rounded-full bg-campus-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-campus-700">
          {courseCode || "—"}
        </span>
        {downloadCount != null ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            <IoDownloadOutline />
            {downloadCount}
          </span>
        ) : null}
      </div>

      {/* Title */}
      <h3 className="mt-4 line-clamp-2 text-base font-semibold leading-snug text-slate-900">
        {title || "Untitled Material"}
      </h3>

      {/* Metadata */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500">
        {department ? (
          <span className="inline-flex items-center gap-1.5">
            <IoSchoolOutline className="shrink-0" />
            {department}
          </span>
        ) : null}
        {level ? (
          <span className="inline-flex items-center gap-1.5">
            <IoLayersOutline className="shrink-0" />
            {level} Level
          </span>
        ) : null}
        {academicSession ? (
          <span className="inline-flex items-center gap-1.5">
            <IoCalendarOutline className="shrink-0" />
            {academicSession}
          </span>
        ) : null}
      </div>

      {/* View button — pushed to bottom */}
      <div className="mt-auto pt-5">
        <button
          onClick={handleView}
          className="w-full rounded-2xl bg-campus-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-campus-700 active:scale-[0.98]"
        >
          View
        </button>
      </div>
    </Motion.article>
  );
}
