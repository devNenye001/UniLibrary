import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout.jsx";
import InputField from "../components/auth/InputField.jsx";
import { registerUser } from "../services/api.js";
import axiosClient from "../services/axiosClient.js";

const DEPARTMENTS = [
  "Accounting",
  "Agricultural Science",
  "Architecture",
  "Banking and Finance",
  "Biochemistry",
  "Biology",
  "Business Administration",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Computer Science",
  "Economics",
  "Education",
  "Electrical Engineering",
  "Environmental Science",
  "Estate Management",
  "Geography",
  "History",
  "Information Technology",
  "Law",
  "Mass Communication",
  "Mathematics",
  "Mechanical Engineering",
  "Medicine and Surgery",
  "Microbiology",
  "Nursing",
  "Petroleum Engineering",
  "Pharmacy",
  "Physics",
  "Political Science",
  "Psychology",
  "Public Administration",
  "Sociology",
  "Statistics",
  "Urban and Regional Planning",
];

const LEVELS = ["100", "200", "300", "400", "500"];



const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "student",
  department: "",
  level: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [slowRequest, setSlowRequest] = useState(false);

  useEffect(() => {
    document.title = "GoLibrary | Register";
    axiosClient.get("/health").catch(() => { });
  }, []);

  const handleChange = (e) => {

    const { name, value } = e.target;
    setForm((c) => {
      const next = { ...c, [name]: value };
      // Clear level when switching away from student
      if (name === "role" && value !== "student") next.level = "";
      return next;
    });
    setErrors((c) => ({ ...c, [name]: "" }));
    setServerError("");
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Full name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.department) next.department = "Please select your department.";
    if (form.role === "student" && !form.level) next.level = "Please select your level.";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setServerError("");
    setSlowRequest(false);

    const slowTimer = setTimeout(() => setSlowRequest(true), 5000);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
      department: form.department,
      ...(form.role === "student" && { level: form.level }),
    };

    try {
      const res = await registerUser(payload);
      const msg = res?.message ?? "Account created successfully. Awaiting admin approval.";
      setSuccessMessage(msg);
      toast.success("Registration submitted — awaiting admin approval.");
      setForm(initialForm);
    } catch (err) {
      setServerError(err.message || "Unable to create your account. Please try again.");
    } finally {
      clearTimeout(slowTimer);
      setSubmitting(false);
      setSlowRequest(false);
    }
  };

  return (
    <AuthLayout maxWidth="max-w-2xl">
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 shadow-md mb-6">
          <img src="/logo1.jpg" alt="Logo" className="h-full w-full rounded-2xl object-cover" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create an account</h2>
        <p className="mt-2 text-sm text-slate-500">Set up your GoLibrary account.</p>
      </div>

      {successMessage ? (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-6 text-sm">
          <p className="font-semibold text-emerald-800">Registration submitted</p>
          <p className="mt-2 leading-7 text-emerald-700">{successMessage}</p>
          <p className="mt-4 text-emerald-700">
            You will receive an email once an admin approves your account.{" "}
            <Link
              className="font-semibold text-campus-600 hover:text-campus-700"
              to="/login"
            >
              Return to login
            </Link>
          </p>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {/* Full name */}
          <InputField
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="Adaeze Okafor"
          />

          {/* Email + Role */}
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="name@university.edu"
            />
            <InputField label="Role" name="role" as="select" value={form.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="lecturer">Lecturer</option>
            </InputField>
          </div>

          {/* Department + Level (level only for students) */}
          <div className={`grid gap-5 ${form.role === "student" ? "md:grid-cols-2" : ""}`}>
            <InputField
              label="Department"
              name="department"
              as="select"
              value={form.department}
              onChange={handleChange}
              error={errors.department}
            >
              <option value="">Select department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </InputField>

            {form.role === "student" ? (
              <InputField
                label="Level"
                name="level"
                as="select"
                value={form.level}
                onChange={handleChange}
                error={errors.level}
              >
                <option value="">Select level</option>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l} Level
                  </option>
                ))}
              </InputField>
            ) : null}
          </div>

          {/* Password + Confirm */}
          <div className="grid gap-5 md:grid-cols-2">
            <InputField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Minimum 8 characters"
            />
            <InputField
              label="Confirm password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="Repeat your password"
            />
          </div>

          {serverError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {serverError}
            </div>
          ) : null}

          {slowRequest ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              The server is starting up — this can take up to 30 seconds on first use. Please wait...
            </div>
          ) : null}

          <button
            className="w-full rounded-2xl bg-campus-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>

          <p className="text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-semibold text-campus-600 hover:text-campus-700" to="/login">
              Login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
