import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import InputField from "../components/auth/InputField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { loginUser } from "../services/api.js";

const ROLE_REDIRECTS = {
  student: "/dashboard",
  lecturer: "/lecturer/dashboard",
  admin: "/admin/dashboard",
};

const LEFT_FEATURES = [
  "Use an email containing 'lect' to preview lecturer access in demo mode.",
  "Use an email containing 'admin' to preview admin access in demo mode.",
  "Any other email signs you in as a student when the demo fallback is active.",
];

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { setSession } = useAuth();

  useEffect(() => {
    document.title = "UniLibrary | Login";
  }, []);

  const validate = () => {
    const next = {};
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }
    setErrors(next);
    return !Object.keys(next).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((c) => ({ ...c, [name]: value }));
    setErrors((c) => ({ ...c, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      const session = await loginUser(form);
      setSession(session);

      const role = session.user?.role ?? "student";
      const intendedPath = location.state?.from?.pathname;
      const destination = intendedPath ?? ROLE_REDIRECTS[role] ?? "/dashboard";

      toast.success(`Welcome back, ${session.user?.name || "Scholar"}!`);
      navigate(destination, { replace: true });
    } catch (err) {
      setServerError(err.message || "Unable to log in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Sign in to your university digital library."
      description="Access AI-powered search, curated recommendations, lecture materials, and department archives from one portal."
      features={LEFT_FEATURES}
      gridCols="md:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900">Welcome back</h2>
        <p className="mt-2 text-sm text-slate-500">Continue to your UniLibrary dashboard.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <InputField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="student@university.edu"
        />

        <div>
          <InputField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
          />
          <div className="mt-2 flex justify-end">
            <Link
              className="text-sm font-medium text-campus-600 hover:text-campus-700"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
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
          {submitting ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-sm text-slate-500">
        New to the platform?{" "}
        <Link className="font-semibold text-campus-600 hover:text-campus-700" to="/register">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
