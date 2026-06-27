import { useState, useEffect } from 'react';
import { Search, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 15;

export default function ActivityLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
useEffect(() => {
  fetch("/api/activity-logs")
    .then((res) => res.json())
    .then((data) => {
      setLogs(data.logs || []);
    });
}, []);
  let filtered = logs.filter((log) =>
  (log.action || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
  (log.details || "").toLowerCase().includes(searchQuery.toLowerCase())
);
  

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    if (status === 'success') return 'bg-green-100 text-green-700';
    if (status === 'warning') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
        <p className="mt-2 text-muted-foreground">Monitor all platform activities and user actions</p>
      </div>

      {/* Controls */}
      <div className="rounded-lg border border-border bg-white p-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by username, user ID, or activity..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

      </div>

      {/* Logs Table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-foreground">User ID</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Username</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Activity</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Timestamp</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((log) => (
                <tr key={log.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 text-muted-foreground text-xs">SYSTEM</td>
                  <td className="px-6 py-4 font-medium text-foreground">SafeSocial</td>
                  <td className="px-6 py-4 text-foreground">{log.activity}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(log.timestamp).toLocaleDateString()}{" "}
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-700">
                      Success
                    </span>
                  </td>
                  </tr>
              ))}
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
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const pageNum = currentPage - 2 + i;
                if (pageNum < 1 || pageNum > totalPages) return null;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
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
    </div>
  );
}
