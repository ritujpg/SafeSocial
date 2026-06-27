import { useState, useEffect } from "react";
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

export default function Alerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [alertStatuses, setAlertStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/fake-accounts")
      .then((res) => res.json())
      .then((data) => {
        setAlerts(data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const statuses: Record<string, string> = {};

    alerts.forEach((alert) => {
      statuses[alert.id] = alert.status || "UNDER_REVIEW";
    });

    setAlertStatuses(statuses);
  }, [alerts]);

  // Filter alerts
  let filtered = alerts.filter((alert) =>
    searchQuery === "" ||
    alert.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort alerts
  filtered.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  // Paginate
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedAlerts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const updateAlertStatus = (alertId: string, newStatus: string) => {
    setAlertStatuses(prev => ({
      ...prev,
      [alertId]: newStatus
    }));
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Alerts Management</h1>
        <p className="mt-2 text-muted-foreground">Monitor and manage all security alerts</p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 rounded-lg border border-border bg-white p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by ID, user, or username..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        

        
      </div>

      {/* Alerts Table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-foreground">Alert ID</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">User</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Type</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Timestamp</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Risk Level</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Status</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.length > 0 ? (
                paginatedAlerts.map((alert) => (
                  <tr key={alert.id} className="border-b border-border hover:bg-muted transition-colors">
                    <td className="px-6 py-4 font-medium text-primary cursor-pointer hover:underline" onClick={() => setSelectedAlert(alert)}>
                      {alert.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">
                      {alert.username}
                    </td>
                    <td className="px-6 py-4 text-foreground capitalize">Fake Account</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {new Date(alert.createdAt).toLocaleDateString()}{" "}
                      {new Date(alert.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium',
                        alert.riskScore >= 90 && 'bg-red-100 text-red-700',
                        alert.riskScore >= 70 && 'bg-orange-100 text-orange-700',
                        alert.riskScore >= 40 && 'bg-yellow-100 text-yellow-700',
                        alert.riskScore < 40 && 'bg-green-100 text-green-700'
                      )}>
                        {alert.riskScore >= 90
                          ? "CRITICAL"
                          : alert.riskScore >= 70
                          ? "HIGH"
                          : alert.riskScore >= 40
                          ? "MEDIUM"
                          : "LOW"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedAlert(alert)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No alerts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

     {/* Alert Details Modal */}
     {selectedAlert && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6">

          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {selectedAlert.username}
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                {selectedAlert.email}
              </p>
            </div>

            <button
              onClick={() => setSelectedAlert(null)}
              className="text-muted-foreground hover:text-black"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Risk Score
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {selectedAlert.riskScore}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Severity
              </p>

              <span
                className={cn(
                  "mt-2 inline-block rounded-full px-3 py-1 text-sm font-medium",
                  selectedAlert.riskScore >= 90 &&
                    "bg-red-100 text-red-700",

                  selectedAlert.riskScore >= 70 &&
                    selectedAlert.riskScore < 90 &&
                    "bg-orange-100 text-orange-700",

                  selectedAlert.riskScore >= 40 &&
                    selectedAlert.riskScore < 70 &&
                    "bg-yellow-100 text-yellow-700",

                  selectedAlert.riskScore < 40 &&
                    "bg-green-100 text-green-700"
                )}
              >
                {selectedAlert.riskScore >= 90
                  ? "CRITICAL"
                  : selectedAlert.riskScore >= 70
                  ? "HIGH"
                  : selectedAlert.riskScore >= 40
                  ? "MEDIUM"
                  : "LOW"}
              </span>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Status
              </p>

              <p className="mt-2 font-medium">
                {selectedAlert.status}
              </p>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Detection Time
              </p>

              <p className="mt-2">
                {new Date(selectedAlert.createdAt).toLocaleString()}
              </p>
            </div>

          </div>

          <div className="mt-6">

            <h3 className="mb-3 text-lg font-semibold">
              Suspicious Indicators
            </h3>

            <div className="flex flex-wrap gap-2">
              {selectedAlert.suspiciousIndicators.map(
                (indicator: string, index: number) => (
                  <span
                    key={index}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-700"
                  >
                    {indicator}
                  </span>
                )
              )}
            </div>

          </div>

          <div className="mt-6">

            <h3 className="mb-3 text-lg font-semibold">
              Recent Activities
            </h3>

            <div className="space-y-2">
              {selectedAlert.activities.map(
                (activity: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg bg-muted p-3 text-sm"
                  >
                    {activity}
                  </div>
                )
              )}
            </div>

          </div>

          <div className="mt-6">

            <h3 className="mb-3 text-lg font-semibold">
              IP Addresses
            </h3>

            <div className="space-y-2">
              {selectedAlert.ipAddresses.map(
                (ip: string, index: number) => (
                  <div
                    key={index}
                    className="rounded-lg border p-3 font-mono text-sm"
                  >
                    {ip}
                  </div>
                )
              )}
            </div>

          </div>

          <div className="mt-8 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setSelectedAlert(null)}
            >
              Close
            </Button>
          </div>

        </div>
      </div>
    )}
    </div>
  );
}
