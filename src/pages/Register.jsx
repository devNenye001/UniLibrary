import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  role: "student",
  password: "",
  confirmPassword: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { setSession } = useAuth();

  useEffect(() => {
    document.title = "UniLibrary | Register";
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = "Full name is required.";
    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      const session = await registerUser({
        name: form.name,
        email: form.email,
        role: form.role,
        password: form.password,
      });

      setSession(session);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setServerError(error.message || "Unable to create your account right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef4fb_100%)] px-6 py-10">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[2rem] bg-campus-900 px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)]">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">UniLibrary</p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">
            Create a role-aware academic workspace.
          </h1>
          <p className="mt-5 text-sm leading-7 text-slate-300">
            Students can search and study, lecturers can upload course materials, and admins can monitor the whole platform from one shared system.
          </p>
          <div className="mt-10 grid gap-4">
            {[
              "Students discover notes, past questions, and AI recommendations.",
              "Lecturers upload academic documents and expand the knowledge base.",
              "Admins review activity and manage platform oversight.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white px-8 py-10 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-slate-900">Register</h2>
            <p className="mt-2 text-sm text-slate-500">Set up your UniLibrary account.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="name">
                Full name
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                id="name"
                name="name"
                onChange={handleChange}
                placeholder="Adaeze Okafor"
                type="text"
                value={form.name}
              />
              {errors.name ? <p className="mt-2 text-sm text-rose-600">{errors.name}</p> : null}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="name@university.edu"
                  type="email"
                  value={form.email}
                />
                {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="role">
                  Role
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="role"
                  name="role"
                  onChange={handleChange}
                  value={form.role}
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  type="password"
                  value={form.password}
                />
                {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password}</p> : null}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirmPassword">
                  Confirm password
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  type="password"
                  value={form.confirmPassword}
                />
                {errors.confirmPassword ? <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword}</p> : null}
              </div>
            </div>

            {serverError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {serverError}
              </div>
            ) : null}

            <button
              className="w-full rounded-2xl bg-campus-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-semibold text-campus-600 hover:text-campus-700" to="/login">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
