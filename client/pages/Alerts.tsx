import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Alerts() {

  const { user } = useAuth();

  const [alerts, setAlerts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const [selectedReport, setSelectedReport] = useState<any>(null);

  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);

  const [actionsTaken, setActionsTaken] = useState<string[]>([]);
  const [approveNotes, setApproveNotes] = useState("");

  const [rejectReason, setRejectReason] = useState("");
  const [rejectComments, setRejectComments] = useState("");

  //---------------------------------------------------
  // Fetch Pending Alerts
  //---------------------------------------------------

  const fetchAlerts = async () => {

    const res = await fetch("/api/alerts");

    const data = await res.json();

    if (data.success) {

      setAlerts(data.alerts);

    }

  };

  useEffect(() => {

    fetchAlerts();

  }, []);

  //---------------------------------------------------
  // Search
  //---------------------------------------------------

  const filteredAlerts = alerts.filter((alert) => {

    const q = search.toLowerCase();

    return (

      alert.title?.toLowerCase().includes(q) ||

      alert.reported_user?.toLowerCase().includes(q) ||

      alert.display_name?.toLowerCase().includes(q) ||

      alert.ai_result?.toLowerCase().includes(q)

    );

  });

  //---------------------------------------------------
  // Approve
  //---------------------------------------------------

  const approveAlert = async () => {

    if (actionsTaken.length === 0) {

      alert("Please select at least one action taken.");

      return;

    }

    if (!approveNotes.trim()) {

      alert("Please enter admin notes.");

      return;

    }

    await fetch(`/api/alerts/${selectedReport.id}/approve`, {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        adminId: user?.id,

        actions: actionsTaken,

        notes: approveNotes,

      }),

    });

    setShowApprove(false);

    setSelectedReport(null);

    setActionsTaken([]);

    setApproveNotes("");

    fetchAlerts();

  };

  //---------------------------------------------------
  // Reject
  //---------------------------------------------------

  const rejectAlert = async () => {

    if (!rejectReason || !rejectComments.trim()) {

      alert("Please fill all fields.");

      return;

    }

    await fetch(`/api/alerts/${selectedReport.id}/reject`, {

      method: "POST",

      headers: {

        "Content-Type": "application/json",

      },

      body: JSON.stringify({

        adminId: user?.id,

        reason: rejectReason,

        comments: rejectComments,

      }),

    });

    setShowReject(false);

    setSelectedReport(null);

    setRejectReason("");

    setRejectComments("");

    fetchAlerts();

  };

  //---------------------------------------------------
  // UI
  //---------------------------------------------------

  return (

    <div className="p-8 space-y-6">

      <div>

        <h1 className="text-3xl font-bold">

          Pending Reports

        </h1>

        <p className="text-muted-foreground">

          Review AI detected reports before they become verified cases.

        </p>

      </div>

      <div className="relative">

        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />

        <input

          className="w-full rounded-lg border pl-10 pr-4 py-2"

          placeholder="Search..."

          value={search}

          onChange={(e) => setSearch(e.target.value)}

        />

      </div>
            <div className="rounded-xl border bg-white overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">Title</th>

              <th className="p-4 text-left">Reported User</th>

              <th className="p-4 text-left">Submitted By</th>

              <th className="p-4 text-left">AI Result</th>

              <th className="p-4 text-left">Confidence</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-center">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredAlerts.length === 0 && (

              <tr>

                <td
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >

                  No Pending Reports

                </td>

              </tr>

            )}

            {filteredAlerts.map((report) => (

              <tr
                key={report.id}
                className="border-t hover:bg-gray-50"
              >

                <td className="p-4">

                  {report.title}

                </td>

                <td className="p-4">

                  {report.reported_user}

                </td>

                <td className="p-4">

                  {report.display_name}

                </td>

                <td className="p-4 font-semibold">

                  {report.ai_result}

                </td>

                <td className="p-4">

                  {report.confidence}%

                </td>

                <td className="p-4">

                  <span className="rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 text-xs">

                    {report.status}

                  </span>

                </td>

                <td className="p-4">

                  <div className="flex gap-2 justify-center">

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedReport(report)}
                    >

                      <Eye className="h-4 w-4 mr-2" />

                      View

                    </Button>

                    <Button
                      size="sm"
                      onClick={() => {

                        setSelectedReport(report);

                        setShowApprove(true);

                      }}
                    >

                      Approve

                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {

                        setSelectedReport(report);

                        setShowReject(true);

                      }}
                    >

                      Reject

                    </Button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
            {/* ===========================
          VIEW REPORT
      =========================== */}

      {selectedReport && !showApprove && !showReject && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-[700px] p-6">

            <h2 className="text-2xl font-bold mb-6">

              Report Details

            </h2>

            <div className="space-y-4">

              <div>

                <p className="text-sm text-gray-500">

                  Title

                </p>

                <p className="font-medium">

                  {selectedReport.title}

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">

                  Reported User

                </p>

                <p>

                  {selectedReport.reported_user}

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">

                  Submitted By

                </p>

                <p>

                  {selectedReport.display_name}

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">

                  AI Prediction

                </p>

                <p className="font-semibold">

                  {selectedReport.ai_result}

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">

                  Confidence

                </p>

                <p>

                  {selectedReport.confidence}%

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">

                  Message

                </p>

                <p>

                  {selectedReport.message || "-"}

                </p>

              </div>

              <div>

                <p className="text-sm text-gray-500">

                  Description

                </p>

                <p>

                  {selectedReport.description || "-"}

                </p>

              </div>

            </div>

            <div className="flex justify-end mt-8">

              <Button
                variant="outline"
                onClick={() => setSelectedReport(null)}
              >

                Close

              </Button>

            </div>

          </div>

        </div>

      )}

      {/* ===========================
          APPROVE MODAL
      =========================== */}

      {showApprove && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-[600px] p-6">

            <h2 className="text-2xl font-bold">

              Approve Report

            </h2>

            <div className="mt-6 grid grid-cols-2 gap-3">

              {[
                "Warning Issued",
                "Content Removed",
                "Temporary Suspension",
                "Permanent Ban",
                "Monitoring Enabled",
                "Escalated",
                "Other",
              ].map((action) => (

                <label
                  key={action}
                  className="flex gap-2"
                >

                  <input
                    type="checkbox"
                    checked={actionsTaken.includes(action)}
                    onChange={(e) => {

                      if (e.target.checked) {

                        setActionsTaken([
                          ...actionsTaken,
                          action,
                        ]);

                      } else {

                        setActionsTaken(
                          actionsTaken.filter(
                            (a) => a !== action
                          )
                        );

                      }

                    }}
                  />

                  {action}

                </label>

              ))}

            </div>

            <textarea

              className="mt-6 w-full border rounded-lg p-3"

              rows={5}

              placeholder="Enter admin notes..."

              value={approveNotes}

              onChange={(e) =>
                setApproveNotes(e.target.value)
              }

            />

            <div className="flex justify-end gap-3 mt-6">

              <Button
                variant="outline"
                onClick={() => {

                  setShowApprove(false);

                  setSelectedReport(null);

                }}
              >

                Cancel

              </Button>

              <Button
                onClick={approveAlert}
              >

                Approve

              </Button>

            </div>

          </div>

        </div>

      )}

      {/* ===========================
          REJECT MODAL
      =========================== */}

      {showReject && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl w-[600px] p-6">

            <h2 className="text-2xl font-bold">

              Reject Report

            </h2>

            <select

              className="mt-6 w-full border rounded-lg p-3"

              value={rejectReason}

              onChange={(e) =>
                setRejectReason(e.target.value)
              }

            >

              <option value="">

                Select Reason

              </option>

              <option>

                False Positive

              </option>

              <option>

                Wrong Category

              </option>

              <option>

                Duplicate Report

              </option>

              <option>

                Insufficient Evidence

              </option>

              <option>

                Spam Report

              </option>

              <option>

                Other

              </option>

            </select>

            <textarea

              className="mt-6 w-full border rounded-lg p-3"

              rows={5}

              placeholder="Explain why the AI prediction was rejected..."

              value={rejectComments}

              onChange={(e) =>
                setRejectComments(e.target.value)
              }

            />

            <div className="flex justify-end gap-3 mt-6">

              <Button
                variant="outline"
                onClick={() => {

                  setShowReject(false);

                  setSelectedReport(null);

                }}
              >

                Cancel

              </Button>

              <Button
                variant="destructive"
                onClick={rejectAlert}
              >

                Reject

              </Button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}