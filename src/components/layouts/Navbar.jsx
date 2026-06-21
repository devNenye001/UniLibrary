import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoLogOutOutline, IoSearchOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext.jsx";

function navClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition-all ${
    isActive
      ? "bg-slate-900 text-white shadow-md"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

export default function Navbar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, logout, role, user, hasRole } = useAuth();

  const handleSearch = (event) => {
    event?.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/20 bg-white/70 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" to={isAuthenticated ? "/dashboard" : "/"}>
            <img src="/logo1.jpg" alt="GoLibrary Logo" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
            <div>
              <p className="text-lg font-bold tracking-tight text-slate-900">GoLibrary</p>
            </div>
          </Link>

          {isAuthenticated ? (
            <div className="rounded-full border border-slate-200/50 bg-white/50 px-3 py-1.5 text-xs font-semibold capitalize text-campus-600 lg:hidden shadow-sm backdrop-blur-md">
              {role}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:justify-end">
          {isAuthenticated ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <NavLink className={navClass} to="/dashboard">
                  Dashboard
                </NavLink>
                <NavLink className={navClass} to="/search">
                  Search
                </NavLink>
                {hasRole(["lecturer", "admin"]) ? (
                  <NavLink className={navClass} to="/upload">
                    Upload
                  </NavLink>
                ) : null}
                {hasRole(["admin"]) ? (
                  <NavLink className={navClass} to="/admin">
                    Admin
                  </NavLink>
                ) : null}
              </div>

              <form className="relative flex-1 lg:max-w-md" onSubmit={handleSearch}>
                <IoSearchOutline className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-full border border-slate-200/50 bg-white/50 py-2.5 pl-11 pr-4 text-sm outline-none transition-all focus:border-campus-300 focus:bg-white focus:ring-4 focus:ring-campus-100 shadow-sm backdrop-blur-md"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search course code, title, or topic"
                  type="search"
                  value={query}
                />
              </form>

              <div className="flex items-center gap-4">
                <div className="hidden text-right lg:block border-r border-slate-200 pr-4">
                  <p className="text-sm font-bold text-slate-900">{user?.name || "GoLibrary User"}</p>
                  <p className="text-xs font-medium capitalize text-campus-600">{role}</p>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200/50 bg-white/50 shadow-sm px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-red-600 backdrop-blur-md"
                  onClick={handleLogout}
                  type="button"
                >
                  <IoLogOutOutline className="text-lg" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 self-end">
              <Link className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors" to="/login">
                Sign In
              </Link>
              <Link className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[1px]" to="/register">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
