import { useState } from 'react';
import { Download, BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', alerts: 245, cases: 123, threats: 45 },
  { month: 'Feb', alerts: 312, cases: 156, threats: 62 },
  { month: 'Mar', alerts: 278, cases: 134, threats: 58 },
  { month: 'Apr', alerts: 389, cases: 201, threats: 81 },
  { month: 'May', alerts: 456, cases: 234, threats: 102 },
  { month: 'Jun', alerts: 512, cases: 267, threats: 124 },
];

const riskAnalysis = [
  { level: 'Low', count: 2340 },
  { level: 'Medium', count: 1567 },
  { level: 'High', count: 892 },
  { level: 'Critical', count: 156 },
];

const alertStats = [
  { type: 'Fake Accounts', count: 1247 },
  { type: 'Cyberbullying', count: 892 },
  { type: 'Threats', count: 345 },
  { type: 'Image Misuse', count: 567 },
];

export default function Reports() {
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="mt-2 text-muted-foreground">Comprehensive platform statistics and trends</p>
      </div>

      {/* Date Range Selector */}
      <div className="rounded-lg border border-border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Report Period</h3>
            <p className="text-sm text-muted-foreground mt-1">Analyze data for specific time ranges</p>
          </div>
          <div className="flex gap-2">
            <Button variant={dateRange === 'week' ? 'default' : 'outline'} onClick={() => setDateRange('week')}>
              Last 7 Days
            </Button>
            <Button variant={dateRange === 'month' ? 'default' : 'outline'} onClick={() => setDateRange('month')}>
              Last Month
            </Button>
            <Button variant={dateRange === 'quarter' ? 'default' : 'outline'} onClick={() => setDateRange('quarter')}>
              Last Quarter
            </Button>
            <Button variant={dateRange === 'year' ? 'default' : 'outline'} onClick={() => setDateRange('year')}>
              Last Year
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Alerts</p>
          </div>
          <p className="text-3xl font-bold text-foreground">5,051</p>
          <p className="text-xs text-green-600 mt-2">+12% from last period</p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-orange-100 p-2">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground">Suspicious Users</p>
          </div>
          <p className="text-3xl font-bold text-foreground">1,247</p>
          <p className="text-xs text-green-600 mt-2">+8% from last period</p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-red-100 p-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-sm text-muted-foreground">Critical Cases</p>
          </div>
          <p className="text-3xl font-bold text-foreground">156</p>
          <p className="text-xs text-red-600 mt-2">+5% from last period</p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-green-100 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Resolution Rate</p>
          </div>
          <p className="text-3xl font-bold text-foreground">87%</p>
          <p className="text-xs text-green-600 mt-2">+3% from last period</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Monthly Trend */}
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Monthly Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="alerts" stroke="#4A90E2" strokeWidth={2} dot={{ fill: '#4A90E2' }} />
              <Line type="monotone" dataKey="cases" stroke="#14B8A6" strokeWidth={2} dot={{ fill: '#14B8A6' }} />
              <Line type="monotone" dataKey="threats" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Types Distribution */}
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Alert Distribution by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={alertStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="type" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#4A90E2" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Level Distribution */}
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Risk Level Distribution</h2>
          <div className="space-y-4">
            {riskAnalysis.map((item) => (
              <div key={item.level}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">{item.level}</p>
                  <p className="text-sm font-semibold text-foreground">{item.count}</p>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(item.count / 2340) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detection Statistics */}
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Detection Statistics</h2>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Fake Accounts Detected</p>
                <p className="text-xs text-muted-foreground mt-1">Automated detection system</p>
              </div>
              <p className="text-2xl font-bold text-primary">1,247</p>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Cyberbullying Cases</p>
                  <p className="text-xs text-muted-foreground mt-1">Content analysis</p>
                </div>
                <p className="text-2xl font-bold text-orange-600">892</p>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Threat Alerts</p>
                  <p className="text-xs text-muted-foreground mt-1">Keyword matching</p>
                </div>
                <p className="text-2xl font-bold text-red-600">345</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Export Report</h2>
        <p className="text-sm text-muted-foreground mb-6">Download comprehensive reports in your preferred format</p>
        <div className="flex gap-3 flex-wrap">
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export as PDF
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export as CSV
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export as Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Email Report
          </Button>
        </div>
      </div>

      {/* Report Schedule */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Automated Reporting</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Weekly Summary Report</p>
              <p className="text-sm text-muted-foreground mt-1">Sent every Monday at 9:00 AM</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-foreground">Monthly Detailed Report</p>
              <p className="text-sm text-muted-foreground mt-1">Sent on the 1st of each month</p>
            </div>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
