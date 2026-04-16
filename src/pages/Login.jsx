import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  email: "",
  password: "",
};

export default function Login() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();

  useEffect(() => {
    document.title = "UniLibrary | Login";
  }, []);

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = "Enter a valid university email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
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
      const session = await loginUser(form);
      setSession(session);

      const redirectTarget = location.state?.from?.pathname ?? "/dashboard";
      navigate(redirectTarget, { replace: true });
    } catch (error) {
      setServerError(error.message || "Unable to log in right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#edf2f7_45%,#dbe8f4_100%)] px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(35,72,118,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(14,116,144,0.12),transparent_30%)]" />
      <div className="relative grid w-full max-w-5xl gap-8 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
        <section className="bg-campus-900 px-8 py-12 text-white md:px-10">
          <p className="mb-6 text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">
            UniLibrary
          </p>
          <h1 className="max-w-md text-4xl font-semibold leading-tight">
            Sign in to your university digital library.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300">
            Access AI-powered search, curated recommendations, lecture materials, and department archives from one portal.
          </p>
          <div className="mt-10 space-y-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-200">
            <p>Use an email containing `lect` to preview lecturer access.</p>
            <p>Use an email containing `admin` to preview admin access.</p>
            <p>Any other email signs in as a student when the demo API fallback is used.</p>
          </div>
        </section>

        <section className="px-8 py-12 md:px-10">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">
              Continue to your UniLibrary dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@university.edu"
              />
              {errors.email ? <p className="mt-2 text-sm text-rose-600">{errors.email}</p> : null}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password ? <p className="mt-2 text-sm text-rose-600">{errors.password}</p> : null}
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
              {submitting ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500">
            New to the platform?{" "}
            <Link className="font-semibold text-campus-600 hover:text-campus-700" to="/register">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
