import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  IoCalendarOutline,
  IoCloudDownloadOutline,
  IoDocumentTextOutline,
  IoEyeOutline,
  IoLayersOutline,
  IoPersonOutline,
  IoSchoolOutline,
} from "react-icons/io5";
import MaterialCard from "../../components/MaterialCard.jsx";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import LecturerLayout from "../../components/lecturer/LecturerLayout.jsx";
import StudentLayout from "../../components/student/StudentLayout.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  downloadMaterial,
  getMaterialById,
  getSimilarMaterials,
  logMaterialView,
} from "../../services/api.js";

function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="h-4 w-28 rounded bg-slate-100" />
        <div className="mt-4 h-10 w-3/4 rounded-xl bg-slate-100" />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-20 rounded-3xl bg-slate-100" />
          ))}
        </div>
      </div>
      <div className="h-128 rounded-4xl border border-slate-200 bg-white shadow-sm" />
    </div>
  );
}

function MetaCard({ icon, label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="text-campus-700">{icon}</span>
        {label}
      </div>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value || "-"}</p>
    </div>
  );
}

function RoleLayout({ role, children }) {
  if (role === "admin") return <AdminLayout>{children}</AdminLayout>;
  if (role === "lecturer") return <LecturerLayout>{children}</LecturerLayout>;
  return <StudentLayout>{children}</StudentLayout>;
}

export default function MaterialDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [material, setMaterial] = useState(null);
  const [similarMaterials, setSimilarMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "GoLibrary | Material Detail";
  }, []);

  useEffect(() => {
    if (!id) return;

    let active = true;

    const loadMaterial = async () => {
      setLoading(true);
      setError("");

      try {
        const [detail, similar] = await Promise.all([
          getMaterialById(id),
          getSimilarMaterials(id),
          logMaterialView(id).catch(() => null),
        ]);

        if (!active) return;
        setMaterial(detail);
        setSimilarMaterials(similar.filter((item) => item.id !== String(id)).slice(0, 3));
      } catch (detailError) {
        if (!active) return;
        setError(detailError.message || "Unable to load this material.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadMaterial();

    return () => {
      active = false;
    };
  }, [id]);

  const previewUrl = useMemo(
    () => material?.fileUrl ?? material?.url ?? material?.file?.url ?? "",
    [material],
  );

  const handleDownload = () => {
    if (!previewUrl) return;

    const anchor = document.createElement("a");
    anchor.href = previewUrl;
    anchor.download = material?.fileName || `${material?.title || "material"}.pdf`;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.click();

    downloadMaterial(id)
      .then((updated) => {
        setMaterial((current) => {
          const count = Number(
            updated?.downloadCount ??
            updated?.material?.downloadCount ??
            (current?.downloadCount ?? 0) + 1
          );
          return {
            ...current,
            downloadCount: count,
            downloads: count,
          };
        });
      })
      .catch(() => {
        toast.error("Download started, but the download count could not be updated.");
      });
  };

  return (
    <RoleLayout role={role}>
      <div className="px-6 py-8">
        {loading ? <DetailSkeleton /> : null}

        {!loading && error ? (
          <div className="rounded-4xl border border-rose-200 bg-rose-50 px-6 py-10 text-center shadow-sm">
            <p className="text-lg font-semibold text-rose-800">Material unavailable</p>
            <p className="mt-2 text-sm text-rose-700">{error}</p>
          </div>
        ) : null}

        {!loading && material ? (
          <>
            <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <span className="inline-flex rounded-full bg-campus-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-campus-700">
                    {material.courseCode || "-"}
                  </span>
                  <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-900">
                    {material.title || "Untitled Material"}
                  </h1>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-campus-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-campus-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!previewUrl}
                    onClick={handleDownload}
                    type="button"
                  >
                    <IoCloudDownloadOutline />
                    Download
                  </button>
                  {previewUrl && previewUrl.includes("mega.nz") && (
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      Open in MEGA
                    </a>
                  )}
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <MetaCard
                  icon={<IoSchoolOutline />}
                  label="Department"
                  value={material.department}
                />
                <MetaCard
                  icon={<IoLayersOutline />}
                  label="Level"
                  value={material.level ? `${material.level} Level` : "-"}
                />
                <MetaCard
                  icon={<IoCalendarOutline />}
                  label="Academic Session"
                  value={material.academicSession ?? material.year ?? material.session}
                />
                <MetaCard
                  icon={<IoPersonOutline />}
                  label="Uploaded By"
                  value={material.uploadedBy}
                />
                <MetaCard
                  icon={<IoCloudDownloadOutline />}
                  label="Downloads"
                  value={material.downloadCount ?? 0}
                />
                <MetaCard
                  icon={<IoEyeOutline />}
                  label="Views"
                  value={material.viewCount ?? material.views ?? "-"}
                />
              </div>

              {previewUrl && previewUrl.includes("mega.nz") && (
                <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-rose-100 bg-rose-50/50 p-6 text-center sm:flex-row sm:text-left">
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                      <IoCloudDownloadOutline className="text-2xl" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">File stored on MEGA</p>
                      <p className="text-xs text-slate-500 mt-1">
                        This file cannot be previewed inline. Open it directly on MEGA to view or download.
                      </p>
                    </div>
                  </div>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-rose-700"
                  >
                    Open in MEGA
                  </a>
                </div>
              )}
            </section>

            {previewUrl && !previewUrl.includes("mega.nz") && !previewUrl.includes("example.com") && !previewUrl.includes("example.org") && (
              <section className="mt-8 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-campus-100 text-campus-700">
                    <IoDocumentTextOutline className="text-xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      In-browser document view
                    </h2>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
                  <iframe
                    className="h-[70vh] min-h-128 w-full bg-white"
                    src={previewUrl}
                    title={material.title || "Material preview"}
                  />
                </div>
              </section>
            )}

            <section className="mt-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
                  Recommendations
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Similar Materials
                </h2>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {similarMaterials.length ? (
                  similarMaterials.map((item) => (
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
                      onView={({ id: materialId }) => navigate(`/materials/${materialId}`)}
                    />
                  ))
                ) : (
                  <div className="col-span-full rounded-[1.75rem] border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
                    <p className="text-base font-semibold text-slate-900">
                      No similar materials yet
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Recommendations will appear here as more related documents become
                      available.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </RoleLayout>
  );
}
