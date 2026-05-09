import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal.jsx";
import { MaterialsAdminTable } from "../../components/admin/ApprovalTables.jsx";
import { AdminPageHeader, AdminSectionCard } from "../../components/admin/AdminUi.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { deleteMaterial, getMaterials } from "../../services/api.js";

const LEVEL_OPTIONS = ["100", "200", "300", "400", "500", "600"];

const initialFilters = {
  department: "",
  level: "",
  courseCode: "",
};

export default function AdminMaterials() {
  const { token } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [draftFilters, setDraftFilters] = useState(initialFilters);
  const [materials, setMaterials] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "UniLibrary | Material Management";
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);

    getMaterials(filters, token)
      .then((response) => {
        if (!active) return;
        setMaterials(response.items ?? []);
        setDepartments(response.departments ?? []);
        setTotal(response.total ?? response.items?.length ?? 0);
      })
      .catch((error) => {
        if (active) toast.error(error.message || "Unable to load materials.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters, token]);

  const totalLabel = useMemo(() => `${total} material${total === 1 ? "" : "s"}`, [total]);

  const handleSearch = () => {
    setFilters(draftFilters);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteMaterial(deleteTarget.id, token);
      setMaterials((current) => current.filter((item) => item.id !== deleteTarget.id));
      setTotal((current) => Math.max(0, current - 1));
      toast.success(`"${deleteTarget.title}" deleted successfully.`);
    } catch (error) {
      toast.error(error.message || "Unable to delete material.");
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-8">
      <AdminPageHeader
        eyebrow="Materials"
        title="Material Management"
        description="Review all library resources, filter them by academic details, and remove items when necessary."
      />

      <AdminSectionCard className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Library materials</p>
            <p className="mt-1 text-xs text-slate-400">{totalLabel}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="department">
                Department
              </label>
              <select
                id="department"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                value={draftFilters.department}
                onChange={(event) =>
                  setDraftFilters((current) => ({ ...current, department: event.target.value }))
                }
              >
                <option value="">All departments</option>
                {departments.map((department) => (
                  <option key={department} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="level">
                Level
              </label>
              <select
                id="level"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                value={draftFilters.level}
                onChange={(event) =>
                  setDraftFilters((current) => ({ ...current, level: event.target.value }))
                }
              >
                <option value="">All levels</option>
                {LEVEL_OPTIONS.map((level) => (
                  <option key={level} value={level}>
                    {level} Level
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="courseCode">
                Course Code
              </label>
              <input
                id="courseCode"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                placeholder="e.g. CSC 401"
                type="text"
                value={draftFilters.courseCode}
                onChange={(event) =>
                  setDraftFilters((current) => ({ ...current, courseCode: event.target.value }))
                }
              />
            </div>

            <div className="flex items-end">
              <button
                className="w-full rounded-full bg-campus-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-campus-700"
                onClick={handleSearch}
                type="button"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <MaterialsAdminTable
            materials={materials}
            loading={loading}
            onDelete={setDeleteTarget}
          />
        </div>
      </AdminSectionCard>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this material?"
        message={
          deleteTarget
            ? `${deleteTarget.title} will be permanently removed from the library.`
            : ""
        }
        confirmLabel={deleting ? "Deleting..." : "Delete Material"}
        onConfirm={handleDelete}
        onCancel={() => (!deleting ? setDeleteTarget(null) : null)}
        danger
      />
    </div>
  );
}
