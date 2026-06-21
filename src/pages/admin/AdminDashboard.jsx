import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoHourglassOutline,
  IoPeopleOutline,
  IoPersonAddOutline,
} from "react-icons/io5";
import StatCard from "../../components/StatCard.jsx";
import { RecentRegistrationsTable } from "../../components/admin/ApprovalTables.jsx";
import { AdminPageHeader, AdminSectionCard } from "../../components/admin/AdminUi.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { getAdminStats, getUsers } from "../../services/api.js";

function sortByNewest(users) {
  return [...users].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    document.title = "UniLibrary | Admin Dashboard";
  }, []);

  useEffect(() => {
    let active = true;

    getAdminStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .finally(() => {
        if (active) setLoadingStats(false);
      });

    getUsers(token)
      .then((data) => {
        if (active) setUsers(data);
      })
      .finally(() => {
        if (active) setLoadingUsers(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const recentUsers = useMemo(() => sortByNewest(users).slice(0, 5), [users]);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? users.length,
      subtitle: "Registered accounts",
      icon: IoPeopleOutline,
      color: "campus",
    },
    {
      title: "Total Materials",
      value: stats?.totalMaterials ?? 0,
      subtitle: "Library resources",
      icon: IoDocumentTextOutline,
      color: "sky",
    },
    {
      title: "Total Downloads",
      value: stats?.totalDownloads ?? 0,
      subtitle: "Across all materials",
      icon: IoDownloadOutline,
      color: "violet",
    },
    {
      title: "Pending Users",
      value: stats?.pendingUsers ?? users.filter((user) => !user.approved).length,
      subtitle: "Awaiting review",
      icon: IoPersonAddOutline,
      color: "amber",
    },
    {
      title: "Pending Materials",
      value: stats?.pendingMaterials ?? 0,
      subtitle: "Uploads awaiting review",
      icon: IoHourglassOutline,
      color: "rose",
    },
  ];

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Admin Dashboard"
        description="Overview of user activity, pending reviews, and the current state of the UniLibrary platform."
        actions={[
          <Link
            key="users"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
            to="/admin/approvals"
          >
            Review Pending Users
          </Link>,
          <Link
            key="materials"
            className="inline-flex items-center gap-2 rounded-full bg-campus-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-campus-700"
            to="/admin/approvals"
          >
            Review Pending Materials
          </Link>,
        ]}
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {loadingStats ? (
          <div className="col-span-full flex justify-center rounded-[1.75rem] border border-slate-200 bg-white px-6 py-10 shadow-sm">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          statCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              color={card.color}
            />
          ))
        )}
      </section>

      <section className="mt-8">
        <AdminSectionCard>
          <div className="border-b border-slate-200 px-6 py-5">
            <p className="text-sm font-semibold text-slate-900">Recent registrations</p>
            <p className="mt-1 text-xs text-slate-400">
              Latest five users who created accounts on the platform
            </p>
          </div>
          <div className="p-6">
            <RecentRegistrationsTable users={recentUsers} loading={loadingUsers} />
          </div>
        </AdminSectionCard>
      </section>
    </div>
  );
}
