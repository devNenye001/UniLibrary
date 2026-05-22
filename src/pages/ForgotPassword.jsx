import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import InputField from "../components/auth/InputField.jsx";
import { forgotPassword } from "../services/api.js";

const LEFT_FEATURES = [
  "Enter the email address linked to your UniLibrary account.",
  "A secure password reset link will be sent to your inbox.",
  "The link expires after 30 minutes for your security.",
];

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "UniLibrary | Forgot Password";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) { setError("Email is required."); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Enter a valid email address."); return; }

    setSubmitting(true);
    setError("");

    try {
      const res = await forgotPassword(email);
      const msg =
        res?.message ??
        "If that email address is registered, a password reset link has been sent to your inbox.";
      setSent(true);
      toast.success(msg);
    } catch (err) {
      const message =
        err.message ||
        err.response?.message ||
        "Unable to send the reset email. Please try again later.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="Reset your access to the digital library."
      description="Enter your registered email address and we'll send you a secure link to reset your password."
      features={LEFT_FEATURES}
      gridCols="md:grid-cols-[1.1fr_0.9fr]"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-slate-900">Forgot password?</h2>
        <p className="mt-2 text-sm text-slate-500">
          We'll send a reset link to your registered email address.
        </p>
      </div>

      {sent ? (
        <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-6 py-6 text-sm">
          <p className="font-semibold text-emerald-800">Check your inbox</p>
          <p className="mt-2 leading-7 text-emerald-700">
            If an account exists for{" "}
            <span className="font-medium">{email}</span>, a reset link has been sent. Check your
            spam folder if it doesn't arrive within a few minutes.
          </p>
          <Link
            className="mt-4 inline-block font-semibold text-campus-600 hover:text-campus-700"
            to="/login"
          >
            Return to login
          </Link>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField
            label="Email address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            error={error}
            placeholder="student@university.edu"
          />

          <button
            className="w-full rounded-2xl bg-campus-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Sending reset link..." : "Send reset link"}
          </button>

          <p className="text-sm text-slate-500">
            Remember your password?{" "}
            <Link className="font-semibold text-campus-600 hover:text-campus-700" to="/login">
              Back to login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
