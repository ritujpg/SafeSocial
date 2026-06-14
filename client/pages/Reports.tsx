import { useState, useEffect } from 'react';
import { Download, BarChart3, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';




const riskAnalysis = [
  { level: 'Low', count: 2340 },
  { level: 'Medium', count: 1567 },
  { level: 'High', count: 892 },
  { level: 'Critical', count: 156 },
];



export default function Reports() {
  const [dateRange, setDateRange] = useState('month');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Threat');
  const [description, setDescription] = useState('');

  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  const [analytics, setAnalytics] = useState({
  fakeAccounts: 0,
  cyberbullying: 0,
  threats: 0,
  pending: 0,
  investigating: 0,
  resolved: 0,
});


  const [stats, setStats] = useState({
  totalReports: 0,
  pendingReports: 0,
  investigatingReports: 0,
  resolvedReports: 0,
});
const [riskLevels, setRiskLevels] = useState({
  low: 0,
  medium: 0,
  high: 0,
  critical: 0,
});
const alertStats = [
  {
    type: "Fake Accounts",
    count: analytics.fakeAccounts,
  },
  {
    type: "Cyberbullying",
    count: analytics.cyberbullying,
  },
  {
    type: "Threats",
    count: analytics.threats,
  },
];

useEffect(() => {
  fetch("/api/reports/monthly")
    .then((res) => res.json())
    .then((data) => {
      setMonthlyData(data.monthlyData);
    });
}, []);

useEffect(() => {
  fetch("/api/dashboard/analytics")
    .then((res) => res.json())
    .then((data) => {
      setAnalytics(data.analytics);
    });
}, []);

useEffect(() => {
  fetch("/api/dashboard/stats")
  .then((res) => res.json())
  .then((data) => {
    setStats(data.stats);
    setRiskLevels(data.riskLevels);
  });
}, []);
useEffect(() => {
  fetch("/api/reports/analytics")
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setAnalytics(data.analytics);
      }
    })
    .catch(console.error);
}, []);
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
          <p className="text-3xl font-bold text-foreground">
  {stats.totalReports}
</p>
          <p className="text-xs text-green-600 mt-2">+12% from last period</p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-orange-100 p-2">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground">Pending Reports</p>
          </div>
          <p className="text-3xl font-bold text-foreground">
  {stats.pendingReports}
</p>
          <p className="text-xs text-green-600 mt-2">+8% from last period</p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-red-100 p-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
            </div>
            <p className="text-sm text-muted-foreground"> Investigating</p>
          </div>
          <p className="text-3xl font-bold text-foreground">
  {stats.investigatingReports}
</p>
          <p className="text-xs text-red-600 mt-2">+5% from last period</p>
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-green-100 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Resolved Reports</p>
          </div>
          <p className="text-3xl font-bold text-foreground">
  {stats.resolvedReports}
</p>
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
            {[
  { level: "Low", count: riskLevels.low },
  { level: "Medium", count: riskLevels.medium },
  { level: "High", count: riskLevels.high },
  { level: "Critical", count: riskLevels.critical },
].map((item) => (
  <div key={item.level}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-sm font-medium text-foreground">
        {item.level}
      </p>
      <p className="text-sm font-semibold text-foreground">
        {item.count}
      </p>
    </div>

    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className="h-full bg-primary rounded-full transition-all"
        style={{
          width: `${
            stats.totalReports > 0
              ? (item.count / stats.totalReports) * 100
              : 0
          }%`,
        }}
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
              <p className="text-2xl font-bold text-primary">
  {analytics.fakeAccounts}
</p>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Cyberbullying Cases</p>
                  <p className="text-xs text-muted-foreground mt-1">Content analysis</p>
                </div>
                <p className="text-2xl font-bold text-orange-600">
  {analytics.cyberbullying}
</p>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Threat Alerts</p>
                  <p className="text-xs text-muted-foreground mt-1">Keyword matching</p>
                </div>
                <p className="text-2xl font-bold text-red-600">
  {analytics.threats}
</p>
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
          <Button
  onClick={() =>
    window.open(
      "http://localhost:8081/api/reports/export/pdf",
      "_blank"
    )
  }
>
  Export as PDF
</Button>
          <Button
  onClick={() => {
    window.open(
      "/api/reports/export/csv",
      "_blank"
    );
  }}
>
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
      {/* Create Report */}
<div className="rounded-lg border border-border bg-white p-6">
  <h2 className="text-lg font-semibold text-foreground mb-4">
    Create Report
  </h2>

  <div className="grid gap-4">
    <input
      type="text"
      placeholder="Report Title"
      className="border rounded-lg p-3"
      id="reportTitle"
    />

    <select
      className="border rounded-lg p-3"
      id="reportType"
    >
      <option value="Threat">Threat</option>
      <option value="Cyberbullying">Cyberbullying</option>
      <option value="Fake Account">Fake Account</option>
      <option value="Image Misuse">Image Misuse</option>
    </select>

    <textarea
      placeholder="Description"
      className="border rounded-lg p-3"
      rows={4}
      id="reportDescription"
    />

    <Button
      onClick={async () => {
        const title = (
          document.getElementById("reportTitle") as HTMLInputElement
        ).value;

        const type = (
          document.getElementById("reportType") as HTMLSelectElement
        ).value;

        const description = (
          document.getElementById("reportDescription") as HTMLTextAreaElement
        ).value;

        const response = await fetch("/api/reports", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            type,
            description,
            reportedBy: "SafeSocial User",
          }),
        });

        const data = await response.json();

        if (data.success) {
          alert("Report submitted successfully!");
        } else {
          alert("Failed to submit report");
        }
      }}
    >
      Submit Report
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
