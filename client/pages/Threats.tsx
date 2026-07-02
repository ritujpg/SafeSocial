import { useState, useEffect } from "react";
import { Search, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import FurtherAssistanceModal from "@/components/FurtherAssistanceModal";

const ITEMS_PER_PAGE = 10;

interface ThreatCase {

  id: string;

  report_id: string;

  investigation_id?: string;

  sent_to_user?: boolean;

  title: string;

  reported_user: string;

  message: string;

  description: string;

  threat_type: string;

  confidence: number;

  confidence_score: number;

  severity: string;

  status: string;

  created_at: string;

}

export default function Threats() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedThreat, setSelectedThreat] =
    useState<ThreatCase | null>(null);
  const [showAssistance, setShowAssistance] =
    useState(false);
  const [threats, setThreats] =
    useState<ThreatCase[]>([]);

  useEffect(() => {
    fetch(
      `/api/threats?userId=${user?.id}&role=${user?.role}`
    )
    
      .then((res) => res.json())
      .then((data) => {
        setThreats(data);
      })
      .catch(console.error);
  }, []);

 const filtered = threats.filter((threat) => {

  const search = searchQuery.toLowerCase();

  return (

    (threat.reported_user || "")
      .toLowerCase()
      .includes(search) ||

    (threat.message || "")
      .toLowerCase()
      .includes(search) ||

    (threat.title || "")
      .toLowerCase()
      .includes(search) ||

    (threat.description || "")
      .toLowerCase()
      .includes(search) ||

    (threat.threat_type || "")
      .toLowerCase()
      .includes(search)

  );

});

  const totalPages = Math.ceil(
    filtered.length / ITEMS_PER_PAGE
  );

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getSeverityColor = (
    severity: string
  ) => {
    if (severity === "critical")
      return "bg-red-100 text-red-700";

    if (severity === "high")
      return "bg-orange-100 text-orange-700";

    if (severity === "medium")
      return "bg-yellow-100 text-yellow-700";

    return "bg-green-100 text-green-700";
  };

  return (
    <div className="space-y-6 p-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-foreground">
          Threat Detection
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review AI detected threat messages.
        </p>

      </div>

      {/* Search */}

      <div className="rounded-lg border border-border bg-white p-6">

        <div className="relative">

          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search threats..."
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm"
          />

        </div>

      </div>

      {/* Threat Table */}

      <div className="overflow-hidden rounded-lg border border-border bg-white">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="border-b border-border bg-muted">

              <tr>

                <th className="px-6 py-3 text-left">
                  Threat ID
                </th>

                <th className="px-6 py-3 text-left">
                  Reported User
                </th>

                <th className="px-6 py-3 text-left">
                  Report Title
                </th>

                <th className="px-6 py-3 text-left">
                  Threat Type
                </th>

                <th className="px-6 py-3 text-left">
                  Severity
                </th>

                <th className="px-6 py-3 text-left">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>              {paginated.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No threats found.
                  </td>

                </tr>

              ) : (

                paginated.map((threat) => (

                  <tr
                    key={threat.id}
                    className="border-b border-border transition-colors hover:bg-muted"
                  >

                    <td className="px-6 py-4 font-medium text-primary">
                      {threat.id}
                    </td>

                    <td className="px-6 py-4">
                      {threat.reported_user}
                    </td>

                    <td className="px-6 py-4">
                      {threat.title}
                    </td>

                    <td className="px-6 py-4">
                      {threat.threat_type}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          getSeverityColor(
                            threat.severity
                          )
                        )}
                      >
                        {threat.severity.toUpperCase()}
                      </span>

                    </td>

                    <td className="px-6 py-4">

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setSelectedThreat(threat)
                        }
                      >
                        View
                      </Button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {totalPages > 1 && (

          <div className="flex items-center justify-between border-t border-border px-6 py-4">

            <p className="text-sm text-muted-foreground">

              Showing{" "}

              {(currentPage - 1) *
                ITEMS_PER_PAGE +
                1}

              {" "}to{" "}

              {Math.min(
                currentPage *
                  ITEMS_PER_PAGE,
                filtered.length
              )}

              {" "}of{" "}

              {filtered.length}

            </p>

            <div className="flex gap-2">

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(
                    currentPage - 1
                  )
                }
              >
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  currentPage ===
                  totalPages
                }
                onClick={() =>
                  setCurrentPage(
                    currentPage + 1
                  )
                }
              >
                Next
              </Button>

            </div>

          </div>

        )}

      </div>

      {/* Threat Details Modal */}

      {selectedThreat && (        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  Threat Details
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedThreat.id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedThreat(null)
                }
              >
                <X className="h-6 w-6 text-muted-foreground hover:text-foreground" />
              </button>

            </div>

            <div className="space-y-5">

              <div>

                <p className="text-sm text-muted-foreground">
                  Reported User
                </p>

                <p className="font-medium">
                  {selectedThreat.reported_user}
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Title
                </p>

                <p className="font-medium">
                  {selectedThreat.title}
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Reported Message
                </p>

                <div className="mt-2 rounded-lg border bg-red-50 p-4">

                  <p className="text-sm">
                    {selectedThreat.message}
                  </p>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-6">

                <div>

                  <p className="text-sm text-muted-foreground">
                    Threat Type
                  </p>

                  <p className="font-medium">
                    {selectedThreat.threat_type}
                  </p>

                </div>

                <div>

                  <p className="text-sm text-muted-foreground">
                    Confidence
                  </p>

                  <p className="font-medium">
                    {selectedThreat.confidence_score}%
                  </p>

                </div>

                <div>

                  <p className="text-sm text-muted-foreground">
                    Severity
                  </p>

                  <span
                    className={cn(
                      "mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium",
                      getSeverityColor(
                        selectedThreat.severity
                      )
                    )}
                  >
                    {selectedThreat.severity.toUpperCase()}
                  </span>

                </div>

                <div>

                  <p className="text-sm text-muted-foreground">
                    Status
                  </p>

                  <p className="font-medium">
                    {selectedThreat.status}
                  </p>

                </div>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Detected On
                </p>

                <p className="font-medium">
                  {new Date(
                    selectedThreat.created_at
                  ).toLocaleString()}
                </p>

              </div>

            </div>

            <div className="mt-8 flex gap-3">

              <div className="mt-8 flex gap-3">

              {user?.role === "ADMIN" ? (

  <Button

    variant="outline"

    className="flex-1"

    onClick={() => setSelectedThreat(null)}

  >

    Close

  </Button>

) : selectedThreat.sent_to_user ? (

  <>

    <Button

      variant="outline"

      className="flex-1"

      onClick={() =>

        window.open(

          `/api/investigation-reports/${selectedThreat.investigation_id}/pdf`,

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

      className="flex-1"

      onClick={() => setSelectedThreat(null)}

    >

      Close

    </Button>

  </>

) : (

  <>

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



                          report_id: selectedThreat.report_id,



                          user_id: user?.id,



                          target_username: selectedThreat.reported_user,



                          severity: selectedThreat.severity.toUpperCase(),



                          evidence: selectedThreat.message,



                          request_reason:



                            "User requested investigation",



                          priority:



                            selectedThreat.severity === "CRITICAL"



                              ? "HIGH"



                              : selectedThreat.severity === "HIGH"



                              ? "HIGH"



                              : "MEDIUM",



                        }),



                      }



                    );



                    const data = await response.json();



                    console.log(data);



                    if (data.success) {



                      alert("Investigation request submitted successfully.");



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

      className="flex-1"

      onClick={() => setSelectedThreat(null)}

    >

      Close

    </Button>

  </>

)}


</div>

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