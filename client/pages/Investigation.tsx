import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Calendar,
  Shield,
  FileText,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Investigation() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const [investigations, setInvestigations] = useState<any[]>([]);

  const [selectedCase, setSelectedCase] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/investigations?userId=${user?.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInvestigations(data.investigations);

          // Don't auto-open any investigation
          setSelectedCase(null);
        }
      })
      .catch(console.error);
  }, []);

  const filteredCases = useMemo(() => {
    return investigations.filter((item) => {
      return (
        (item.id || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||

        (item.source_module || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||

        (item.target_username || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||

        (item.status || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    });
  }, [investigations, searchQuery]);

  const totalReports = investigations.length;

  const underReview = investigations.filter(
    (i) => i.status === "UNDER_REVIEW"
  ).length;

  const actionTaken = investigations.filter(
    (i) => i.status === "ACTION_TAKEN"
  ).length;

  const closedReports = investigations.filter(
    (i) =>
      i.status === "CLOSED" ||
      i.status === "REJECTED"
  ).length;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Submitted";

      case "UNDER_REVIEW":
        return "Under Review";

      case "ACTION_TAKEN":
        return "Action Taken";

      case "CLOSED":
        return "Closed";

      case "REJECTED":
        return "Rejected";

      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-700";

      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-700";

      case "ACTION_TAKEN":
        return "bg-green-100 text-green-700";

      case "CLOSED":
        return "bg-gray-100 text-gray-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8 p-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-foreground">
          My Investigations
        </h1>

        <p className="mt-2 text-muted-foreground">
          Track every report you've submitted and monitor its progress.
        </p>

      </div>

      <div className="rounded-xl border border-border bg-white p-6">

        <div className="relative">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Investigation ID, username or report type..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />

        </div>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border bg-white p-6">

          <p className="text-sm text-muted-foreground">
            Total Reports
          </p>

          <p className="mt-3 text-4xl font-bold">
            {totalReports}
          </p>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <p className="text-sm text-muted-foreground">
            Under Review
          </p>

          <p className="mt-3 text-4xl font-bold text-yellow-600">
            {underReview}
          </p>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <p className="text-sm text-muted-foreground">
            Action Taken
          </p>

          <p className="mt-3 text-4xl font-bold text-green-600">
            {actionTaken}
          </p>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <p className="text-sm text-muted-foreground">
            Closed / Rejected
          </p>

          <p className="mt-3 text-4xl font-bold text-blue-600">
            {closedReports}
          </p>

        </div>

      </div>

      <div className="grid gap-6 lg:grid-cols-2">

              {filteredCases.map((item) => (

          <div
            key={item.id}
            className="rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold">
                  Investigation #{item.id.slice(0,8)}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Submitted on{" "}
                  {item.opened_at
                    ? new Date(item.opened_at).toLocaleDateString()
                    : "-"}
                </p>

              </div>

              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  getStatusColor(item.status)
                )}
              >
                {getStatusLabel(item.status)}
              </span>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div className="flex items-start gap-3">

                <Shield className="mt-1 h-5 w-5 text-primary" />

                <div>

                  <p className="text-xs text-muted-foreground">
                    Report Type
                  </p>

                  <p className="font-medium">
                    {item.source_module}
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <Calendar className="mt-1 h-5 w-5 text-primary" />

                <div>

                  <p className="text-xs text-muted-foreground">
                    Reported User
                  </p>

                  <p className="font-medium">
                    @{item.target_username}
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <FileText className="mt-1 h-5 w-5 text-primary" />

                <div>

                  <p className="text-xs text-muted-foreground">
                    Evidence Submitted
                  </p>

                  <p className="font-medium">
                    {item.evidence || "No evidence provided"}
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-3">

                <Eye className="mt-1 h-5 w-5 text-primary" />

                <div>

                  <p className="text-xs text-muted-foreground">
                    Latest Update
                  </p>

                  <p className="font-medium">
                    {item.findings || "Awaiting review by SafeSocial"}
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-6 flex justify-end">

              <Button
                onClick={() => setSelectedCase(item)}
              >
                View Details
              </Button>

            </div>

          </div>

        ))}

        {filteredCases.length === 0 && (

          <div className="rounded-xl border bg-white p-12 text-center">

            <h2 className="text-xl font-semibold">
              No Investigations Found
            </h2>

            <p className="mt-2 text-muted-foreground">
              Reports you submit from Alerts,
              Cyberbullying or Fake Accounts
              will appear here.
            </p>

          </div>

        )}

      </div>

      {selectedCase && (        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-8">

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  Investigation #{selectedCase.id.slice(0,8)}
                </h2>

                <p className="mt-1 text-muted-foreground">
                  Submitted on{" "}
                  {selectedCase.opened_at
                    ? new Date(
                        selectedCase.opened_at
                      ).toLocaleDateString()
                    : "-"}
                </p>

              </div>

              <button
                onClick={() => setSelectedCase(null)}
                className="rounded-lg p-2 transition hover:bg-muted"
              >
                ✕
              </button>

            </div>

            <div className="mt-8 grid gap-5 md:grid-cols-2">

              <div className="rounded-xl border p-5">

                <p className="text-xs text-muted-foreground">
                  Report Type
                </p>

                <p className="mt-2 font-semibold">
                  {selectedCase.source_module}
                </p>

              </div>

              <div className="rounded-xl border p-5">

                <p className="text-xs text-muted-foreground">
                  Reported User
                </p>

                <p className="mt-2 font-semibold">
                  @{selectedCase.target_username}
                </p>

              </div>

              <div className="rounded-xl border p-5">

                <p className="text-xs text-muted-foreground">
                  Current Status
                </p>

                <span
                  className={cn(
                    "mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                    getStatusColor(selectedCase.status)
                  )}
                >
                  {getStatusLabel(selectedCase.status)}
                </span>

              </div>

              <div className="rounded-xl border p-5">

                <p className="text-xs text-muted-foreground">
                  Evidence Submitted
                </p>

                <p className="mt-2">
                  {selectedCase.evidence ||
                    "No evidence uploaded"}
                </p>

              </div>

            </div>

            <div className="mt-8 rounded-xl border p-6">

              <h3 className="text-lg font-semibold">
                Latest Update
              </h3>

              <p className="mt-3 text-muted-foreground">
                {selectedCase.findings ||
                  "Our moderation team is currently reviewing your report. You'll receive another update once a decision has been made."}
              </p>

            </div>

            <div className="mt-8 rounded-xl border p-6">

              <h3 className="text-lg font-semibold mb-6">
                Investigation Timeline
              </h3>

              <div className="space-y-6">

                <div className="flex items-center gap-4">

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white">
                    ✓
                  </div>

                  <div>

                    <p className="font-medium">
                      Report Submitted
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Your report has been received successfully.
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-white",
                      selectedCase.status === "OPEN"
                        ? "bg-gray-400"
                        : "bg-green-600"
                    )}
                  >
                    ✓
                  </div>

                  <div>

                    <p className="font-medium">
                      AI Analysis
                    </p>

                    <p className="text-sm text-muted-foreground">
                      SafeSocial AI analyzed your report.
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-white",
                      selectedCase.status === "UNDER_REVIEW" ||
                      selectedCase.status === "ACTION_TAKEN" ||
                      selectedCase.status === "CLOSED"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    )}
                  >
                    !
                  </div>

                  <div>

                    <p className="font-medium">
                      Under Review
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Our moderation team is reviewing your report.
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full text-white",
                      selectedCase.status === "ACTION_TAKEN" ||
                      selectedCase.status === "CLOSED"
                        ? "bg-green-600"
                        : "bg-gray-400"
                    )}
                  >
                    ✓
                  </div>

                  <div>

                    <p className="font-medium">
                      Final Decision
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {selectedCase.status === "ACTION_TAKEN"
                        ? "Appropriate action has been taken."
                        : selectedCase.status === "CLOSED"
                        ? "Investigation completed."
                        : selectedCase.status === "REJECTED"
                        ? "Report rejected due to insufficient evidence."
                        : "Pending"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

            <div className="mt-8 flex gap-3">

              <Button className="flex-1">
                Upload More Evidence
              </Button>

              <Button
                variant="outline"
                className="flex-1"
              >
                Download Report
              </Button>

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedCase(null)
                }
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