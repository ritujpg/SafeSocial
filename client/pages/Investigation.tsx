import { useState } from 'react';
import { Search, X, AlertCircle, TrendingUp, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockInvestigationCases, mockAlerts } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function Investigation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState(mockInvestigationCases[0]);
  const [newNote, setNewNote] = useState('');

  const filteredCases = mockInvestigationCases.filter(
    case_ => case_.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
             case_.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
             case_.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const relatedAlerts = selectedCase ? mockAlerts.filter(a => selectedCase.relatedAlerts.includes(a.id)) : [];

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-50';
    if (score >= 70) return 'text-orange-600 bg-orange-50';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Investigation Panel</h1>
        <p className="mt-2 text-muted-foreground">Comprehensive digital investigation workspace</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Case List */}
        <div className="lg:col-span-1 rounded-lg border border-border bg-white">
          <div className="border-b border-border p-6">
            <h2 className="text-lg font-semibold text-foreground">Investigation Cases</h2>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredCases.map((case_) => (
              <button
                key={case_.id}
                onClick={() => setSelectedCase(case_)}
                className={cn(
                  'w-full border-b border-border p-4 text-left transition-colors hover:bg-muted',
                  selectedCase?.id === case_.id && 'bg-primary/10 border-l-4 border-l-primary'
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{case_.username}</p>
                    <p className="text-xs text-muted-foreground">{case_.id}</p>
                  </div>
                  <div className={cn('rounded-full px-2 py-1 text-xs font-medium', getRiskColor(case_.riskScore))}>
                    {case_.riskScore}%
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {case_.incidents.length} incidents • {case_.status}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Case Details */}
        {selectedCase && (
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Summary */}
            <div className="rounded-lg border border-border bg-white p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{selectedCase.username}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{selectedCase.userId}</p>
                </div>
                <div className={cn('rounded-lg p-4 text-center', getRiskColor(selectedCase.riskScore))}>
                  <p className="text-xs font-medium mb-1">Risk Score</p>
                  <p className="text-3xl font-bold">{selectedCase.riskScore}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="border-l-4 border-l-primary pl-4">
                  <p className="text-xs text-muted-foreground">Case ID</p>
                  <p className="text-sm font-medium text-foreground mt-1">{selectedCase.id}</p>
                </div>
                <div className="border-l-4 border-l-secondary pl-4">
                  <p className="text-xs text-muted-foreground">Started</p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {selectedCase.startDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="border-l-4 border-l-amber-500 pl-4">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium text-foreground mt-1 capitalize">{selectedCase.status}</p>
                </div>
              </div>
            </div>

            {/* Incident Timeline */}
            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Incident Timeline</h3>
              <div className="space-y-4">
                {selectedCase.incidents.map((incident, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="relative flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary mt-2" />
                      {idx < selectedCase.incidents.length - 1 && (
                        <div className="absolute top-6 h-12 w-0.5 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium text-foreground">{incident.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {incident.timestamp.toLocaleDateString()} {incident.timestamp.toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">{incident.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Alerts */}
            {relatedAlerts.length > 0 && (
              <div className="rounded-lg border border-border bg-white p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Related Alerts</h3>
                <div className="space-y-3">
                  {relatedAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                      <AlertCircle className={cn(
                        'h-5 w-5 flex-shrink-0 mt-0.5',
                        alert.riskLevel === 'critical' && 'text-red-500',
                        alert.riskLevel === 'high' && 'text-orange-500',
                        alert.riskLevel === 'medium' && 'text-yellow-500',
                        alert.riskLevel === 'low' && 'text-green-500'
                      )} />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground">{alert.id}</p>
                            <p className="text-xs text-muted-foreground capitalize mt-1">{alert.type.replace(/_/g, ' ')}</p>
                          </div>
                          <span className={cn(
                            'rounded-full px-2 py-1 text-xs font-medium',
                            alert.riskLevel === 'critical' && 'bg-red-100 text-red-700',
                            alert.riskLevel === 'high' && 'bg-orange-100 text-orange-700',
                            alert.riskLevel === 'medium' && 'bg-yellow-100 text-yellow-700',
                            alert.riskLevel === 'low' && 'bg-green-100 text-green-700'
                          )}>
                            {alert.riskLevel.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{alert.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Investigation Notes */}
            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Investigation Notes</h3>
              <div className="space-y-3 mb-4">
                {selectedCase.notes.map((note, idx) => (
                  <div key={idx} className="rounded-lg bg-muted p-3">
                    <p className="text-sm text-foreground">{note}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add a new investigation note..."
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  rows={3}
                />
                <Button
                  onClick={() => {
                    if (newNote.trim()) {
                      selectedCase.notes.push(newNote);
                      setNewNote('');
                    }
                  }}
                  className="w-full"
                >
                  Add Note
                </Button>
              </div>
            </div>

            {/* Suspicious Behavior Indicators */}
            <div className="rounded-lg border border-border bg-white p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Suspicious Indicators</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <p className="font-medium text-red-900">Critical</p>
                  </div>
                  <p className="text-sm text-red-700">{selectedCase.incidents.filter(i => ['Threat', 'Fraud Attempt'].includes(i.type)).length} critical incidents</p>
                </div>
                <div className="rounded-lg bg-amber-50 p-4 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <p className="font-medium text-amber-900">Network</p>
                  </div>
                  <p className="text-sm text-amber-700">Connected to coordinated activity</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button className="flex-1">Escalate Case</Button>
              <Button variant="outline" className="flex-1">Export Report</Button>
              <Button variant="outline" className="flex-1">Close Investigation</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
