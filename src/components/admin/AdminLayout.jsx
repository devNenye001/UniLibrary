import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  IoBarChartOutline,
  IoCheckmarkCircleOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoGridOutline,
  IoLogOutOutline,
  IoMenuOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext.jsx";

const NAV_ITEMS = [
  { label: "Dashboard", to: "/admin/dashboard", icon: IoGridOutline },
  { label: "Approvals", to: "/admin/approvals", icon: IoCheckmarkCircleOutline },
  { label: "Analytics", to: "/admin/analytics", icon: IoBarChartOutline },
  { label: "Materials", to: "/admin/materials", icon: IoDocumentTextOutline },
  { label: "Users", to: "/admin/users", icon: IoPeopleOutline },
];

function navClass({ isActive }) {
  return `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition border ${
    isActive
      ? "bg-white/70 border-slate-200/40 text-campus-700 shadow-sm font-semibold"
      : "border-transparent text-slate-600 hover:bg-white/30 hover:text-slate-900"
  }`;
}

function SidebarInner({ user, onClose }) {
  const initial = user?.name?.[0]?.toUpperCase() ?? "A";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-200/30 px-5 py-5">
        <Link className="flex items-center gap-3" to="/admin/dashboard">
          <img src="/logo1.jpg" alt="GoLibrary Logo" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
          <div>
            <p className="text-base font-bold tracking-tight text-slate-900">GoLibrary</p>
            <p className="text-[10px] font-bold text-campus-600 uppercase tracking-widest">Admin Portal</p>
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

      <nav className="flex-1 overflow-y-auto px-4 py-5">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <NavLink
                  className={navClass}
                  to={item.to}
                  end={item.to === "/admin/dashboard"}
                  onClick={onClose}
                >
                  <Icon className="shrink-0 text-lg" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200/30 px-4 py-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/60 border border-white/80 px-4 py-3 shadow-sm backdrop-blur-md">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-campus-600/10 text-sm font-bold text-campus-700">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-900">
              {user?.name || "Admin"}
            </p>
            <p className="truncate text-[10px] font-medium text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50/50 aurora-bg font-sans">
      <aside className="hidden w-64 shrink-0 border-r border-slate-200/40 bg-white/40 backdrop-blur-2xl lg:block">
        <SidebarInner user={user} />
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute bottom-0 left-0 top-0 z-10 w-72 bg-white/60 backdrop-blur-2xl shadow-2xl shadow-slate-900/10 border-r border-white/40">
            <SidebarInner user={user} onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-40 border-b border-slate-200/40 bg-white/40 backdrop-blur-2xl">
          <div className="flex items-center justify-between gap-4 px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-100 lg:hidden"
                onClick={() => setSidebarOpen(true)}
                type="button"
              >
                <IoMenuOutline className="text-xl" />
              </button>
              <Link className="flex items-center gap-2 lg:hidden" to="/admin/dashboard">
                <img src="/logo1.jpg" alt="GoLibrary Logo" className="h-8 w-8 rounded-lg object-cover shadow-sm" />
                <p className="text-sm font-bold text-slate-900">GoLibrary</p>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name || "Admin"}</p>
                <p className="text-xs text-slate-500">Administrator</p>
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

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
