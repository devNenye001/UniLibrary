const PALETTE = {
  campus: {
    bg: "bg-campus-100",
    icon: "text-campus-700",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
  },
  rose: {
    bg: "bg-rose-50",
    icon: "text-rose-600",
  },
  sky: {
    bg: "bg-sky-50",
    icon: "text-sky-600",
  },
  violet: {
    bg: "bg-violet-50",
    icon: "text-violet-600",
  },
};

export default function StatCard({ title, value, icon: Icon, color = "campus", subtitle }) {
  const styles = PALETTE[color] ?? PALETTE.campus;

  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${styles.bg}`}
      >
        {Icon ? <Icon className={`h-5 w-5 ${styles.icon}`} /> : null}
      </div>
      <p className="mt-4 truncate text-2xl font-semibold text-slate-900">{value ?? "—"}</p>
      <p className="mt-1 text-sm font-medium text-slate-700">{title}</p>
      {subtitle ? (
        <p className="mt-0.5 truncate text-xs text-slate-400">{subtitle}</p>
      ) : null}
    </div>
  );
}
