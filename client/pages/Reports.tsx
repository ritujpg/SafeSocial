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
import { useAuth } from "@/context/AuthContext";

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = useAuth();

  const [reports, setReports] = useState<any[]>([]);

  const [selectedReport, setSelectedReport] =
    useState<any>(null);

  const [showNewReport, setShowNewReport] =
    useState(false);

  const [title, setTitle] = useState("");

  

  const [reportedUser, setReportedUser] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [profileUrl, setProfileUrl] =
    useState("");

  const [screenshot, setScreenshot] =
    useState<File | null>(null);

  useEffect(() => {

    const url =
      user?.role === "ADMIN"
        ? "/api/reports"
        : `/api/reports?userId=${user?.id}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {

        if (data.success) {

          setReports(data.reports);

        }

      })
      .catch(console.error);

  }, [user]);

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

 const total = reports.length;

const pending = reports.filter(
  (r) => r.status === "PENDING"
).length;

const approved = reports.filter(
  (r) => r.status === "APPROVED"
).length;

const rejected = reports.filter(
  (r) => r.status === "REJECTED"
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

       {user?.role !== "ADMIN" && (

        <Button
          onClick={() =>
            setShowNewReport(true)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          New Report
        </Button>

      )}

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
                Total Reports
              </p>

              <p className="text-3xl font-bold">
                {total}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <div className="flex items-center gap-3">

            <Clock className="h-8 w-8 text-amber-500" />

            <div>

              <p className="text-sm text-muted-foreground">
                Pending
              </p>

              <p className="text-3xl font-bold">
                {pending}
              </p>

            </div>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6">

          <div className="flex items-center gap-3">

            <CheckCircle2 className="h-8 w-8 text-green-600" />

            <div>

              <p className="text-sm text-muted-foreground">
                Approved
              </p>

              <p className="text-3xl font-bold">
                {approved}
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

          <h2>

          {user?.role === "ADMIN"
            ? "All Reports"
            : "My Reports"}

          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            {user?.role === "ADMIN"
              ? "View and manage all reports submitted by users."
              : "View the status of all reports you've submitted."}
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

                      <strong>AI Status:</strong>{" "}

                      {report.ai_status || "Pending Analysis"}

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
                        report.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          :  report.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : report.status === "PENDING"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                  >
                    {report.status}
                  </span>

                  <div className="flex gap-2">

                    <Button
                      variant="outline"
                      onClick={() => setSelectedReport(report)}
                    >
                      View Details
                    </Button>

                    <Button
                      variant="destructive"
                      onClick={async () => {

                        const confirmDelete = window.confirm(
                          "Delete this report?\n\nThis will remove it from your report history. Investigators will still retain a copy."
                        );

                        if (!confirmDelete) return;

                        const response = await fetch(
                          `/api/reports/${report.id}`,
                          {
                            method: "DELETE",
                          }
                        );

                        const data = await response.json();

                        if (data.success) {

                          setReports((prev) =>
                            prev.filter((r) => r.id !== report.id)
                          );

                        } else {

                          alert("Failed to delete report.");

                        }

                      }}
                    >
                      Delete
                    </Button>

                  </div>

                </div>

                </div>

                )))}

                        </div>

                      </div>

              
      {/* View Details Modal */}

      {selectedReport && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-6">

          <div className="mx-auto my-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-8 shadow-xl">

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

            <div className="mt-6 space-y-4">

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
                  AI Status
                </p>

                <p className="font-medium">

                  {selectedReport.ai_status || "Pending Analysis"}

                </p>

              </div>
              
              <div>

                <p className="text-sm text-muted-foreground">
                  AI Result
                </p>

                <p className="font-medium">

                  {selectedReport.ai_result || "Analyzing..."}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Confidence
                </p>

                <p>

                  {selectedReport.confidence
                    ? `${selectedReport.confidence}%`
                    : "-"}

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
                  Profile URL
                </p>

                <p className="break-all">

                  {selectedReport.profile_url || "-"}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Message
                </p>

                <p className="whitespace-pre-wrap">

                  {selectedReport.message || "-"}

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
                  Screenshot
                </p>

                {selectedReport.screenshot_url ? (

                  <img
                    src={selectedReport.screenshot_url}
                    alt="Evidence"
                    className="mt-2 max-h-64 w-full rounded-lg border object-contain"
                  />

                ) : (

                  <p>-</p>

                )}

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

      {showNewReport && user?.role !== "ADMIN" && (

        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-6">

          <div className="mx-auto my-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-8 shadow-xl">

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

            <div className="mt-6 space-y-4">

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Report Title"
                className="w-full rounded-lg border p-3"
              />


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

              <input
                value={profileUrl}
                onChange={(e) =>
                  setProfileUrl(e.target.value)
                }
                placeholder="Profile URL (Optional)"
                className="w-full rounded-lg border p-3"
              />

              <textarea
                rows={4}
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Paste the message/comment (Optional)"
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
                placeholder="Paste the message or describe the issue..."
                className="w-full rounded-lg border p-3"
              />

              <div>

                <label className="mb-2 block text-sm font-medium">

                  Upload Screenshot (Optional)

                </label>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(e) => {

                    if (e.target.files?.length) {

                      setScreenshot(e.target.files[0]);

                    }

                  }}
                  className="w-full rounded-lg border p-3"
                />

              </div>

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

                  // Validate evidence
                  if (!message.trim() && !screenshot) {

                    alert(
                      "Please provide either a message/comment or upload a screenshot."
                    );

                    return;

                  }

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

                          userId: user?.id,

                          title,

                          reportedUser,

                          profileUrl,

                          message,

                          description,

                          reportedBy:
                            user?.fullName,

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

                    setMessage("");

                    setProfileUrl("");

                    setScreenshot(null);

                    fetch(`/api/reports?userId=${user?.id}`)
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