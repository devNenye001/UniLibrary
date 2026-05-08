import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  IoChatbubblesOutline,
  IoGridOutline,
  IoLibraryOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoSearchOutline,
  IoTimeOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: IoGridOutline },
  { label: "Browse Materials", to: "/browse", icon: IoLibraryOutline },
  { label: "Search", to: "/search", icon: IoSearchOutline },
  { label: "My History", to: "/history", icon: IoTimeOutline },
  { label: "Chatbot", to: "/chat", icon: IoChatbubblesOutline },
];

function navClass({ isActive }) {
  return `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-campus-100 text-campus-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

function SidebarInner({ user, onClose }) {
  const initial = user?.name?.[0]?.toUpperCase() ?? "S";

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-5">
        <Link className="flex items-center gap-3" to="/dashboard">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-campus-900 text-sm font-bold text-white shadow-lg shadow-campus-900/20">
            UL
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">UniLibrary</p>
            <p className="text-xs text-slate-500">Student Portal</p>
          </div>
        </Link>
        {onClose ? (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 lg:hidden"
            onClick={onClose}
            type="button"
          >
            <IoCloseOutline className="text-lg" />
          </button>
        ) : null}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
          Menu
        </p>
        <ul className="space-y-1">
          {NAV_ITEMS.map((navItem) => {
            const NavIcon = navItem.icon;
            return (
              <li key={navItem.to}>
                <NavLink
                  className={navClass}
                  to={navItem.to}
                  end={navItem.to === "/dashboard"}
                  onClick={onClose}
                >
                  <NavIcon className="shrink-0 text-lg" />
                  {navItem.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User card at bottom */}
      <div className="border-t border-slate-200/70 px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-campus-100 text-sm font-semibold text-campus-700">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.name || "Student"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {[user?.department, user?.level ? `${user.level} Level` : null]
                .filter(Boolean)
                .join(" · ") || "Student"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ── Desktop sidebar ──────────────────────────────────────── */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-200/70 bg-white lg:block">
        <SidebarInner user={user} />
      </aside>

      {/* ── Mobile overlay sidebar ───────────────────────────────── */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute bottom-0 left-0 top-0 z-10 w-72 bg-white shadow-2xl shadow-slate-900/20">
            <SidebarInner user={user} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      ) : null}

      {/* ── Right column (topbar + content) ──────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            {/* Left: hamburger (mobile) + mobile logo */}
            <div className="flex items-center gap-4">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                type="button"
              >
                <IoMenuOutline className="text-xl" />
              </button>
              <Link className="flex items-center gap-2 lg:hidden" to="/dashboard">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-campus-900 text-xs font-bold text-white">
                  UL
                </div>
                <p className="text-sm font-semibold text-slate-900">UniLibrary</p>
              </Link>
            </div>

            {/* Right: user info + logout */}
            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user?.name || "Student"}
                </p>
                <p className="text-xs text-slate-500">
                  {[user?.department, user?.level ? `${user.level} Level` : null]
                    .filter(Boolean)
                    .join(" · ") || "Student"}
                </p>
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
                onClick={handleLogout}
                type="button"
              >
                <IoLogOutOutline className="text-base" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
