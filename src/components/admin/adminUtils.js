export const STATUS_STYLES = {
  approved: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  pending: "border border-amber-200 bg-amber-50 text-amber-700",
  rejected: "border border-rose-200 bg-rose-50 text-rose-700",
};

export function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRole(role) {
  if (!role) return "-";
  return role.charAt(0).toUpperCase() + role.slice(1);
}
