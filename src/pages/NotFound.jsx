import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-campus-900">
          <span className="text-lg font-bold text-white">G</span>
        </div>
        <span className="text-xl font-bold tracking-tight text-campus-900">GoLibrary</span>
      </div>

      <div className="mb-4 text-[7rem] font-extrabold leading-none tracking-tight text-campus-900/10 select-none">
        404
      </div>

      <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500">
        The page you're looking for doesn't exist or may have been moved. Check the URL or head
        back to the library.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        >
          Go back
        </button>
        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-campus-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-campus-800"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
