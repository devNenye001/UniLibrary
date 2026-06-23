import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBack, IoChevronForward, IoFilterOutline } from "react-icons/io5";
import MaterialCard from "../../components/MaterialCard.jsx";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import { getMaterials } from "../../services/api.js";

const LEVEL_OPTIONS = ["100", "200", "300", "400", "500"];

function MaterialCardSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="h-6 w-24 rounded-full bg-slate-100" />
        <div className="h-6 w-16 rounded-full bg-slate-100" />
      </div>
      <div className="mt-4 h-5 w-full rounded-xl bg-slate-100" />
      <div className="mt-2 h-4 w-4/5 rounded-xl bg-slate-100" />
      <div className="mt-3 flex gap-3">
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
      <div className="mt-5 h-10 w-full rounded-2xl bg-slate-100" />
    </div>
  );
}

function createSessionOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 8 }, (_, index) => String(currentYear - index));
}

const initialFilters = {
  department: "",
  level: "",
  courseCode: "",
  academicSession: "",
};

export default function BrowseMaterials() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [materials, setMaterials] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, pageSize: 12 });

  useEffect(() => {
    document.title = "GoLibrary | Browse Materials";
  }, []);

  useEffect(() => {
    let active = true;

    const loadMaterials = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getMaterials({ ...filters, page });
        if (!active) return;

        setMaterials(response.items);
        setDepartments(response.departments);
        setPagination({
          total: response.total,
          totalPages: response.totalPages,
          pageSize: response.pageSize,
        });
      } catch (loadError) {
        if (!active) return;
        setError(loadError.message || "Unable to load library materials.");
        setMaterials([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMaterials();

    return () => {
      active = false;
    };
  }, [filters, page]);

  const sessionOptions = useMemo(() => createSessionOptions(), []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value }));
    setPage(1);
  };

  return (
    <StudentLayout>
      <div className="px-6 py-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-campus-100 text-campus-700">
                <IoFilterOutline className="text-xl" />
              </div>
              <h1 className="mt-4 text-3xl font-semibold text-slate-900">
                Explore academic materials by filter
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
                Narrow materials by department, level, course code, and session in the
                same clean student library experience.
              </p>
            </div>

            <div className="rounded-[1.5rem] bg-campus-50 px-5 py-4 text-sm text-campus-700">
              <span className="font-semibold text-slate-900">{pagination.total}</span> total
              {" "}results
            </div>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="department">
                  Department
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="department"
                  name="department"
                  onChange={handleFilterChange}
                  value={filters.department}
                >
                  <option value="">All departments</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="level">
                  Level
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="level"
                  name="level"
                  onChange={handleFilterChange}
                  value={filters.level}
                >
                  <option value="">All levels</option>
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level} Level
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="courseCode">
                  Course Code
                </label>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="courseCode"
                  name="courseCode"
                  onChange={handleFilterChange}
                  placeholder="e.g. CSC 401"
                  type="text"
                  value={filters.courseCode}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="academicSession">
                  Academic Session
                </label>
                <select
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-campus-600 focus:ring-4 focus:ring-campus-100"
                  id="academicSession"
                  name="academicSession"
                  onChange={handleFilterChange}
                  value={filters.academicSession}
                >
                  <option value="">All sessions</option>
                  {sessionOptions.map((session) => (
                    <option key={session} value={session}>
                      {session}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error ? (
            <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </section>

        <section className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, index) => <MaterialCardSkeleton key={index} />)
              : materials.length
                ? materials.map((item) => (
                    <MaterialCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      courseCode={item.courseCode}
                      department={item.department}
                      level={item.level}
                      academicSession={item.academicSession ?? item.year ?? item.session}
                      downloadCount={item.downloadCount}
                      fileUrl={item.fileUrl}
                      onView={({ id }) => navigate(`/materials/${id}`)}
                    />
                  ))
                : (
                  <div className="col-span-full rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                    <p className="text-lg font-semibold text-slate-900">
                      No materials match those filters
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-500">
                      Try broadening your filters to explore more library results.
                    </p>
                  </div>
                )}
          </div>
        </section>

        {!loading && materials.length ? (
          <section className="mt-8 flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
              <span className="font-semibold text-slate-900">{pagination.totalPages}</span>
            </p>

            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={page <= 1}
                onClick={() => setPage((current) => current - 1)}
                type="button"
              >
                <IoChevronBack />
                Prev
              </button>
              <button
                className="inline-flex items-center gap-2 rounded-full bg-campus-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((current) => current + 1)}
                type="button"
              >
                Next
                <IoChevronForward />
              </button>
            </div>
          </section>
        ) : null}
      </div>
    </StudentLayout>
  );
}
