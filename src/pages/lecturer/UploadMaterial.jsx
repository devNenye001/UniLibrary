import { useEffect, useRef, useState } from "react";
import { motion as Motion } from "framer-motion";
import {
  IoCheckmarkCircleOutline,
  IoCloudUploadOutline,
  IoCloseCircleOutline,
  IoDocumentOutline,
} from "react-icons/io5";
import LecturerLayout from "../../components/lecturer/LecturerLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { uploadMaterial } from "../../services/api.js";

const DEPARTMENTS = [
  "Agricultural Engineering",
  "Agricultural Science",
  "Biochemistry",
  "Biology",
  "Business Administration",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Computer Science",
  "Economics",
  "Electrical Engineering",
  "General Studies",
  "Law",
  "Management",
  "Mathematics",
  "Mechanical Engineering",
  "Medicine",
  "Microbiology",
  "Nursing",
  "Pharmacy",
  "Physics",
];

const LEVELS = ["100", "200", "300", "400", "500", "600"];

const SESSIONS = [
  "2020/2021",
  "2021/2022",
  "2022/2023",
  "2023/2024",
  "2024/2025",
  "2025/2026",
];

const TYPES = ["Lecture Note", "Past Question", "Study Guide", "Assignment", "Lab Manual"];

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

const INITIAL_FORM = {
  title: "",
  courseCode: "",
  department: "",
  level: "",
  academicSession: "",
  type: "Lecture Note",
  description: "",
  file: null,
};

export default function UploadMaterial() {
  const { user, role } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState({ type: "", message: "" });
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    document.title = "UniLibrary | Upload Material";
    return () => clearInterval(timerRef.current);
  }, []);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setStatus({ type: "", message: "" });
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (files) {
      validateAndSetFile(files[0]);
    } else {
      setField(name, value);
    }
  }

  function validateAndSetFile(file) {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setErrors((prev) => ({ ...prev, file: "Only PDF files are accepted." }));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrors((prev) => ({ ...prev, file: "File must be 10 MB or smaller." }));
      return;
    }
    setField("file", file);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setDragging(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSetFile(file);
  }

  function validate() {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!form.courseCode.trim()) next.courseCode = "Course code is required.";
    if (!form.department) next.department = "Select a department.";
    if (!form.level) next.level = "Select a level.";
    if (!form.academicSession) next.academicSession = "Select an academic session.";
    if (!form.description.trim()) next.description = "Description is required.";
    if (!form.file) next.file = "Please attach a PDF file.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function startFakeProgress() {
    let fake = 0;
    timerRef.current = setInterval(() => {
      fake += Math.random() * 14 + 4;
      setProgress(Math.min(Math.round(fake), 88));
    }, 320);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setUploading(true);
    setProgress(0);
    setStatus({ type: "", message: "" });
    startFakeProgress();

    try {
      await uploadMaterial(
        {
          ...form,
          uploadedBy: user?.name || "Lecturer",
          role,
          tags: [form.courseCode, form.department, form.type.toLowerCase()],
        },
        (event) => {
          if (event.total) {
            clearInterval(timerRef.current);
            setProgress(Math.min(Math.round((event.loaded / event.total) * 95), 95));
          }
        },
      );

      clearInterval(timerRef.current);
      setProgress(100);
      setStatus({
        type: "success",
        message:
          "Material uploaded successfully and is pending admin approval. It will appear in the library once reviewed.",
      });
      setForm(INITIAL_FORM);
    } catch (err) {
      clearInterval(timerRef.current);
      setProgress(0);
      setStatus({
        type: "error",
        message: err.message || "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <LecturerLayout>
      <div className="px-6 py-8">
        <div className="mx-auto max-w-3xl">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-slate-900">Upload Material</h1>
            <p className="mt-2 text-sm leading-7 text-slate-500">
              Upload lecture notes, past questions, and study guides to the UniLibrary archive.
              All materials require admin approval before becoming publicly visible.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm"
          >
            {/* Row 1: Title + Course Code */}
            <div className="grid gap-5 md:grid-cols-2">
              <FormField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="e.g. CSC 401 Machine Learning Notes"
              />
              <FormField
                label="Course Code"
                name="courseCode"
                value={form.courseCode}
                onChange={handleChange}
                error={errors.courseCode}
                placeholder="e.g. CSC 401"
              />
            </div>

            {/* Row 2: Department + Level + Session */}
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <SelectField
                label="Department"
                name="department"
                value={form.department}
                onChange={handleChange}
                error={errors.department}
                options={DEPARTMENTS}
                placeholder="Select department"
              />
              <SelectField
                label="Level"
                name="level"
                value={form.level}
                onChange={handleChange}
                error={errors.level}
                options={LEVELS}
                placeholder="Select level"
              />
              <SelectField
                label="Academic Session"
                name="academicSession"
                value={form.academicSession}
                onChange={handleChange}
                error={errors.academicSession}
                options={SESSIONS}
                placeholder="Select session"
              />
            </div>

            {/* Row 3: Type + Description */}
            <div className="mt-5 grid gap-5 md:grid-cols-[0.6fr_1.4fr]">
              <SelectField
                label="Document Type"
                name="type"
                value={form.type}
                onChange={handleChange}
                options={TYPES}
              />
              <div>
                <label
                  className="mb-2 block text-sm font-medium text-slate-700"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Briefly describe what this material covers."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-campus-300 focus:ring-4 focus:ring-campus-100"
                />
                {errors.description ? (
                  <p className="mt-1.5 text-xs text-rose-600">{errors.description}</p>
                ) : null}
              </div>
            </div>

            {/* File drop zone */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                PDF File{" "}
                <span className="font-normal text-slate-400">(max 10 MB)</span>
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border-2 border-dashed px-6 py-10 text-center transition-colors ${
                  dragging
                    ? "border-campus-400 bg-campus-100"
                    : errors.file
                      ? "border-rose-300 bg-rose-50"
                      : form.file
                        ? "border-emerald-300 bg-emerald-50"
                        : "border-campus-200 bg-campus-50 hover:border-campus-400 hover:bg-campus-100"
                }`}
              >
                {form.file ? (
                  <>
                    <IoDocumentOutline className="text-4xl text-emerald-600" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">{form.file.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {(form.file.size / 1024 / 1024).toFixed(2)} MB · Click to replace
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setField("file", null);
                      }}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                    >
                      <IoCloseCircleOutline />
                      Remove file
                    </button>
                  </>
                ) : (
                  <>
                    <IoCloudUploadOutline className="text-4xl text-campus-700" />
                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      {dragging ? "Drop your PDF here" : "Drag & drop or click to browse"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">PDF only · max 10 MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleChange}
              />
              {errors.file ? (
                <p className="mt-1.5 text-xs text-rose-600">{errors.file}</p>
              ) : null}
            </div>

            {/* Upload progress bar */}
            {(uploading || progress > 0) && (
              <Motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>{progress < 100 ? "Uploading…" : "Upload complete"}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-campus-100">
                  <Motion.div
                    className="h-full rounded-full bg-campus-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                  />
                </div>
              </Motion.div>
            )}

            {/* Status banner */}
            {status.message ? (
              <Motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 flex items-start gap-3 rounded-[1.25rem] px-5 py-4 text-sm ${
                  status.type === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {status.type === "success" ? (
                  <IoCheckmarkCircleOutline className="mt-0.5 shrink-0 text-lg" />
                ) : null}
                {status.message}
              </Motion.div>
            ) : null}

            {/* Submit */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="rounded-full bg-campus-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploading ? "Uploading…" : "Upload material"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LecturerLayout>
  );
}

function FormField({ label, name, value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-campus-100 ${
          error
            ? "border-rose-300 focus:border-rose-400"
            : "border-slate-200 focus:border-campus-300"
        }`}
      />
      {error ? <p className="mt-1.5 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}

function SelectField({ label, name, value, onChange, error, options, placeholder }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-4 focus:ring-campus-100 ${
          error
            ? "border-rose-300 focus:border-rose-400"
            : "border-slate-200 focus:border-campus-300"
        }`}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1.5 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
