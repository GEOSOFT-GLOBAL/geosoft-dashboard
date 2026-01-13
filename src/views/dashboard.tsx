import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import { Users, Eye, UserPlus, Activity } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

interface DashboardData {
  overview: {
    totalUsers: number;
    totalVisits: number;
    activeUsers24h: number;
    signups7d: number;
    signups30d: number;
  };
  visitsByApp: { _id: string; count: number }[];
  usersByApp: { _id: string; count: number }[];
  recentSignups: {
    _id: string;
    email: string;
    username: string;
    appSource: string;
    createdAt: string;
  }[];
  dailyVisits: { _id: { date: string; app: string }; count: number }[];
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: React.ElementType;
  subtitle?: string;
}) => (
  <div className="p-6 border rounded-lg bg-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      <Icon className="h-8 w-8 text-muted-foreground" />
    </div>
  </div>
);

const Dashboard = () => {
  const { token } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: res } = await axios.get(
          `${API_BASE}/analytics/admin/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error || "No data available"}</p>
      </div>
    );
  }

  const appColors: Record<string, string> = {
    timetablely: "bg-blue-500",
    docxiq: "bg-green-500",
    linkshyft: "bg-purple-500",
    tickly: "bg-orange-500",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={data.overview.totalUsers}
          icon={Users}
        />
        <StatCard
          title="Total Visits"
          value={data.overview.totalVisits}
          icon={Eye}
        />
        <StatCard
          title="Active Users (24h)"
          value={data.overview.activeUsers24h}
          icon={Activity}
        />
        <StatCard
          title="New Signups (7d)"
          value={data.overview.signups7d}
          icon={UserPlus}
          subtitle={`${data.overview.signups30d} in last 30 days`}
        />
      </div>

      {/* Visits & Users by App */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Visits by App</h2>
          <div className="space-y-3">
            {data.visitsByApp.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      appColors[item._id] || "bg-gray-500"
                    }`}
                  />
                  <span className="capitalize">{item._id}</span>
                </div>
                <span className="font-medium">
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
            {data.visitsByApp.length === 0 && (
              <p className="text-muted-foreground text-sm">No visits yet</p>
            )}
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-4">Users by App</h2>
          <div className="space-y-3">
            {data.usersByApp.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      appColors[item._id] || "bg-gray-500"
                    }`}
                  />
                  <span className="capitalize">{item._id}</span>
                </div>
                <span className="font-medium">
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))}
            {data.usersByApp.length === 0 && (
              <p className="text-muted-foreground text-sm">No users yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Signups */}
      <div className="p-6 border rounded-lg bg-card">
        <h2 className="text-lg font-semibold mb-4">Recent Signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">User</th>
                <th className="text-left py-2 font-medium">Email</th>
                <th className="text-left py-2 font-medium">App</th>
                <th className="text-left py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentSignups.map((user) => (
                <tr key={user._id} className="border-b last:border-0">
                  <td className="py-2">{user.username}</td>
                  <td className="py-2 text-muted-foreground">{user.email}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs text-white ${
                        appColors[user.appSource] || "bg-gray-500"
                      }`}
                    >
                      {user.appSource}
                    </span>
                  </td>
                  <td className="py-2 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {data.recentSignups.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No signups yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
