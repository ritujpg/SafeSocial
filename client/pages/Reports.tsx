import { useState, useEffect } from "react";
import {
  Search,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");

  const [reports, setReports] = useState<any[]>([]);

  const [selectedReport, setSelectedReport] =
    useState<any>(null);

  const [showNewReport, setShowNewReport] =
    useState(false);

  const [title, setTitle] = useState("");

  const [type, setType] =
    useState("Threat");

  const [reportedUser, setReportedUser] =
    useState("");

  const [description, setDescription] =
    useState("");

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReports(data.reports);
        }
      })
      .catch(console.error);
  }, []);

  const filteredReports = reports.filter((report) => {

    const search = searchQuery.toLowerCase();

    return (
      (report.title || "")
        .toLowerCase()
        .includes(search) ||

      (report.type || "")
        .toLowerCase()
        .includes(search) ||

      (report.status || "")
        .toLowerCase()
        .includes(search)
    );

  });

  const submitted =
    reports.length;

  const underReview =
    reports.filter(
      (r) =>
        r.status === "Pending" ||
        r.status === "Under Review"
    ).length;

  const resolved =
    reports.filter(
      (r) => r.status === "Resolved"
    ).length;

  const rejected =
    reports.filter(
      (r) => r.status === "Rejected"
    ).length;

  return (
    <div className="space-y-8 p-8">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            My Reports
          </h1>

          <p className="mt-2 text-muted-foreground">
            Track all the reports you've submitted.
          </p>

        </div>

        <Button
          onClick={() =>
            setShowNewReport(true)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>

      </div>

      {/* Search */}

      <div className="relative">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(
              e.target.value
            )
          }
          placeholder="Search reports..."
          className="w-full rounded-lg border bg-white py-3 pl-10 pr-4"
        />

      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border bg-white p-6">

          <div className="flex items-center gap-3">

            <FileText className="h-8 w-8 text-blue-600" />

            <div>

              <p className="text-sm text-muted-foreground">
                Submitted
              </p>

              <p className="text-3xl font-bold">
                {submitted}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <div className="flex items-center gap-3">

            <Clock className="h-8 w-8 text-amber-500" />

            <div>

              <p className="text-sm text-muted-foreground">
                Under Review
              </p>

              <p className="text-3xl font-bold">
                {underReview}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-8 w-8 text-green-600" />

            <div>

              <p className="text-sm text-muted-foreground">
                Resolved
              </p>

              <p className="text-3xl font-bold">
                {resolved}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <div className="flex items-center gap-3">

            <XCircle className="h-8 w-8 text-red-600" />

            <div>

              <p className="text-sm text-muted-foreground">
                Rejected
              </p>

              <p className="text-3xl font-bold">
                {rejected}
              </p>

            </div>

          </div>

        </div>

      </div>
            {/* My Reports */}

      <div className="rounded-xl border bg-white">

        <div className="border-b p-6">

          <h2 className="text-xl font-semibold">
            My Reports
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            View the status of all reports you've submitted.
          </p>

        </div>

        <div className="divide-y">

          {filteredReports.length === 0 ? (

            <div className="p-12 text-center text-muted-foreground">

              No reports found.

            </div>

          ) : (

            filteredReports.map((report) => (

              <div
                key={report.id}
                className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
              >

                <div className="space-y-2">

                  <h3 className="text-lg font-semibold">

                    {report.title}

                  </h3>

                  <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">

                    <span>

                      <strong>Category:</strong>{" "}
                      {report.type}

                    </span>

                    <span>

                      <strong>Reported User:</strong>{" "}
                      {report.reported_user || "-"}

                    </span>

                    <span>

                      <strong>Submitted:</strong>{" "}
                      {new Date(
                        report.created_at
                      ).toLocaleDateString()}

                    </span>

                  </div>

                </div>

                <div className="flex items-center gap-4">

                  <span
                    className={`rounded-full px-4 py-1 text-sm font-medium
                      ${
                        report.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : report.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : report.status === "Under Review"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {report.status}
                  </span>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setSelectedReport(report)
                    }
                  >
                    View Details
                  </Button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* View Details Modal */}

      {selectedReport && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">

                Report Details

              </h2>

              <Button
                variant="ghost"
                onClick={() =>
                  setSelectedReport(null)
                }
              >
                Close
              </Button>

            </div>

            <div className="mt-8 space-y-5">

              <div>

                <p className="text-sm text-muted-foreground">
                  Report ID
                </p>

                <p className="font-semibold">

                  {selectedReport.id}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Title
                </p>

                <p className="font-semibold">

                  {selectedReport.title}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Category
                </p>

                <p>

                  {selectedReport.type}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Reported User
                </p>

                <p>

                  {selectedReport.reported_user || "-"}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Description
                </p>

                <p className="whitespace-pre-wrap">

                  {selectedReport.description}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Current Status
                </p>

                <p className="font-medium">

                  {selectedReport.status}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Submitted On
                </p>

                <p>

                  {new Date(
                    selectedReport.created_at
                  ).toLocaleString()}

                </p>

              </div>

            </div>

          </div>

        </div>

      )}
            {/* New Report Modal */}

      {showNewReport && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

          <div className="w-full max-w-2xl rounded-xl bg-white p-8 shadow-xl">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold">
                New Report
              </h2>

              <Button
                variant="ghost"
                onClick={() =>
                  setShowNewReport(false)
                }
              >
                Close
              </Button>

            </div>

            <div className="mt-8 space-y-5">

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Report Title"
                className="w-full rounded-lg border p-3"
              />

              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value)
                }
                className="w-full rounded-lg border p-3"
              >
                <option>Threat</option>
                <option>Cyberbullying</option>
                <option>Fake Account</option>
                <option>Image Misuse</option>
              </select>

              <input
                value={reportedUser}
                onChange={(e) =>
                  setReportedUser(
                    e.target.value
                  )
                }
                placeholder="Reported Username"
                className="w-full rounded-lg border p-3"
              />

              <textarea
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Describe the issue..."
                className="w-full rounded-lg border p-3"
              />

              <div className="flex justify-end gap-3">

                <Button
                  variant="outline"
                  onClick={() =>
                    setShowNewReport(false)
                  }
                >
                  Cancel
                </Button>

                <Button
                  onClick={async () => {

                    const response =
                      await fetch(
                        "/api/reports",
                        {
                          method: "POST",

                          headers: {
                            "Content-Type":
                              "application/json",
                          },

                          body: JSON.stringify({

                            title,

                            type,

                            description,

                            reportedUser,

                            reportedBy:
                              "SafeSocial User",

                          }),

                        }
                      );

                    const data =
                      await response.json();

                    if (data.success) {

                      alert(
                        "Report submitted successfully!"
                      );

                      setShowNewReport(false);

                      setTitle("");

                      setDescription("");

                      setReportedUser("");

                      setType("Threat");

                      fetch("/api/reports")
                        .then((res) =>
                          res.json()
                        )
                        .then((data) => {

                          if (data.success) {

                            setReports(
                              data.reports
                            );

                          }

                        });

                    } else {

                      alert(
                        "Failed to submit report."
                      );

                    }

                  }}
                >
                  Submit Report
                </Button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}