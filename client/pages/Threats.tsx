import { useState } from 'react';
import { Search, X, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockThreatAlerts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

export default function Threats() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedThreat, setSelectedThreat] = useState<any>(null);

  let filtered = mockThreatAlerts.filter(
    threat => threat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
              threat.threatText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterSeverity) {
    filtered = filtered.filter(threat => threat.severity === filterSeverity);
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getSeverityColor = (severity: string) => {
    if (severity === 'critical') return 'bg-red-100 text-red-700';
    if (severity === 'high') return 'bg-orange-100 text-orange-700';
    if (severity === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Threat Detection</h1>
        <p className="mt-2 text-muted-foreground">Monitor and escalate threat alerts</p>
      </div>

      {/* Search and Filter */}
      <div className="rounded-lg border border-border bg-white p-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search threats..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Severity</label>
          <select
            value={filterSeverity || ''}
            onChange={(e) => {
              setFilterSeverity(e.target.value || null);
              setCurrentPage(1);
            }}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Severity Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Threats Table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-foreground">Alert ID</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">User</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Threat Text</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Severity</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Date</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((threat) => (
                <tr key={threat.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{threat.id}</td>
                  <td className="px-6 py-4 text-foreground">{threat.username}</td>
                  <td className="px-6 py-4 text-foreground truncate max-w-xs">{threat.threatText}</td>
                  <td className="px-6 py-4">
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', getSeverityColor(threat.severity))}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {threat.timestamp.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" onClick={() => setSelectedThreat(threat)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Threat Details Modal */}
      {selectedThreat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-96 w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedThreat.id}</h2>
                <p className="mt-1 text-sm text-muted-foreground">User: {selectedThreat.username}</p>
              </div>
              <button onClick={() => setSelectedThreat(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium text-foreground">Threat Text</p>
                <p className="mt-2 rounded-lg bg-red-50 p-3 text-sm text-foreground border border-red-200">
                  "{selectedThreat.threatText}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Severity</p>
                  <span className={cn('mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium', getSeverityColor(selectedThreat.severity))}>
                    {selectedThreat.severity.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Status</p>
                  <p className="mt-1 text-sm text-muted-foreground capitalize">{selectedThreat.status}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Detected Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {selectedThreat.keywords.map((keyword: string, i: number) => (
                    <span key={i} className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {selectedThreat.targetInfo && (
                <div>
                  <p className="text-sm font-medium text-foreground">Target Information</p>
                  <p className="mt-1 rounded-lg bg-orange-50 p-3 text-sm text-foreground border border-orange-200">
                    {selectedThreat.targetInfo}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3 border-t border-border pt-4">
              <Button className="flex-1 bg-red-600 hover:bg-red-700">Escalate to Law Enforcement</Button>
              <Button variant="outline" className="flex-1" onClick={() => setSelectedThreat(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
