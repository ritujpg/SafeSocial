import { useEffect, useState } from 'react';
import { Search, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from "@/context/AuthContext";
import FurtherAssistanceModal from "@/components/FurtherAssistanceModal";

const ITEMS_PER_PAGE = 10;

export default function Cyberbullying() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [showAssistance, setShowAssistance] =
  useState(false);

  useEffect(() => {
    fetch(
  `/api/cyberbullying?userId=${user?.id}&role=${user?.role}`
)
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
      })
      .catch((err) => console.error(err));
  }, []);

  console.log(cases);

  let filtered = cases.filter((case_) =>

    (case_.reported_user ?? "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||

    (case_.message ?? "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

  );


  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getSeverityColor = (severity: string) => {
    if (severity === 'severe') return 'bg-red-100 text-red-700';
    if (severity === 'moderate') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cyberbullying Detection</h1>
        <p className="mt-2 text-muted-foreground">Monitor and respond to harassment cases</p>
      </div>

    {/* Search */}
    <div className="rounded-lg border border-border bg-white p-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by username or message..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
    </div>

      {/* Cases Table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-foreground">Case ID</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Target</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Message Preview</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Severity</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Date</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((case_) => (
                <tr key={case_.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-primary">{case_.id}</td>
                  <td className="px-6 py-4 text-foreground">{case_.targetUsername}</td>
                  <td className="px-6 py-4 text-foreground truncate max-w-xs">{case_.message}</td>
                  <td className="px-6 py-4">
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', getSeverityColor(case_.severity))}>
                      {case_.severity.charAt(0).toUpperCase() + case_.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(case_.timestamp).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Button size="sm" variant="outline" onClick={() => setSelectedCase(case_)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

       {/* Case Details Modal */}

      {selectedCase && (        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  Cyberbullying Details 
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedCase.id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedCase(null) 
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
                  {selectedCase.reported_user} 
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Title
                </p>

                <p className="font-medium">
                  {selectedCase.title} 
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Reported Message
                </p>

                <div className="mt-2 rounded-lg border bg-red-50 p-4">

                  <p className="text-sm">
                    {selectedCase.message} 
                  </p>

                </div>

              </div>

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

  <div className="rounded-xl border bg-muted/30 p-5">

    <h3 className="mb-4 text-lg font-semibold">

      AI Prediction

    </h3>

    <div className="grid grid-cols-2 gap-4">

      <div>

        <p className="text-xs text-muted-foreground">

          Prediction

        </p>

        <p className="font-medium">

          {selectedCase.threat_type} 

        </p>

      </div>

      <div>

        <p className="text-xs text-muted-foreground">

          Confidence

        </p>

        <p className="font-medium">

          {selectedCase.confidence_score}% 

        </p>

      </div>

      <div>

        <p className="text-xs text-muted-foreground">

          AI Model

        </p>

        <p className="font-medium">

          Random Forest 

        </p>

      </div>

      <div>

        <p className="text-xs text-muted-foreground">

          Reason

        </p>

        <p className="font-medium">

          Offensive language detected. 

        </p>

      </div>

    </div>

  </div>

</div>
             <div className="rounded-xl border bg-muted/30 p-5">

<h3 className="mb-4 text-lg font-semibold">

Detection Information

</h3>

<div className="grid grid-cols-3 gap-5">

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

<p className="font-medium">

{new Date(selectedCase.created_at).toLocaleString()} 

</p>

</div>

<div>

<p className="text-xs text-muted-foreground">

Source

</p>

<p className="font-medium">

User Report

</p>

</div>

</div>

</div>

<div className="rounded-xl border bg-muted/30 p-5">

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

            <div className="mt-8 flex gap-3">

              <div className="mt-8 flex gap-3">

              {user?.role === "ADMIN" ? (

  <Button

    variant="outline"

    className="flex-1"

    onClick={() => setSelectedCase(null)} 

  >

    Close

  </Button>

) : selectedCase.sent_to_user ? ( 

  <>

    <Button

      variant="outline"

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

      className="flex-1"

      onClick={() => setSelectedCase(null)} 

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



                          report_id: selectedCase.report_id, 



                          user_id: user?.id,



                          target_username: selectedCase.reported_user, 



                          severity: selectedCase.severity.toUpperCase(), 



                          evidence: selectedCase.message, 



                          request_reason:



                            "User requested investigation",



                          priority:



                            selectedCase.severity === "CRITICAL" 



                              ? "HIGH"



                              : selectedCase.severity === "HIGH" 



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



      <MessageSquare className="mr-2 h-4 w-4" />

      Request Investigation

    </Button>

    <Button

      variant="outline"

      className="flex-1"

      onClick={() => setSelectedCase(null)} 

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

