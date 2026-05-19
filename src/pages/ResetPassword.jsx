import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import InputField from "../components/auth/InputField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { resetPassword } from "../services/api.js";

const ROLE_REDIRECTS = {
  student: "/dashboard",
  lecturer: "/lecturer/dashboard",
  admin: "/admin/dashboard",
};

const LEFT_FEATURES = [
  "Choose a fresh password with at least 8 characters.",
  "Your reset link can only be used before it expires.",
  "After the reset, you will be signed in automatically.",
];

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "UniLibrary | Reset Password";
  }, []);

  const validate = () => {
    const next = {};

    if (!form.password) {
      next.password = "Password is required.";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match.";
    }

    setErrors(next);
    return !Object.keys(next).length;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");

    try {
      const session = await resetPassword(token, form.password);
      const nextAuth = setSession(session);
      const role = nextAuth.user?.role ?? "student";

      toast.success("Password reset successfully.");
      navigate(ROLE_REDIRECTS[role] ?? "/dashboard", { replace: true });
    } catch (err) {
      setServerError(err.message || "Unable to reset your password. Please request a new link.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Create a new UniLibrary password."
      description="Use your secure reset link to restore access to your digital library account."
      features={LEFT_FEATURES}
      gridCols="md:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900">Reset password</h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter and confirm your new password.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <InputField
          label="New password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Enter a new password"
        />

        <InputField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Repeat your new password"
        />

        {serverError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {serverError}
          </div>
        ) : null}

        <button
          className="w-full rounded-2xl bg-campus-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={submitting || !token}
          type="submit"
        >
          {submitting ? "Resetting password..." : "Reset password"}
        </button>

        <p className="text-sm text-slate-500">
          Need a new link?{" "}
          <Link className="font-semibold text-campus-600 hover:text-campus-700" to="/forgot-password">
            Request another reset
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
