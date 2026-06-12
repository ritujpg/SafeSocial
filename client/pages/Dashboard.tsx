import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, Users, AlertCircle, AlertTriangle, Image, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboardStats, activityTrend, alertDistribution, mockAlerts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const StatCard = ({ label, value, icon: Icon, color, onClick }: any) => (
  <button
    onClick={onClick}
    className="rounded-lg border border-border bg-white p-6 text-left transition-all hover:shadow-md hover:border-primary"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
      </div>
      <div className={cn('rounded-lg p-2', color)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </button>
);

const colors = ['#4A90E2', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Dashboard() {
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    pendingReports: 0,
    investigatingReports: 0,
    resolvedReports: 0,
  });
  useEffect(() => {
  fetch("/api/dashboard/stats")
    .then((res) => res.json())
    .then((data) => {
      setStats(data.stats);
    })
    .catch((err) => console.error(err));
}, []);

  const recentAlerts = mockAlerts.slice(0, 5);

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Monitor and analyze suspicious activities in real-time</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Link to="/activity-logs">
          <StatCard
            label="Total Users Monitored"
            value={stats.totalReports}
            icon={Users}
            color="bg-blue-500"
          />
        </Link>
        <Link to="/fake-accounts">
          <StatCard
            label="Fake Accounts Detected"
            value={stats.pendingReports}
            icon={AlertCircle}
            color="bg-amber-500"
          />
        </Link>
        <Link to="/cyberbullying">
          <StatCard
            label="Harassment Cases"
            value={stats.investigatingReports}
            icon={AlertCircle}
            color="bg-orange-500"
          />
        </Link>
        <Link to="/threats">
          <StatCard
            label="Threat Alerts"
            value={stats.resolvedReports}
            icon={AlertTriangle}
            color="bg-red-500"
          />
        </Link>
        <Link to="/image-misuse">
          <StatCard
            label="Image Misuse Cases"
            value={0}
            icon={Image}
            color="bg-teal-500"
          />
        </Link>
        <Link to="/investigation">
          <StatCard
            label="High Risk Users"
            value={0}
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
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground">Alert Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={alertDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.type}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {alertDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="rounded-lg border border-border bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Alerts</h2>
          <Link to="/alerts">
            <Button variant="outline" size="sm">View All Alerts</Button>
          </Link>
        </div>
        <div className="overflow-x-auto -mx-6 md:mx-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-medium text-foreground">Alert ID</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">User</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Time</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Risk Level</th>
                <th className="px-4 py-3 text-left font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-4 py-3 font-medium text-primary">{alert.id}</td>
                  <td className="px-4 py-3 text-foreground">{alert.user}</td>
                  <td className="px-4 py-3 text-foreground capitalize">{alert.type.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {alert.timestamp.toLocaleDateString()} {alert.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium',
                      alert.riskLevel === 'critical' && 'bg-red-100 text-red-700',
                      alert.riskLevel === 'high' && 'bg-orange-100 text-orange-700',
                      alert.riskLevel === 'medium' && 'bg-yellow-100 text-yellow-700',
                      alert.riskLevel === 'low' && 'bg-green-100 text-green-700'
                    )}>
                      {alert.riskLevel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'rounded-full px-3 py-1 text-xs font-medium',
                      alert.status === 'open' && 'bg-blue-100 text-blue-700',
                      alert.status === 'investigating' && 'bg-purple-100 text-purple-700',
                      alert.status === 'resolved' && 'bg-green-100 text-green-700'
                    )}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
