import { useEffect, useState } from "react";
import {
  FolderOpen,
  ShieldCheck,
  Clock,
  CheckCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface Investigation {
  id: string;
  report_id: string;
  user_id: string;
  target_username: string;
  severity: string;
  evidence: string;
  assigned_to: string;
  findings: string;
  status: string;
  opened_at: string;
  closed_at: string;
  request_reason: string;
  priority: string;
  recommendations: string;
  suggested_actions: string[];
  can_assist: boolean;
  final_notes: string;
}

export default function CaseManagement() {
  const [cases, setCases] = useState<Investigation[]>([]);
  const [selectedCase, setSelectedCase] =
    useState<Investigation | null>(null);

  const [assignedTo, setAssignedTo] =
    useState("");

  const [findings, setFindings] =
    useState("");

  const [recommendations, setRecommendations] =
    useState("");

  const [finalNotes, setFinalNotes] =
    useState("");

  const [canAssist, setCanAssist] =
    useState(true);

  const [suggestedActions, setSuggestedActions] =
    useState<string[]>([]);

  const loadCases = async () => {

    try {

      const res = await fetch(
        "/api/investigations"
      );

      const data = await res.json();

      if (data.success) {

        setCases(data.investigations);

      }

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    loadCases();

  }, []);

  const pending =
    cases.filter(
      c => c.status === "PENDING"
    ).length;

  const inProgress =
    cases.filter(
      c => c.status === "IN_PROGRESS"
    ).length;

  const completed =
    cases.filter(
      c => c.status === "COMPLETED"
    ).length;

  return (

    <div className="p-8 space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">

          Case Management

        </h1>

        <p className="mt-2 text-muted-foreground">

          Manage investigation requests submitted by users.

        </p>

      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">

                Pending Cases

              </p>

              <h2 className="mt-3 text-3xl font-bold">

                {pending}

              </h2>

            </div>

            <Clock className="h-10 w-10 text-yellow-500"/>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">

                In Progress

              </p>

              <h2 className="mt-3 text-3xl font-bold">

                {inProgress}

              </h2>

            </div>

            <ShieldCheck className="h-10 w-10 text-blue-500"/>

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">

                Completed

              </p>

              <h2 className="mt-3 text-3xl font-bold">

                {completed}

              </h2>

            </div>

            <CheckCircle className="h-10 w-10 text-green-500"/>

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">

        <table className="w-full">

          <thead className="bg-muted">

            <tr>

              <th className="p-4 text-left">

                Target

              </th>

              <th className="p-4 text-left">

                Priority

              </th>

              <th className="p-4 text-left">

                Severity

              </th>

              <th className="p-4 text-left">

                Status

              </th>

              <th className="p-4 text-left">

                Opened

              </th>

            </tr>

          </thead>

          <tbody>

            {cases.map((c) => (

              <tr

                key={c.id}

                className="border-t cursor-pointer hover:bg-muted/50"

                onClick={() => {

                  setSelectedCase(c);

                  setAssignedTo(
                    c.assigned_to || ""
                  );

                  setFindings(
                    c.findings || ""
                  );

                  setRecommendations(
                    c.recommendations || ""
                  );

                  setFinalNotes(
                    c.final_notes || ""
                  );

                  setCanAssist(
                    c.can_assist ?? true
                  );

                  setSuggestedActions(
                    c.suggested_actions || []
                  );

                }}

              >

                <td className="p-4">

                  {c.target_username}

                </td>

                <td className="p-4">

                  {c.priority}

                </td>

                <td className="p-4">

                  {c.severity}

                </td>

                <td className="p-4">

                  {c.status}

                </td>

                <td className="p-4">

                  {new Date(
                    c.opened_at
                  ).toLocaleString()}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
            {/* Investigation Workspace */}

      {selectedCase && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-8">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-3xl font-bold">

                  Investigation Workspace

                </h2>

                <p className="text-muted-foreground mt-1">

                  Investigation ID

                </p>

                <p className="font-mono text-sm">

                  {selectedCase.id}

                </p>

              </div>

              <Button

                variant="outline"

                onClick={() => setSelectedCase(null)}

              >

                Close

              </Button>

            </div>

            {/* Summary */}

            <div className="grid grid-cols-2 gap-6 mt-8">

              <div>

                <p className="text-sm text-muted-foreground">

                  Target Username

                </p>

                <p className="font-semibold">

                  {selectedCase.target_username}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">

                  Priority

                </p>

                <p className="font-semibold">

                  {selectedCase.priority}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">

                  Severity

                </p>

                <p className="font-semibold">

                  {selectedCase.severity}

                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">

                  Current Status

                </p>

                <p className="font-semibold">

                  {selectedCase.status}

                </p>

              </div>

            </div>

            {/* User Reason */}

            <div className="mt-8">

              <h3 className="font-semibold mb-2">

                User Request

              </h3>

              <div className="rounded-lg border bg-muted/30 p-4">

                {selectedCase.request_reason}

              </div>

            </div>

            {/* Evidence */}

            <div className="mt-8">

              <h3 className="font-semibold mb-2">

                Evidence

              </h3>

              <div className="rounded-lg border bg-muted/30 p-4 whitespace-pre-wrap">

                {selectedCase.evidence || "No evidence available."}

              </div>

            </div>

            {/* Assigned */}

            <div className="mt-8">

              <label className="font-medium">

                Assigned Investigator

              </label>

              <Input

                className="mt-2"

                value={assignedTo}

                onChange={(e) =>

                  setAssignedTo(e.target.value)

                }

                placeholder="Enter investigator name"

              />

            </div>

            {/* Findings */}

            <div className="mt-8">

              <label className="font-medium">

                Investigation Findings

              </label>

              <Textarea

                className="mt-2"

                rows={5}

                value={findings}

                onChange={(e)=>

                  setFindings(e.target.value)

                }

              />

            </div>

            {/* Recommendations */}

            <div className="mt-8">

              <label className="font-medium">

                Recommendations

              </label>

              <Textarea

                className="mt-2"

                rows={4}

                value={recommendations}

                onChange={(e)=>

                  setRecommendations(e.target.value)

                }

              />

            </div>

            {/* Suggested Actions */}

            <div className="mt-8">

              <label className="font-medium">

                Suggested Actions

              </label>

              <div className="grid grid-cols-2 gap-4 mt-4">

                {[
                  "Preserve Evidence",
                  "Contact Platform",
                  "Cyber Crime Cell",
                  "Enable MFA",
                  "Password Reset",
                  "Monitor Account",
                  "Legal Consultation",
                  "Block User",
                ].map((action) => (

                  <label

                    key={action}

                    className="flex items-center gap-3"

                  >

                    <Checkbox

                      checked={suggestedActions.includes(action)}

                      onCheckedChange={(checked) => {

                        if (checked) {

                          setSuggestedActions((prev)=>

                            [...prev, action]

                          );

                        } else {

                          setSuggestedActions((prev)=>

                            prev.filter(a=>a!==action)

                          );

                        }

                      }}

                    />

                    <span>

                      {action}

                    </span>

                  </label>

                ))}

              </div>

            </div>

            {/* Assistance */}

            <div className="mt-8">

              <label className="flex items-center gap-3">

                <Checkbox

                  checked={canAssist}

                  onCheckedChange={(v)=>

                    setCanAssist(Boolean(v))

                  }

                />

                <span>

                  SafeSocial can directly assist the user

                </span>

              </label>

            </div>

            {/* Final Notes */}

            <div className="mt-8">

              <label className="font-medium">

                Final Notes

              </label>

              <Textarea

                rows={5}

                className="mt-2"

                value={finalNotes}

                onChange={(e)=>

                  setFinalNotes(e.target.value)

                }

              />

            </div>
                        {/* Action Buttons */}

            <div className="flex justify-end gap-3 mt-10">

              <Button

                variant="outline"

                onClick={() => {

                  setSelectedCase(null);

                }}

              >

                Cancel

              </Button>

              <Button

                onClick={async () => {

                  if (!findings.trim()) {

                    alert("Please enter investigation findings.");

                    return;

                  }

                  if (!recommendations.trim()) {

                    alert("Please enter recommendations.");

                    return;

                  }

                  const response = await fetch(

                    `/api/investigations/${selectedCase.id}`,

                    {

                      method: "PATCH",

                      headers: {

                        "Content-Type": "application/json",

                      },

                      body: JSON.stringify({

                        assigned_to: assignedTo,

                        findings,

                        recommendations,

                        suggested_actions: suggestedActions,

                        can_assist: canAssist,

                        final_notes: finalNotes,

                      }),

                    }

                  );

                  const data = await response.json();

                  if (data.success) {

                    alert("Investigation completed successfully.");

                    await loadCases();

                    setSelectedCase(null);

                  } else {

                    alert(data.message);

                  }

                }}

              >

                Complete Investigation

              </Button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}