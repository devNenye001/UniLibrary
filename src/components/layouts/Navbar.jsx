import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoLogOutOutline, IoSearchOutline } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext.jsx";

function navClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-campus-100 text-campus-700"
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
    <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3" to={isAuthenticated ? "/dashboard" : "/"}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-campus-900 text-sm font-bold text-white shadow-lg shadow-campus-900/15">
              UL
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-900">UniLibrary</p>
              <p className="text-xs text-slate-500">University AI Digital Library</p>
            </div>
          </Link>

          {isAuthenticated ? (
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium capitalize text-slate-600 lg:hidden">
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
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-campus-300 focus:bg-white focus:ring-4 focus:ring-campus-100"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search course code, title, or topic"
                  type="search"
                  value={query}
                />
              </form>

              <div className="flex items-center gap-3">
                <div className="hidden text-right lg:block">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || "UniLibrary User"}</p>
                  <p className="text-xs capitalize text-slate-500">{role}</p>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
                  onClick={handleLogout}
                  type="button"
                >
                  <IoLogOutOutline className="text-base" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 self-end">
              <Link className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" to="/login">
                Login
              </Link>
              <Link className="rounded-full bg-campus-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-campus-700" to="/register">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
