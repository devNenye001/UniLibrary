import LoadingSpinner from "../LoadingSpinner.jsx";
import { STATUS_STYLES } from "./adminUtils.js";

export function AdminPageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

export function AdminSectionCard({ children, className = "" }) {
  return (
    <div className={`rounded-[1.75rem] border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function AdminTabButton({ active, children, onClick }) {
  return (
    <button
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-campus-600 text-white"
          : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-100"
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
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        STATUS_STYLES[normalized] ?? STATUS_STYLES.pending
      }`}
    >
      {normalized.charAt(0).toUpperCase() + normalized.slice(1)}
    </span>
  );
}

export function AdminEmptyState({ title, description, action }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <p className="text-lg font-semibold text-slate-900">{title}</p>
      <p className="mt-2 text-sm leading-7 text-slate-500">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function AdminTable({ columns, children, loading = false, loadingRows = 5, colSpan }) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="bg-slate-50 text-left">
              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: loadingRows }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-slate-100">
                  {columns.map((column, columnIndex) => (
                    <td key={`${column}-${columnIndex}`} className="px-5 py-4">
                      <div
                        className="h-4 animate-pulse rounded-lg bg-slate-100"
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
                <td colSpan={colSpan ?? columns.length} className="px-5 py-12 text-center">
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
