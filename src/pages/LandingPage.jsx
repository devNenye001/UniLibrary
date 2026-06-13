import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import {
  IoArrowForward,
  IoCloudUploadOutline,
  IoSchoolOutline,
  IoSearchOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import Footer from "../components/layouts/Footer.jsx";
import { FaBook } from "react-icons/fa";

const features = [
  {
    title: "Academic Search",
    description:
      "Search across lecture notes, past questions, and structured course archives with a focused university workflow.",
    icon: <IoSearchOutline className="text-2xl text-campus-700" />,
  },
  {
    title: "Lecturer Uploads",
    description:
      "Support departments with clean upload flows for lecture materials, revision packs, and assessment archives.",
    icon: <IoCloudUploadOutline className="text-2xl text-campus-700" />,
  },
  {
    title: "AI Recommendations",
    description:
      "Surface useful documents based on role-aware recommendations that guide students toward the right materials faster.",
    icon: <IoSparklesOutline className="text-2xl text-campus-700" />,
  },
];

export default function LandingPage() {
  useEffect(() => {
    document.title = "UniLibrary | University AI-Powered Digital Library";
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-campus-900 text-sm font-bold text-white">
              <FaBook />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">UniLibrary</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" to="/login">
              Login
            </Link>
            <Link className="rounded-full bg-campus-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-campus-700" to="/register">
              Register
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-6 py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(35,72,118,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,116,144,0.12),transparent_28%)]" />
          <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <Motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-campus-200 bg-white px-4 py-2 text-sm font-medium text-campus-700 shadow-sm">
                <IoSchoolOutline />
                Built for students, lecturers, and administrators
              </div>
              <h1 className="mt-8 max-w-3xl text-5xl font-semibold leading-tight text-slate-950 md:text-6xl">
                A modern university portal for academic documents and AI-powered discovery.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
                UniLibrary brings lecture notes, past questions, uploads, search, and recommendations into one clean campus-ready system.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link className="inline-flex items-center gap-2 rounded-full bg-campus-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-campus-700" to="/register">
                  Enter UniLibrary
                  <IoArrowForward />
                </Link>
                <Link className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white" to="/login">
                  Access Existing Account
                </Link>
              </div>
            </Motion.div>

            <Motion.div
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="rounded-4xl border border-white/70 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-campus-900 p-6 text-white">
                    <p className="text-sm text-sky-200">AI search</p>
                    <h3 className="mt-3 text-2xl font-semibold">Find the right document faster.</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">
                      Search by title, course code, department, or topic with a streamlined interface for serious study.
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-100 p-6">
                    <p className="text-sm text-slate-500">Role-aware access</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-900">One portal, tailored permissions.</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      Students search and view, lecturers upload materials, and admins manage the system.
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 md:col-span-2">
                    <div className="grid gap-4 md:grid-cols-3">
                      <StatCard label="Resources indexed" value="1,200+" />
                      <StatCard label="Departments supported" value="18" />
                      <StatCard label="Average discovery time" value="< 30s" />
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-campus-600">Core Features</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-950 md:text-4xl">
                Professional, minimal, and built for academic workflows.
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((feature, index) => (
                <Motion.div
                  key={feature.title}
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.45, delay: index * 0.1 }}
                  className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-campus-100">
                    {feature.icon}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                </Motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl rounded-4xl bg-campus-900 px-8 py-12 text-white shadow-[0_30px_80px_rgba(15,23,42,0.16)] md:px-12">
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-200">Ready for campus deployment</p>
                <h2 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">
                  Start with the refactored UniLibrary experience.
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
                  The portal now supports dedicated authentication pages, centralized API calls, role-based rendering, and modernized routing for the new university-focused system.
                </p>
              </div>
              <Link className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-campus-700 transition hover:bg-slate-100" to="/register">
                Create an account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-[1.25rem] bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
