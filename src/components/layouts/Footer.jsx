import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Search Archive", href: "/search" },
  { label: "Upload Materials", href: "/upload" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200/60 bg-white/50 backdrop-blur-xl relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(10,132,255,0.05),transparent_50%)] pointer-events-none"></div>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-[1.2fr_0.8fr_1fr] relative z-10">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo1.jpg" alt="GoLibrary Logo" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-slate-900">GoLibrary</span>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-slate-500">
            GoLibrary helps students, lecturers, and administrators manage academic resources, past questions, and knowledge discovery in one elegant portal.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Platform</p>
          <div className="mt-6 grid gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} className="text-sm font-medium text-slate-600 transition-colors hover:text-campus-600" to={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-slate-900 p-8 text-white shadow-2xl relative overflow-hidden border border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(94,92,230,0.2),transparent_70%)]"></div>
          <p className="text-xs font-semibold uppercase tracking-widest text-campus-300 relative z-10">Academic Excellence</p>
          <h3 className="mt-4 text-2xl font-bold tracking-tight relative z-10">Empowering discovery.</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300 relative z-10">
            A premium digital library infrastructure designed specifically for Godfrey Okoye University.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200/60 relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} GoLibrary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
