import { FaBook } from "react-icons/fa";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Search Archive", href: "/search" },
  { label: "Upload Materials", href: "/upload" },
  { label: "Admin Panel", href: "/admin" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-campus-900 text-sm font-bold text-white">
             <FaBook />
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">UniLibrary</p>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
            UniLibrary helps students, lecturers, and administrators manage lecture notes, past questions, and discovery workflows in one modern academic portal.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Portal</p>
          <div className="mt-4 grid gap-3">
            {quickLinks.map((link) => (
              <Link key={link.href} className="text-sm text-slate-600 transition hover:text-campus-700" to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] bg-campus-900 px-6 py-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-200">Academic Focus</p>
          <h3 className="mt-3 text-2xl font-semibold">Built for structured learning.</h3>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Search smarter, upload faster, and surface relevant documents with a portal designed for university workflows.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} UniLibrary. All rights reserved.</p>
          <p>Professional access to lecture notes, past questions, and AI recommendations.</p>
        </div>
      </div>
    </footer>
  );
}
