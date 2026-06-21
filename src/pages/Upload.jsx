import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from "react-icons/io5";
import Footer from "../components/layouts/Footer.jsx";
import Navbar from "../components/layouts/Navbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { uploadDocument } from "../services/api.js";

const initialForm = {
  title: "",
  courseCode: "",
  department: "",
  level: "",
  year: "",
  type: "Lecture Note",
  description: "",
  file: null,
};

export default function Upload() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    document.title = "UniLibrary | Upload";
  }, []);

  const validate = () => {
    const nextErrors = {};

    ["title", "courseCode", "department", "level", "year", "description"].forEach((field) => {
      if (!String(form[field]).trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    if (!form.file) {
      nextErrors.file = "Please choose a file to upload.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: files ? files[0] : value,
    }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      await uploadDocument({
        ...form,
        uploadedBy: user?.name || "Lecturer",
        role,
        tags: [form.courseCode, form.department, form.type.toLowerCase()],
      });

      setStatus({
        type: "success",
        message: "Document uploaded successfully. Redirecting to the dashboard...",
      });
      setForm(initialForm);
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (uploadError) {
      setStatus({
        type: "error",
        message: uploadError.message || "Upload failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold text-slate-900">Contribute new academic documents</h1>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              Lecturers and admins can upload lecture notes, study guides, and past questions to expand the UniLibrary knowledge base.
            </p>
          </div>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Document title" name="title" value={form.title} onChange={handleChange} error={errors.title} />
              <Field label="Course code" name="courseCode" value={form.courseCode} onChange={handleChange} error={errors.courseCode} />
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Field label="Department" name="department" value={form.department} onChange={handleChange} error={errors.department} />
              <Field label="Level" name="level" value={form.level} onChange={handleChange} error={errors.level} />
              <Field label="Academic year" name="year" value={form.year} onChange={handleChange} error={errors.year} />
            </div>

            <div className="grid gap-5 md:grid-cols-[0.6fr_1.4fr]">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="type">
                  Document type
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="type"
                  name="type"
                  onChange={handleChange}
                  value={form.type}
                >
                  <option>Lecture Note</option>
                  <option>Past Question</option>
                  <option>Study Guide</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">
                  Description
                </label>
                <textarea
                  className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="description"
                  name="description"
                  onChange={handleChange}
                  placeholder="Describe the document and what it covers."
                  value={form.description}
                />
                {errors.description ? <p className="mt-2 text-sm text-rose-600">{errors.description}</p> : null}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="file">
                File upload
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-campus-300 bg-campus-50 px-6 py-10 text-center transition hover:bg-campus-100" htmlFor="file">
                <IoCloudUploadOutline className="text-4xl text-campus-700" />
                <p className="mt-4 text-base font-semibold text-slate-900">
                  {form.file ? form.file.name : "Choose a file to upload"}
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  PDF, DOCX, or image files can be attached to this placeholder upload flow.
                </p>
              </label>
              <input className="hidden" id="file" name="file" onChange={handleChange} type="file" />
              {errors.file ? <p className="mt-2 text-sm text-rose-600">{errors.file}</p> : null}
            </div>

            {status.message ? (
              <div
                className={`rounded-[1.5rem] px-5 py-4 text-sm ${
                  status.type === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {status.message}
              </div>
            ) : null}

            <div className="flex justify-end">
              <button
                className="rounded-full bg-campus-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Uploading..." : "Upload document"}
              </button>
            </div>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, name, value, onChange, error }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor={name}>
        {label}
      </label>
      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
        id={name}
        name={name}
        onChange={onChange}
        type="text"
        value={value}
      />
      {error ? <p className="mt-2 text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
