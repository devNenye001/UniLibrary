import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { PendingUsersTable } from "../../components/admin/ApprovalTables.jsx";
import {
  AdminPageHeader,
  AdminSectionCard,
  AdminStatusBadge,
  AdminTabButton,
  AdminTable,
} from "../../components/admin/AdminUi.jsx";
import { formatDate, formatRole } from "../../components/admin/adminUtils.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { approveUser, getPendingUsers, getUsers, rejectUser } from "../../services/api.js";

const ROLE_FILTERS = ["all", "student", "lecturer", "admin"];
const STATUS_FILTERS = ["all", "approved", "pending"];

function filterUsers(users, filters) {
  return users.filter((user) => {
    if (filters.role !== "all" && user.role !== filters.role) return false;
    if (filters.status === "approved" && !user.approved) return false;
    if (filters.status === "pending" && user.approved) return false;
    return true;
  });
}

function UsersTable({ users, loading }) {
  if (!loading && !users.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
        <p className="text-lg font-semibold text-slate-900">No users match those filters</p>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Try switching the role or status filters to see more accounts.
        </p>
      </div>
    );
  }

  return (
    <AdminTable
      columns={[
        "Name",
        "Email",
        "Role",
        "Department",
        "Level",
        "Status",
        "Date Registered",
      ]}
      loading={loading}
      loadingRows={6}
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
          <td className="px-5 py-4">
            <AdminStatusBadge approved={user.approved} status={user.status} />
          </td>
          <td className="px-5 py-4 text-slate-500">{formatDate(user.createdAt)}</td>
        </tr>
      ))}
    </AdminTable>
  );
}

export default function AdminUsers() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [allUsers, setAllUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [filters, setFilters] = useState({ role: "all", status: "all" });

  useEffect(() => {
    document.title = "UniLibrary | User Management";
  }, []);

  useEffect(() => {
    let active = true;

    getUsers(token)
      .then((data) => {
        if (active) setAllUsers(data);
      })
      .catch((error) => {
        if (active) toast.error(error.message || "Unable to load users.");
      })
      .finally(() => {
        if (active) setLoadingAll(false);
      });

    getPendingUsers(token)
      .then((data) => {
        if (active) setPendingUsers(data);
      })
      .catch((error) => {
        if (active) toast.error(error.message || "Unable to load pending users.");
      })
      .finally(() => {
        if (active) setLoadingPending(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const filteredUsers = useMemo(() => filterUsers(allUsers, filters), [allUsers, filters]);

  const handleApprove = async (user) => {
    setBusyId(user.id);
    try {
      await approveUser(user.id, token);
      setPendingUsers((current) => current.filter((item) => item.id !== user.id));
      setAllUsers((current) =>
        current.map((item) =>
          item.id === user.id ? { ...item, approved: true, status: "Approved" } : item,
        ),
      );
      toast.success(`${user.name} approved successfully.`);
    } catch (error) {
      toast.error(error.message || "Unable to approve user.");
    } finally {
      setBusyId("");
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;

    setBusyId(rejectTarget.id);
    try {
      await rejectUser(rejectTarget.id, token);
      setPendingUsers((current) => current.filter((item) => item.id !== rejectTarget.id));
      setAllUsers((current) => current.filter((item) => item.id !== rejectTarget.id));
      toast.success(`${rejectTarget.name} rejected successfully.`);
    } catch (error) {
      toast.error(error.message || "Unable to reject user.");
    } finally {
      setBusyId("");
      setRejectTarget(null);
    }
  };

  return (
    <div className="p-8">
      <AdminPageHeader
        eyebrow="Users"
        title="User Management"
        description="Review all registered accounts, track approval status, and process pending user requests."
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <AdminTabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All Users
        </AdminTabButton>
        <AdminTabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")}>
          Pending Approval
        </AdminTabButton>
      </div>

      {activeTab === "all" ? (
        <AdminSectionCard className="p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="roleFilter">
                Role
              </label>
              <select
                id="roleFilter"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                value={filters.role}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, role: event.target.value }))
                }
              >
                {ROLE_FILTERS.map((role) => (
                  <option key={role} value={role}>
                    {role === "all" ? "All Roles" : formatRole(role)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="statusFilter"
              >
                Status
              </label>
              <select
                id="statusFilter"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                value={filters.status}
                onChange={(event) =>
                  setFilters((current) => ({ ...current, status: event.target.value }))
                }
              >
                {STATUS_FILTERS.map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "All Statuses" : formatRole(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <UsersTable users={filteredUsers} loading={loadingAll} />
          </div>
        </AdminSectionCard>
      ) : (
        <PendingUsersTable
          users={pendingUsers}
          loading={loadingPending}
          busyId={busyId}
          onApprove={handleApprove}
          onReject={setRejectTarget}
        />
      )}

      <ConfirmModal
        open={Boolean(rejectTarget)}
        title="Reject this user?"
        message={
          rejectTarget
            ? `${rejectTarget.name} will be removed from the platform. This action cannot be undone.`
            : ""
        }
        confirmLabel="Reject User"
        onConfirm={handleReject}
        onCancel={() => setRejectTarget(null)}
        danger
      />
    </div>
  );
}
