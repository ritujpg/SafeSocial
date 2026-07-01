import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Users,
  AlertCircle,
  AlertTriangle,
  Image,
  TrendingUp,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";


const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: any) => (
  <div className="h-full rounded-xl border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-md">
    <div className="flex items-center justify-between gap-6">

      <div className="flex-1">

        <p className="text-sm font-medium text-muted-foreground">
          {label}
        </p>

        <p className="mt-4 text-4xl font-bold text-foreground">
          {value}
        </p>

      </div>

      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-xl",
          color
        )}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>

    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({

    totalUsers: 0,

    fakeAccounts: 0,

    cyberbullyingCases: 0,

    threatCases: 0,

    imageMisuseCases: 0,

    highRiskUsers: 0,

  });

  const [activityTrend, setActivityTrend] =
    useState<any[]>([]);

  useEffect(() => {

    fetch(`/api/dashboard/stats?userId=${user?.id}`)

      .then((res) => res.json())

      .then((data) => {

        if (!data.success) return;

        setStats(data.stats);

        setActivityTrend(
          data.activityTrend || []
        );

        console.log(
          "Dashboard:",
          data
        );

      })

      .catch(console.error);

  }, []);

  return (<div className="space-y-6 p-8">

  {/* Header */}

  <div>

    <h1 className="text-3xl font-bold text-foreground">
      Dashboard
    </h1>

    <p className="mt-2 text-muted-foreground">
      Monitor and analyze AI detected suspicious activities.
    </p>

  </div>

  {/* Summary Cards */}

  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

    <Link to="/users">
      <StatCard
        label="Reports Submitted"
        value={stats.totalUsers}
        icon={Users}
        color="bg-blue-500"
      />
    </Link>

    <Link to="/fake-accounts">
      <StatCard
        label="Fake Accounts"
        value={stats.fakeAccounts}
        icon={AlertCircle}
        color="bg-amber-500"
      />
    </Link>

    <Link to="/cyberbullying">
      <StatCard
        label="Cyberbullying Cases"
        value={stats.cyberbullyingCases}
        icon={AlertCircle}
        color="bg-orange-500"
      />
    </Link>

    <Link to="/threats">
      <StatCard
        label="Threat Cases"
        value={stats.threatCases}
        icon={AlertTriangle}
        color="bg-red-500"
      />
    </Link>

    <Link to="/image-misuse">
      <StatCard
        label="Image Misuse"
        value={stats.imageMisuseCases}
        icon={Image}
        color="bg-teal-500"
      />
    </Link>

    <Link to="/investigation">
      <StatCard
        label="High Risk Cases"
        value={stats.highRiskUsers}
        icon={TrendingUp}
        color="bg-purple-500"
      />
    </Link>

  </div>

  {/* AI Detection Trends */}

  <div className="rounded-xl border border-border bg-white p-6">

    <h2 className="mb-6 text-xl font-semibold text-foreground">
      AI Detection Trends
    </h2>

    <ResponsiveContainer
      width="100%"
      height={380}
    >

      <LineChart
        data={activityTrend}
      >

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="month"
        />

        <YAxis />

        <Tooltip />

        <Legend />

        <Line
          type="monotone"
          dataKey="reports"
          name="Reports"
          stroke="#4A90E2"
          strokeWidth={3}
        />

        <Line
          type="monotone"
          dataKey="cyberbullying"
          name="Cyberbullying"
          stroke="#14B8A6"
          strokeWidth={3}
        />

        <Line
          type="monotone"
          dataKey="threats"
          name="Threats"
          stroke="#EF4444"
          strokeWidth={3}
        />

        <Line
          type="monotone"
          dataKey="fakeAccounts"
          name="Fake Accounts"
          stroke="#F59E0B"
          strokeWidth={3}
        />

      </LineChart>

    </ResponsiveContainer>

  </div>
  </div>

);
}
