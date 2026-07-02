import { useEffect, useState } from "react";
import {
  Search,
  X,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import FurtherAssistanceModal from "@/components/FurtherAssistanceModal";

interface ImageMisuseCase {
  id: string;
  report_id: string;

  reported_user: string;
  title: string;
  message: string;

  prediction: string;
  confidence_score: number;
  severity: string;

  ai_model: string;
  reason: string;

  detected_at: string;

  investigation_id?: string;
  sent_to_user?: boolean;
}

export default function ImageMisuse() {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");

  const [selectedCase, setSelectedCase] =
    useState<ImageMisuseCase | null>(null);

  const [cases, setCases] = useState<ImageMisuseCase[]>([]);

  const [showAssistance, setShowAssistance] =
    useState(false);

  useEffect(() => {
    fetch(
      `/api/image-misuse?userId=${user?.id}&role=${user?.role}`
    )
      .then((res) => res.json())
      .then((data) => setCases(data))
      .catch(console.error);
  }, []);

  const filtered = cases.filter((case_) => {
    const search = searchQuery.toLowerCase();

    return (
      (case_.reported_user || "")
        .toLowerCase()
        .includes(search) ||

      (case_.title || "")
        .toLowerCase()
        .includes(search) ||

      (case_.message || "")
        .toLowerCase()
        .includes(search)
    );
  });

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "high":
      case "severe":
        return "bg-red-100 text-red-700";

      case "medium":
      case "moderate":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="space-y-6 p-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-foreground">
          Image Misuse Detection
        </h1>

        <p className="mt-2 text-muted-foreground">
          Track and investigate unauthorized image usage
        </p>

      </div>

      {/* Search */}

      <div className="rounded-lg border border-border bg-white p-6">

        <div className="relative">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm"
          />

        </div>

      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {filtered.map((case_) => (

          <div
            key={case_.id}
            onClick={() => setSelectedCase(case_)}
            className="cursor-pointer rounded-lg border border-border bg-white p-6 transition-all hover:border-primary hover:shadow-md"
          >

            <div className="mb-4 flex items-start justify-between">

              <div className="flex items-start gap-3">

                <div className="rounded-lg bg-primary/10 p-2">

                  <ImageIcon className="h-5 w-5 text-primary" />

                </div>

                <div>

                  <h3 className="font-semibold text-foreground">

                    {case_.reported_user}

                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">

                    {case_.title}

                  </p>

                </div>

              </div>

              <div className="rounded-lg bg-red-100 px-3 py-1 text-right">

                <p className="text-xs font-medium text-red-700">

                  Risk

                </p>

                <p className="text-lg font-bold text-red-700">

                  {case_.confidence_score}%

                </p>

              </div>

            </div>

            <div className="space-y-3">

              <p className="text-sm text-foreground">

                {case_.reason}

              </p>

              <div className="border-t border-border pt-3">

                <p className="mb-1 text-xs text-muted-foreground">

                  Prediction

                </p>

                <p className="text-sm font-medium text-foreground">

                  {case_.prediction}

                </p>

              </div>

            </div>

            <Button
              className="mt-4 w-full"
              variant="outline"
            >
              View Details
            </Button>

          </div>

        ))}

      </div>

           {/* Case Details Modal */}

      {selectedCase && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  Image Investigation Details
                </h2>

                <p className="text-xs text-muted-foreground mt-1">
                  Image Misuse Detection
                </p>

              </div>

              <button
                onClick={() => setSelectedCase(null)}
              >
                <X className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>

            </div>

            <div className="space-y-6">

              {/* Reported User */}

              <div>

                <p className="text-sm text-muted-foreground">
                  Reported User
                </p>

                <p className="mt-1 font-semibold">
                  {selectedCase.reported_user}
                </p>

              </div>

              {/* Title */}

              <div>

                <p className="text-sm text-muted-foreground">
                  Title
                </p>

                <p className="mt-1 font-semibold">
                  {selectedCase.title}
                </p>

              </div>

              {/* Reported Message */}

              <div>

                <p className="text-sm text-muted-foreground">
                  Reported Message
                </p>

                <div className="mt-2 rounded-lg border bg-red-50 p-4">

                  <p className="text-sm leading-6">
                    {selectedCase.message}
                  </p>

                </div>

              </div>

              <div>

              <p className="text-sm text-muted-foreground mb-2">
                Evidence Preview
              </p>

              <div className="flex h-52 items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/30">

                <div className="text-center">

                  <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground" />

                  <p className="mt-3 text-sm font-medium text-muted-foreground">
                    No Image Available
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Image preview will appear here after detection.
                  </p>

                </div>

              </div>

            </div>

              {/* Risk Score + AI Prediction */}

              <div className="grid grid-cols-[150px_1fr] gap-6">

                <div>

                  <p className="mb-3 text-sm font-medium">
                    Risk Score
                  </p>

                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-red-100">

                    <div className="text-center">

                      <p className="text-3xl font-bold text-red-600">
                        {selectedCase.confidence_score}%
                      </p>

                      <p className="mt-1 text-xs font-semibold text-red-600">
                        {selectedCase.severity.toUpperCase()}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="rounded-xl border border-border bg-muted/30 p-5">

                  <h3 className="mb-4 text-lg font-semibold">
                    AI Prediction
                  </h3>

                  <div className="grid grid-cols-2 gap-4">

                    <div>

                      <p className="text-xs text-muted-foreground">
                        Prediction
                      </p>

                      <p className="mt-1 font-medium">
                        {selectedCase.prediction}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-muted-foreground">
                        Confidence
                      </p>

                      <p className="mt-1 font-medium">
                        {selectedCase.confidence_score}%
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-muted-foreground">
                        AI Model
                      </p>

                      <p className="mt-1 font-medium">
                        {selectedCase.ai_model}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-muted-foreground">
                        Reason
                      </p>

                      <p className="mt-1 font-medium">
                        {selectedCase.reason}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

                            {/* Detection Information */}

              <div className="rounded-xl border border-border bg-muted/30 p-5">

                <h3 className="mb-4 text-lg font-semibold">
                  Detection Information
                </h3>

                <div className="grid grid-cols-3 gap-6">

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Severity
                    </p>

                    <span
                      className={cn(
                        "mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium",
                        getSeverityColor(selectedCase.severity)
                      )}
                    >
                      {selectedCase.severity.toUpperCase()}
                    </span>

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Detected On
                    </p>

                    <p className="mt-1 font-medium">
                      {new Date(
                        selectedCase.detected_at
                      ).toLocaleString()}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Source
                    </p>

                    <p className="mt-1 font-medium">
                      User Report
                    </p>

                  </div>

                </div>

              </div>

              {/* Investigation Status */}

              <div className="rounded-xl border border-border bg-muted/30 p-5">

                <h3 className="mb-4 text-lg font-semibold">
                  Investigation Status
                </h3>

                <div className="grid grid-cols-2 gap-6">

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Investigation
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        !selectedCase.investigation_id
                          ? "bg-gray-100 text-gray-700"
                          : selectedCase.sent_to_user
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {!selectedCase.investigation_id
                        ? "Not Requested"
                        : selectedCase.sent_to_user
                        ? "Completed"
                        : "Requested"}
                    </span>

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Report
                    </p>

                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                        !selectedCase.investigation_id
                          ? "bg-gray-100 text-gray-700"
                          : selectedCase.sent_to_user
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {!selectedCase.investigation_id
                        ? "-"
                        : selectedCase.sent_to_user
                        ? "Received"
                        : "Awaited"}
                    </span>

                  </div>

                </div>

              </div>

            </div>

                        <div className="mt-8 border-t border-border pt-5">

              {user?.role === "ADMIN" ? (

                <div className="flex justify-end">

                  <Button
                    variant="outline"
                    onClick={() => setSelectedCase(null)}
                  >
                    Close
                  </Button>

                </div>

              ) : selectedCase.sent_to_user ? (

                <div className="flex gap-3">

                  <Button
                    className="flex-1"
                    onClick={() =>
                      window.open(
                        `/api/investigation-reports/${selectedCase.investigation_id}/pdf`,
                        "_blank"
                      )
                    }
                  >
                    Download Official Report
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAssistance(true)}
                  >
                    Further Assistance
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedCase(null)}
                  >
                    Close
                  </Button>

                </div>

              ) : (

                <div className="flex gap-3">

                  <Button
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    onClick={async () => {

                      const response = await fetch(
                        "/api/investigations",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            report_id: selectedCase.report_id,
                            user_id: user?.id,
                            target_username: selectedCase.reported_user,
                            severity: selectedCase.severity.toUpperCase(),
                            evidence: selectedCase.message,
                            request_reason:
                              "User requested investigation",
                            priority:
                              selectedCase.severity.toUpperCase() === "HIGH"
                                ? "HIGH"
                                : selectedCase.severity.toUpperCase() === "MEDIUM"
                                ? "MEDIUM"
                                : "LOW",
                          }),
                        }
                      );

                      const data = await response.json();

                      if (data.success) {

                        alert(
                          "Investigation request submitted successfully."
                        );

                        window.location.reload();

                      } else {

                        alert(data.message);

                      }

                    }}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Request Investigation
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setSelectedCase(null)}
                  >
                    Close
                  </Button>

                </div>

              )}

            </div>

            <FurtherAssistanceModal
              open={showAssistance}
              onClose={() => setShowAssistance(false)}
            />

          </div>

        </div>

      )}

    </div>

  );

}