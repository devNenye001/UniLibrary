import { motion } from "framer-motion";

const PALETTE = {
  campus: {
    bg: "bg-campus-600/10",
    icon: "text-campus-600",
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
    <motion.div 
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="glass-card p-6 flex flex-col transition-all hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]"
    >
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-[1.25rem] ${styles.bg}`}
      >
        {Icon ? <Icon className={`h-6 w-6 ${styles.icon}`} /> : null}
      </div>
      <p className="mt-5 truncate text-3xl font-bold tracking-tight text-slate-900">{value ?? "—"}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{title}</p>
      {subtitle ? (
        <p className="mt-1 truncate text-xs text-slate-400 font-medium">{subtitle}</p>
      ) : null}
    </motion.div>
  );
}
