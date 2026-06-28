import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Users, AlertCircle, AlertTriangle, Image, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const StatCard = ({ label, value, icon: Icon, color, onClick }: any) => (
  <button
    onClick={onClick}
    className="h-full rounded-xl border border-border bg-white p-6 text-left transition-all hover:border-primary hover:shadow-md"
  >
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
          "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl",
          color
        )}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>

    </div>
  </button>
);

const colors = ['#4A90E2', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Dashboard() {

  const [stats, setStats] = useState({
    totalUsers: 0,
    fakeAccounts: 0,
    cyberbullyingCases: 0,
    threatCases: 0,
    imageMisuseCases: 0,
    highRiskUsers: 0,
  });

  const [activityTrend, setActivityTrend] = useState<any[]>([]);

  const [alertDistribution, setAlertDistribution] =
    useState<any[]>([]);


  useEffect(() => {

    fetch("/api/dashboard/stats")

      .then((res) => res.json())

      .then((data) => {

        if (!data.success) return;

        setStats(data.stats);

        setActivityTrend(
          data.activityTrend || []
        );

        setAlertDistribution(
          data.alertDistribution || []
        );

        console.log(
          "Dashboard Analytics:",
          data
        );

      })

      .catch(console.error);

  }, []);


  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Monitor and analyze suspicious activities in real-time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

        <Link to="/activity-logs" className="block w-full">
          <StatCard
            label="Total Users Monitored"
            value={stats.totalUsers}
            icon={Users}
            color="bg-blue-500"
          />
        </Link>

        <Link to="/fake-accounts" className="block w-full">
          <StatCard
            label="Fake Accounts Detected"
            value={stats.fakeAccounts}
            icon={AlertCircle}
            color="bg-amber-500"
          />
        </Link>

        <Link to="/cyberbullying" className="block w-full">
          <StatCard
            label="Harassment Cases"
            value={stats.cyberbullyingCases}
            icon={AlertCircle}
            color="bg-orange-500"
          />
        </Link>

        <Link to="/threats" className="block w-full">
          <StatCard
            label="Threat Alerts"
            value={stats.threatCases}
            icon={AlertTriangle}
            color="bg-red-500"
          />
        </Link>

        <Link to="/image-misuse" className="block w-full">
          <StatCard
            label="Image Misuse Cases"
            value={stats.imageMisuseCases}
            icon={Image}
            color="bg-teal-500"
          />
        </Link>

        <Link to="/investigation" className="block w-full">
          <StatCard
            label="High Risk Users"
            value={stats.highRiskUsers}
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </Link>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3">
        {/* Activity Trend */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground">Activity Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityTrend} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="alerts" stroke="#4A90E2" strokeWidth={2} dot={{ fill: '#4A90E2' }} />
              <Line type="monotone" dataKey="cases" stroke="#14B8A6" strokeWidth={2} dot={{ fill: '#14B8A6' }} />
              <Line type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Distribution Pie Chart */}
          <div className="rounded-lg border border-border bg-white p-6 min-w-[420px]">
          <h2 className="text-lg font-semibold text-foreground">Alert Distribution</h2>
          <ResponsiveContainer width="100%" height={340}>
            <PieChart>
              <Pie
                data={alertDistribution}
                cx="38%"
                cy="50%"
                outerRadius={90}
                labelLine={true}
                label={({ type, x, y, textAnchor }) => (
                  <text
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    dominantBaseline="central"
                    fontSize={13}
                    fill="#374151"
                  >
                    {type}
                  </text>
                )}
                dataKey="value"
              >
                {alertDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />

              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/investigation">
            <Button className="w-full" variant="outline">Start Investigation</Button>
          </Link>
          <Link to="/alerts">
            <Button className="w-full" variant="outline">Review Alerts</Button>
          </Link>
          <Link to="/reports">
            <Button className="w-full" variant="outline">Generate Report</Button>
          </Link>
          <Link to="/settings">
            <Button className="w-full" variant="outline">Configure Settings</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
