import LoadingSpinner from "../LoadingSpinner.jsx";
import { STATUS_STYLES } from "./adminUtils.js";

export function AdminPageHeader({ title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <h1 className="text-4xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function AdminSectionCard({ children, className = "" }) {
  return (
    <div className={`glass-card p-6 ${className}`}>
      {children}
    </div>
  );
}

export function AdminTabButton({ active, children, onClick }) {
  return (
    <button
      className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
        active
          ? "bg-slate-900 text-white shadow-md"
          : "bg-white/50 border border-slate-200/50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 backdrop-blur-md"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function AdminStatusBadge({ approved, status }) {
  const normalized = status
    ? String(status).toLowerCase()
    : approved
      ? "approved"
      : "pending";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold tracking-widest uppercase ${
        STATUS_STYLES[normalized] ?? STATUS_STYLES.pending
      }`}
    >
      {normalized}
    </span>
  );
}

export function AdminEmptyState({ title, description, action }) {
  return (
    <div className="glass-card px-6 py-14 text-center border-dashed border-slate-300/50">
      <p className="text-xl font-bold tracking-tight text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function AdminTable({ columns, children, loading = false, loadingRows = 5, colSpan }) {
  return (
    <div className="overflow-hidden glass-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="bg-slate-100/50 text-left border-b border-slate-200/50 backdrop-blur-md">
              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {loading ? (
              Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="transition-colors hover:bg-white/40">
                  {columns.map((column, columnIndex) => (
                    <td key={`${column}-${columnIndex}`} className="px-6 py-5">
                      <div
                        className="h-4 animate-pulse rounded-full bg-slate-200/50"
                        style={{ width: `${42 + columnIndex * 7}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : children ? (
              children
            ) : (
              <tr>
                <td colSpan={colSpan ?? columns.length} className="px-6 py-16 text-center">
                  <LoadingSpinner size="md" className="mx-auto" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
