import { useState } from 'react';
import { Search, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockImageMisuseCases } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function ImageMisuse() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const filtered = mockImageMisuseCases.filter(
    case_ => case_.originalUploader.toLowerCase().includes(searchQuery.toLowerCase()) ||
             case_.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    if (risk === 'high') return 'bg-red-100 text-red-700';
    if (risk === 'medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Image Misuse Detection</h1>
        <p className="mt-2 text-muted-foreground">Track and investigate unauthorized image usage</p>
      </div>

      {/* Search */}
      <div className="rounded-lg border border-border bg-white p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by uploader or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {filtered.map((case_) => (
          <div
            key={case_.id}
            className="rounded-lg border border-border bg-white p-6 cursor-pointer transition-all hover:shadow-md hover:border-primary"
            onClick={() => setSelectedCase(case_)}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <ImageIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{case_.id}</h3>
                  <p className="text-xs text-muted-foreground mt-1">by {case_.originalUploader}</p>
                </div>
              </div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-medium', getRiskColor(case_.riskLevel))}>
                {case_.riskLevel.toUpperCase()}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-foreground">{case_.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm border-t border-border pt-3">
                <div>
                  <p className="text-muted-foreground">Images Detected</p>
                  <p className="font-semibold text-foreground">{case_.imageCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Misusing Users</p>
                  <p className="font-semibold text-foreground">{case_.misusingUsers.length}</p>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4" variant="outline" size="sm">
              View Details
            </Button>
          </div>
        ))}
      </div>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-96 w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedCase.id}</h2>
                <p className="mt-1 text-sm text-muted-foreground">Original: {selectedCase.originalUploader}</p>
              </div>
              <button onClick={() => setSelectedCase(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Case Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <span className={cn('mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium', getRiskColor(selectedCase.riskLevel))}>
                      {selectedCase.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium text-foreground mt-1 capitalize">{selectedCase.status}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Description</p>
                <p className="text-sm text-foreground bg-muted rounded p-3">{selectedCase.description}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Statistics</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Total Images</p>
                    <p className="text-2xl font-bold text-primary mt-1">{selectedCase.imageCount}</p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground">Misusing Accounts</p>
                    <p className="text-2xl font-bold text-orange-600 mt-1">{selectedCase.misusingUsers.length}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Misusing Users</p>
                <div className="space-y-2">
                  {selectedCase.misusingUsers.map((user: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-muted p-2 text-sm text-foreground">
                      <div className="h-2 w-2 rounded-full bg-orange-500" />
                      {user}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Detected</p>
                <p className="text-xs text-muted-foreground">
                  {selectedCase.timestamp.toLocaleDateString()} at {selectedCase.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-border pt-4">
              <Button className="flex-1">Take Action</Button>
              <Button variant="outline" className="flex-1">Export Report</Button>
              <Button variant="outline" className="flex-1" onClick={() => setSelectedCase(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
