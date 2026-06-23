import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, Search, TrendingUp, Users } from "lucide-react";
import StatCard from "../../components/StatCard.jsx";
import { getAdminStats } from "../../services/api.js";

const C = {
  primary: "#234876",
  dark: "#0d1c30",
  mid: "#173456",
  light: "#adc2dd",
  pale: "#e9eef6",
  grid: "#f1f5f9",
  tick: "#94a3b8",
};

const PIE_COLORS = [C.dark, C.primary, C.light];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      {label ? <p className="mb-1 text-xs font-semibold text-slate-500">{label}</p> : null}
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold text-slate-900">
          {entry.name ? (
            <span className="mr-1.5 font-normal text-slate-500">{entry.name}:</span>
          ) : null}
          {entry.value}
        </p>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="h-10 w-10 rounded-2xl bg-slate-100" />
      <div className="mt-4 h-7 w-20 rounded-xl bg-slate-100" />
      <div className="mt-2 h-4 w-28 rounded-lg bg-slate-100" />
    </div>
  );
}

function ChartSkeleton({ height = 260 }) {
  return (
    <div
      className="animate-pulse rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
      style={{ height }}
    />
  );
}

function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <div className={`rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <p className="text-sm font-semibold text-slate-900">{title}</p>
      {subtitle ? <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p> : null}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function DepartmentBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 60 }}>
        <CartesianGrid vertical={false} stroke={C.grid} />
        <XAxis
          dataKey="department"
          tick={{ fill: C.tick, fontSize: 10 }}
          tickLine={false}
          axisLine={false}
          interval={0}
          angle={-38}
          textAnchor="end"
          height={64}
        />
        <YAxis
          tick={{ fill: C.tick, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: C.pale }} />
        <Bar dataKey="count" name="Materials" fill={C.primary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RolePieChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.06) return null;

    const radian = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;

    return (
      <text
        x={cx + radius * Math.cos(-midAngle * radian)}
        y={cy + radius * Math.sin(-midAngle * radian)}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={11}
        fontWeight={600}
      >
        {`${Math.round(percent * 100)}%`}
      </text>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
      <ResponsiveContainer width={200} height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="role"
            cx="50%"
            cy="50%"
            outerRadius={88}
            labelLine={false}
            label={renderLabel}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="flex flex-col gap-3">
        {data.map((entry, i) => (
          <div key={entry.role} className="flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
            />
            <div>
              <p className="text-sm font-medium text-slate-800">{entry.role}</p>
              <p className="text-xs text-slate-400">
                {entry.count} - {Math.round((entry.count / total) * 100)}%
              </p>
            </div>
          </div>
        ))}
        <p className="mt-1 text-xs text-slate-400">{total} total users</p>
      </div>
    </div>
  );
}

function SearchLineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={C.grid} />
        <XAxis
          dataKey="date"
          tick={{ fill: C.tick, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fill: C.tick, fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: C.pale, strokeWidth: 2 }} />
        <Line
          type="monotone"
          dataKey="count"
          name="Searches"
          stroke={C.primary}
          strokeWidth={2.5}
          dot={{ r: 4, fill: C.primary, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: C.mid, strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "GoLibrary | Analytics";
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    getAdminStats()
      .then(setStats)
      .catch((err) => setError(err.message || "Unable to load analytics data."))
      .finally(() => setLoading(false));
  }, []);

  const statCards = stats
    ? [
      {
        title: "Most Downloaded",
        value: stats.mostDownloaded?.downloads ?? "-",
        subtitle: stats.mostDownloaded?.title,
        icon: Download,
        color: "campus",
      },
      {
        title: "Most Searched",
        value: stats.mostSearched ? `"${stats.mostSearched}"` : "-",
        subtitle: "Top query this week",
        icon: Search,
        color: "violet",
      },
      {
        title: "Searches Today",
        value: stats.searchesToday ?? "-",
        subtitle: "Unique search events",
        icon: TrendingUp,
        color: "emerald",
      },
      {
        title: "Total Users",
        value: stats.usersByRole?.reduce((sum, item) => sum + item.count, 0) ?? "-",
        subtitle: "Across all roles",
        icon: Users,
        color: "amber",
      },
    ]
    : null;

  return (
    <div className="px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Analytics</h1>
        <p className="mt-2 text-sm leading-7 text-slate-500">
          Platform-wide usage metrics, material distribution, and user activity insights.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading || !statCards
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : statCards.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              subtitle={card.subtitle}
              icon={card.icon}
              color={card.color}
            />
          ))}
      </section>

      {error ? (
        <div className="mt-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {loading ? (
          <>
            <ChartSkeleton height={380} />
            <ChartSkeleton height={380} />
          </>
        ) : (
          <>
            <ChartCard
              title="Materials per Department"
              subtitle="Total documents by academic department"
            >
              <DepartmentBarChart data={stats?.materialsByDepartment ?? []} />
            </ChartCard>

            <ChartCard title="Users by Role" subtitle="Breakdown of registered user roles">
              <RolePieChart data={stats?.usersByRole ?? []} />
            </ChartCard>
          </>
        )}
      </section>

      <section className="mt-6">
        {loading ? (
          <ChartSkeleton height={300} />
        ) : (
          <ChartCard
            title="Searches Over Time"
            subtitle="Daily search volume for the past 7 days"
          >
            <SearchLineChart data={stats?.searchesOverTime ?? []} />
          </ChartCard>
        )}
      </section>

      <section className="mt-6 mb-4">
        {loading ? (
          <ChartSkeleton height={340} />
        ) : (
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Top 5 Most Downloaded</p>
            <p className="mt-0.5 text-xs text-slate-400">Ranked by total download count</p>

            <ol className="mt-5 space-y-3">
              {(stats?.topMaterials ?? []).map((item, i) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4 transition hover:border-slate-200"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i === 0
                        ? "bg-campus-900 text-white"
                        : i === 1
                          ? "bg-campus-600 text-white"
                          : i === 2
                            ? "bg-campus-300 text-campus-900"
                            : "bg-slate-200 text-slate-600"
                      }`}
                  >
                    {i + 1}
                  </span>

                  <span className="shrink-0 rounded-full bg-campus-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-campus-700">
                    {item.courseCode || "-"}
                  </span>

                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900">
                    {item.title}
                  </p>

                  <span className="shrink-0 text-sm font-semibold text-slate-900">
                    {item.downloads}
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">downloads</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </div>
  );
}
