import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  IoCloudUploadOutline,
  IoCreateOutline,
  IoDownloadOutline,
  IoTrashOutline,
  IoWarningOutline,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import LecturerLayout from "../../components/lecturer/LecturerLayout.jsx";
import { deleteMaterial, getLecturerMaterials, updateMaterial } from "../../services/api.js";
import { Link } from "react-router-dom";

const DEPARTMENTS = [
  "Agricultural Engineering", "Agricultural Science", "Biochemistry", "Biology",
  "Business Administration", "Chemical Engineering", "Chemistry", "Civil Engineering",
  "Computer Science", "Economics", "Electrical Engineering", "General Studies",
  "Law", "Management", "Mathematics", "Mechanical Engineering", "Medicine",
  "Microbiology", "Nursing", "Pharmacy", "Physics",
];

const LEVELS = ["100", "200", "300", "400", "500", "600"];

const SESSIONS = [
  "2020/2021", "2021/2022", "2022/2023", "2023/2024", "2024/2025", "2025/2026",
];

const TYPES = ["Lecture Note", "Past Question", "Study Guide", "Assignment", "Lab Manual"];

const STATUS_STYLES = {
  Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200",
};

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className="border-t border-slate-100">
      {[1, 2, 3, 4, 5, 6, 7].map((j) => (
        <td key={j} className="px-5 py-4">
          <div
            className="h-4 animate-pulse rounded-lg bg-slate-100"
            style={{ width: `${40 + j * 7}%` }}
          />
        </td>
      ))}
    </tr>
  ));
}

// ── Edit modal ──────────────────────────────────────────────────────────────

function EditModal({ material, onClose, onSave }) {
  const [form, setForm] = useState({
    title: material.title ?? "",
    courseCode: material.courseCode ?? "",
    department: material.department ?? "",
    level: material.level ?? "",
    academicSession: material.academicSession ?? material.year ?? "",
    type: material.type ?? "Lecture Note",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required."); return; }
    setSaving(true);
    try {
      const updated = await updateMaterial(material.id, form);
      onSave({ ...material, ...form, ...updated });
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <Motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-lg rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Edit Material</h2>
            <p className="mt-1 text-sm text-slate-500">Update metadata for this upload.</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <IoCloseOutline className="text-lg" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-6 grid gap-4">
          <ModalField
            label="Title"
            value={form.title}
            onChange={(v) => setField("title", v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <ModalField
              label="Course Code"
              value={form.courseCode}
              onChange={(v) => setField("courseCode", v)}
            />
            <ModalSelect
              label="Document Type"
              value={form.type}
              onChange={(v) => setField("type", v)}
              options={TYPES}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ModalSelect
              label="Department"
              value={form.department}
              onChange={(v) => setField("department", v)}
              options={DEPARTMENTS}
              placeholder="Select"
            />
            <ModalSelect
              label="Level"
              value={form.level}
              onChange={(v) => setField("level", v)}
              options={LEVELS}
              placeholder="Select"
            />
          </div>
          <ModalSelect
            label="Academic Session"
            value={form.academicSession}
            onChange={(v) => setField("academicSession", v)}
            options={SESSIONS}
            placeholder="Select"
          />

          {error ? (
            <p className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
              <IoAlertCircleOutline className="shrink-0 text-base" />
              {error}
            </p>
          ) : null}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-campus-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </Motion.div>
    </div>
  );
}

// ── Delete confirmation modal ───────────────────────────────────────────────

function DeleteModal({ material, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
      <Motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-sm rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50">
          <IoWarningOutline className="text-xl text-rose-600" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-slate-900">Delete material?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          <span className="font-medium text-slate-700">{material.title}</span> will be
          permanently removed from the library and cannot be recovered.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 rounded-full bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Motion.div>
    </div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────

export default function MyUploads() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ type: "", message: "" });

  useEffect(() => {
    document.title = "GoLibrary | My Uploads";
  }, []);

  useEffect(() => {
    setLoading(true);
    getLecturerMaterials()
      .then(setMaterials)
      .finally(() => setLoading(false));
  }, []);

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 3500);
  }

  function handleSaveEdit(updated) {
    setMaterials((prev) =>
      prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m)),
    );
    setEditTarget(null);
    showToast("success", "Changes saved successfully.");
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteMaterial(deleteTarget.id);
      setMaterials((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("success", `"${deleteTarget.title}" has been deleted.`);
    } catch (err) {
      setDeleteTarget(null);
      showToast("error", err.message || "Delete failed. Please try again.");
    }
  }

  return (
    <LecturerLayout>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">My Uploads</h1>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              All materials you have contributed to GoLibrary. Edit metadata or remove
              materials that are no longer relevant.
            </p>
          </div>
          <Link
            to="/lecturer/upload"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-campus-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-campus-700"
          >
            <IoCloudUploadOutline />
            New upload
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {["Title", "Course Code", "Level", "Session", "Status", "Downloads", "Actions"].map(
                    (col) => (
                      <th
                        key={col}
                        className="px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton />
                ) : materials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-campus-100">
                          <IoCloudUploadOutline className="text-2xl text-campus-700" />
                        </div>
                        <p className="text-sm font-semibold text-slate-900">No uploads yet</p>
                        <p className="text-xs text-slate-500">
                          Your uploaded materials will appear here.
                        </p>
                        <Link
                          to="/lecturer/upload"
                          className="mt-1 inline-flex items-center gap-2 rounded-full bg-campus-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-campus-700"
                        >
                          <IoCloudUploadOutline />
                          Upload your first material
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  materials.map((m) => (
                    <tr
                      key={m.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 max-w-[240px]">
                        <p className="line-clamp-1 font-medium text-slate-900">{m.title}</p>
                        {m.type ? (
                          <p className="mt-0.5 text-xs text-slate-400">{m.type}</p>
                        ) : null}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex rounded-full bg-campus-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-campus-700">
                          {m.courseCode || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                        {m.level ? `${m.level} Level` : "—"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap text-slate-600">
                        {m.academicSession || m.year || "—"}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            STATUS_STYLES[m.status] ?? STATUS_STYLES.Pending
                          }`}
                        >
                          {m.status ?? "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <IoDownloadOutline className="text-slate-400" />
                          {m.downloadCount ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditTarget(m)}
                            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-campus-300 hover:bg-campus-50 hover:text-campus-700"
                          >
                            <IoCreateOutline />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(m)}
                            className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <IoTrashOutline />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editTarget ? (
          <EditModal
            key="edit"
            material={editTarget}
            onClose={() => setEditTarget(null)}
            onSave={handleSaveEdit}
          />
        ) : null}
        {deleteTarget ? (
          <DeleteModal
            key="delete"
            material={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleConfirmDelete}
          />
        ) : null}
      </AnimatePresence>

      {/* Toast notification */}
      <AnimatePresence>
        {toast.message ? (
          <Motion.div
            key="toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className={`fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {toast.type === "success" ? (
              <IoCheckmarkCircleOutline className="shrink-0 text-lg" />
            ) : (
              <IoAlertCircleOutline className="shrink-0 text-lg" />
            )}
            {toast.message}
          </Motion.div>
        ) : null}
      </AnimatePresence>
    </LecturerLayout>
  );
}

// ── Modal field helpers ─────────────────────────────────────────────────────

function ModalField({ label, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-campus-300 focus:ring-4 focus:ring-campus-100"
      />
    </div>
  );
}

function ModalSelect({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-campus-300 focus:ring-4 focus:ring-campus-100"
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
