import { Link } from "react-router-dom";
import {
  AdminEmptyState,
  AdminStatusBadge,
  AdminTable,
} from "./AdminUi.jsx";
import { formatDate, formatRole } from "./adminUtils.js";

function ActionButton({ children, tone = "default", onClick, disabled = false }) {
  const tones = {
    default: "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100",
    success: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    danger: "border-rose-200 text-rose-700 hover:bg-rose-50",
  };

  return (
    <button
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
        tones[tone] ?? tones.default
      }`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

export function PendingUsersTable({
  users,
  loading,
  busyId,
  onApprove,
  onReject,
  emptyTitle = "No pending users",
  emptyDescription = "New registrations awaiting approval will appear here.",
}) {
  if (!loading && !users.length) {
    return <AdminEmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <AdminTable
      columns={["Name", "Email", "Role", "Department", "Level", "Date Registered", "Actions"]}
      loading={loading}
      loadingRows={5}
    >
      {users.map((user) => (
        <tr key={user.id} className="border-t border-slate-100 transition hover:bg-slate-50">
          <td className="px-5 py-4">
            <p className="font-medium text-slate-900">{user.name}</p>
          </td>
          <td className="px-5 py-4 text-slate-600">{user.email || "-"}</td>
          <td className="px-5 py-4 text-slate-600">{formatRole(user.role)}</td>
          <td className="px-5 py-4 text-slate-600">{user.department || "-"}</td>
          <td className="px-5 py-4 text-slate-600">
            {user.level ? `${user.level} Level` : "-"}
          </td>
          <td className="px-5 py-4 text-slate-500">{formatDate(user.createdAt)}</td>
          <td className="px-5 py-4">
            <div className="flex items-center gap-2">
              <ActionButton disabled={busyId === user.id} tone="success" onClick={() => onApprove(user)}>
                Approve
              </ActionButton>
              <ActionButton disabled={busyId === user.id} tone="danger" onClick={() => onReject(user)}>
                Reject
              </ActionButton>
            </div>
          </td>
        </tr>
      ))}
    </AdminTable>
  );
}

export function PendingMaterialsTable({
  materials,
  loading,
  busyId,
  onApprove,
  onReject,
}) {
  if (!loading && !materials.length) {
    return (
      <AdminEmptyState
        title="No pending materials"
        description="New uploads waiting for review will appear here."
      />
    );
  }

  return (
    <AdminTable
      columns={["Title", "Course Code", "Department", "Lecturer Name", "Upload Date", "Actions"]}
      loading={loading}
      loadingRows={5}
    >
      {materials.map((material) => (
        <tr
          key={material.id}
          className="border-t border-slate-100 transition hover:bg-slate-50"
        >
          <td className="px-5 py-4">
            <p className="font-medium text-slate-900">{material.title}</p>
          </td>
          <td className="px-5 py-4">
            <span className="inline-flex rounded-full bg-campus-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-campus-700">
              {material.courseCode || "-"}
            </span>
          </td>
          <td className="px-5 py-4 text-slate-600">{material.department || "-"}</td>
          <td className="px-5 py-4 text-slate-600">{material.lecturerName || "-"}</td>
          <td className="px-5 py-4 text-slate-500">{formatDate(material.createdAt)}</td>
          <td className="px-5 py-4">
            <div className="flex items-center gap-2">
              <ActionButton
                disabled={busyId === material.id}
                tone="success"
                onClick={() => onApprove(material)}
              >
                Approve
              </ActionButton>
              <ActionButton
                disabled={busyId === material.id}
                tone="danger"
                onClick={() => onReject(material)}
              >
                Reject
              </ActionButton>
            </div>
          </td>
        </tr>
      ))}
    </AdminTable>
  );
}

export function RecentRegistrationsTable({ users, loading }) {
  if (!loading && !users.length) {
    return (
      <AdminEmptyState
        title="No recent registrations"
        description="New user signups will appear here once accounts are created."
      />
    );
  }

  return (
    <AdminTable
      columns={["Name", "Email", "Role", "Status"]}
      loading={loading}
      loadingRows={5}
    >
      {users.map((user) => (
        <tr key={user.id} className="border-t border-slate-100 transition hover:bg-slate-50">
          <td className="px-5 py-4">
            <p className="font-medium text-slate-900">{user.name}</p>
          </td>
          <td className="px-5 py-4 text-slate-600">{user.email || "-"}</td>
          <td className="px-5 py-4 text-slate-600">{formatRole(user.role)}</td>
          <td className="px-5 py-4">
            <AdminStatusBadge approved={user.approved} status={user.status} />
          </td>
        </tr>
      ))}
    </AdminTable>
  );
}

export function MaterialsAdminTable({ materials, loading, onDelete }) {
  if (!loading && !materials.length) {
    return (
      <AdminEmptyState
        title="No materials found"
        description="Try broadening your filters or check back after new uploads arrive."
      />
    );
  }

  return (
    <AdminTable
      columns={[
        "Title",
        "Course Code",
        "Department",
        "Level",
        "Session",
        "Status",
        "Downloads",
        "Uploaded By",
        "Actions",
      ]}
      loading={loading}
      loadingRows={6}
    >
      {materials.map((material) => (
        <tr
          key={material.id}
          className="border-t border-slate-100 transition hover:bg-slate-50"
        >
          <td className="px-5 py-4">
            <p className="font-medium text-slate-900">{material.title}</p>
          </td>
          <td className="px-5 py-4">
            <span className="inline-flex rounded-full bg-campus-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-campus-700">
              {material.courseCode || "-"}
            </span>
          </td>
          <td className="px-5 py-4 text-slate-600">{material.department || "-"}</td>
          <td className="px-5 py-4 text-slate-600">
            {material.level ? `${material.level} Level` : "-"}
          </td>
          <td className="px-5 py-4 text-slate-600">
            {material.academicSession || material.year || "-"}
          </td>
          <td className="px-5 py-4">
            <AdminStatusBadge
              approved={String(material.status).toLowerCase() === "approved"}
              status={material.status ?? "Pending"}
            />
          </td>
          <td className="px-5 py-4 text-slate-600">{material.downloadCount ?? 0}</td>
          <td className="px-5 py-4 text-slate-600">{material.uploadedBy || "-"}</td>
          <td className="px-5 py-4">
            <div className="flex items-center gap-2">
              <Link
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
                to={`/materials/${material.id}`}
              >
                View
              </Link>
              <ActionButton tone="danger" onClick={() => onDelete(material)}>
                Delete
              </ActionButton>
            </div>
          </td>
        </tr>
      ))}
    </AdminTable>
  );
}
