import { useEffect, useState } from "react";
import { Search, X, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FakeAccount {

  id: string;

  reported_user: string;

  title: string;

  message: string;

  description: string;

  anomaly_score: number;

  suspicion_reason: string;

  severity: string;

  status: string;

  detected_at: string;

}

export default function FakeAccounts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccount, setSelectedAccount] =
    useState<FakeAccount | null>(null);
  const [accounts, setAccounts] =
    useState<FakeAccount[]>([]);

  useEffect(() => {
  fetch("/api/fake-accounts")
    .then((res) => res.json())
    .then((data) => {
      setAccounts(data);
    })
    .catch((err) => console.error(err));
}, []);

 const filtered = accounts.filter((acc) => {

  const search = searchQuery.toLowerCase();

  return (

    (acc.reported_user || "")
      .toLowerCase()
      .includes(search) ||

    (acc.title || "")
      .toLowerCase()
      .includes(search) ||

    (acc.message || "")
      .toLowerCase()
      .includes(search) ||

    (acc.description || "")
      .toLowerCase()
      .includes(search)

  );

});

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Fake Account Detection</h1>
        <p className="mt-2 text-muted-foreground">Identify and analyze suspicious accounts</p>
      </div>

      {/* Search */}
      <div className="rounded-lg border border-border bg-white p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((account) => (
          <div
            key={account.id}
            className="rounded-lg border border-border bg-white p-6 cursor-pointer transition-all hover:shadow-md hover:border-primary"
            onClick={() => setSelectedAccount(account)}
          >
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  {account.reported_user}
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  {account.title}
                </p>

              </div>
              <div className="rounded-lg bg-red-100 px-3 py-1 text-right">
                <p className="text-xs font-medium text-red-700">Risk</p>
                <p className="text-lg font-bold text-red-700">
                  {account.anomaly_score}%
              </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Suspicious Indicators</p>
                <div className="flex flex-wrap gap-1">
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                    {account.suspicion_reason}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <p className="text-sm font-medium text-foreground capitalize">{account.status}</p>
              </div>
            </div>

            <Button className="w-full mt-4" variant="outline" size="sm">
              View Details
            </Button>
          </div>
        ))}
      </div>

      {/* Account Details Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-96 w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedAccount.reported_user}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selectedAccount.title}</p>
              </div>
              <button
                onClick={() => setSelectedAccount(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6 border-t border-border pt-4">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Risk Score</p>
                <div className="flex items-center gap-4">
                  <div className="h-32 w-32 rounded-full bg-red-100 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-600">
                        {selectedAccount.anomaly_score}%
                      </p>
                      <p className="text-xs text-red-600 mt-1">
                        {selectedAccount.severity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">Account Information</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {selectedAccount.detected_at
                        ? new Date(selectedAccount.detected_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="text-sm font-medium text-foreground mt-1 capitalize">
                      {selectedAccount.status}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm">

                <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />

                <span className="text-foreground">
                  {selectedAccount.suspicion_reason}
                </span>

              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-border pt-4">
              <Button className="flex-1">Suspend Account</Button>
              <Button variant="outline" className="flex-1">Export Report</Button>
              <Button variant="outline" className="flex-1" onClick={() => setSelectedAccount(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
