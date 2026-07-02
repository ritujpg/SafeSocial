import { useEffect, useState } from "react";
import { Search, X, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import FurtherAssistanceModal from "@/components/FurtherAssistanceModal";

interface FakeAccount {
  id: string;

  report_id: string;

  investigation_id?: string;

  sent_to_user?: boolean;

  reported_user: string;

  title: string;

  message: string;

  prediction: string;

  confidence_score: number;

  severity: string;

  ai_model: string;

  reason: string;

  detected_at: string;
}

export default function FakeAccounts() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccount, setSelectedAccount] =
    useState<FakeAccount | null>(null);
  const [accounts, setAccounts] =
    useState<FakeAccount[]>([]);
  const navigate = useNavigate();
  const [showAssistance, setShowAssistance] =
    useState(false);
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

  useEffect(() => {
  fetch(
  `/api/fake-accounts?userId=${user?.id}&role=${user?.role}`
)
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

    (acc.reason || "")
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
                  {account.confidence_score}%
              </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-foreground mb-2">Suspicious Indicators</p>
                <div className="flex flex-wrap gap-1">
                  <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">
                    {account.reason}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-1">Prediction</p>
                <p className="text-sm font-medium text-foreground capitalize">{account.prediction}</p>
              </div>
            </div>

            <Button className="w-full mt-4" variant="outline" size="sm">
              View Details
            </Button>
          </div>
        ))}
      </div>

     {/* Account Details Modal */}

      {selectedAccount && (        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>

                <h2 className="text-2xl font-bold">
                  Cyberbullying Details 
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedAccount.id}
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedAccount(null) 
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
                  {selectedAccount.reported_user} 
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Title
                </p>

                <p className="font-medium">
                  {selectedAccount.title} 
                </p>

              </div>

              <div>

                <p className="text-sm text-muted-foreground">
                  Reported Message
                </p>

                <div className="mt-2 rounded-lg border bg-red-50 p-4">

                  <p className="text-sm">
                    {selectedAccount.message} 
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

          {selectedAccount.confidence_score}% 

        </p>

        <p className="mt-1 text-xs font-semibold text-red-600">

          {selectedAccount.severity.toUpperCase()} 

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

          {selectedAccount.prediction} 

        </p>

      </div>

      <div>

        <p className="text-xs text-muted-foreground">

          Confidence

        </p>

        <p className="font-medium">

          {selectedAccount.confidence_score}% 

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
getSeverityColor(selectedAccount.severity) 
)}
>

{selectedAccount.severity.toUpperCase()} 

</span>

</div>

<div>

<p className="text-xs text-muted-foreground">

Detected On

</p>

<p className="font-medium">

{new Date(selectedAccount.detected_at).toLocaleString()} 

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
          !selectedAccount.investigation_id 
            ? "bg-gray-100 text-gray-700"
            : selectedAccount.sent_to_user 
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {!selectedAccount.investigation_id 
          ? "Not Requested"
          : selectedAccount.sent_to_user 
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
          !selectedAccount.investigation_id 
            ? "bg-gray-100 text-gray-700"
            : selectedAccount.sent_to_user 
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {!selectedAccount.investigation_id 
          ? "-"
          : selectedAccount.sent_to_user 
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

    onClick={() => setSelectedAccount(null)} 

  >

    Close

  </Button>

) : selectedAccount.sent_to_user ? ( 

  <>

    <Button

      variant="outline"

      className="flex-1"

      onClick={() =>

        window.open(

          `/api/investigation-reports/${selectedAccount.investigation_id}/pdf`, 

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

      onClick={() => setSelectedAccount(null)} 

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



                          report_id: selectedAccount.report_id, 



                          user_id: user?.id,



                          target_username: selectedAccount.reported_user, 



                          severity: selectedAccount.severity.toUpperCase(), 



                          evidence: selectedAccount.message, 



                          request_reason:



                            "User requested investigation",



                          priority:



                            selectedAccount.severity === "CRITICAL" 



                              ? "HIGH"



                              : selectedAccount.severity === "HIGH" 



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



      <AlertCircle className="mr-2 h-4 w-4" />

      Request Investigation

    </Button>

    <Button

      variant="outline"

      className="flex-1"

      onClick={() => setSelectedAccount(null)} 

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

