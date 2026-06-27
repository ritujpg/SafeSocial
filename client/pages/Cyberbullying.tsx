import { useEffect, useState } from 'react';
import { Search, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ITEMS_PER_PAGE = 10;

export default function Cyberbullying() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/cyberbullying")
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
      })
      .catch((err) => console.error(err));
  }, []);

  let filtered = cases.filter(
    case_ => case_.targetUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
             case_.message.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getSeverityColor = (severity: string) => {
    if (severity === 'severe') return 'bg-red-100 text-red-700';
    if (severity === 'moderate') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cyberbullying Detection</h1>
        <p className="mt-2 text-muted-foreground">Monitor and respond to harassment cases</p>
      </div>

    {/* Search */}
    <div className="rounded-lg border border-border bg-white p-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by username or message..."
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

      {/* Cases Table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-foreground">Case ID</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Target</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Message Preview</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Severity</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Date</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((case_) => (
                <tr key={case_.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{case_.id}</td>
                  <td className="px-6 py-4 text-foreground">{case_.targetUsername}</td>
                  <td className="px-6 py-4 text-foreground truncate max-w-xs">{case_.message}</td>
                  <td className="px-6 py-4">
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', getSeverityColor(case_.severity))}>
                      {case_.severity.charAt(0).toUpperCase() + case_.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(case_.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" onClick={() => setSelectedCase(case_)}>
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

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-96 w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedCase.id}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Target: {selectedCase.targetUsername}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium text-foreground">Message</p>
                <p className="mt-2 rounded-lg bg-muted p-3 text-sm text-foreground italic">"{selectedCase.message}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Severity</p>
                  <span className={cn('mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium', getSeverityColor(selectedCase.severity))}>
                    {selectedCase.severity.charAt(0).toUpperCase() + selectedCase.severity.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Date</p>
                  <p className="mt-1 text-sm text-muted-foreground">{new Date(selectedCase.timestamp).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Detected Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.keywords.map((keyword, i) => (
                    <span key={i} className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-border pt-4">
              <Button className="flex-1">Take Action</Button>
              <Button variant="outline" className="flex-1" onClick={() => setSelectedCase(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
