import { useEffect, useState } from "react";
import {
  Search,
  User,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Investigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const [assignedTo, setAssignedTo] = useState("");
  const [findings, setFindings] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/investigations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setInvestigations(data.investigations);

          if (data.investigations.length > 0) {
            const first = data.investigations[0];

            setSelectedCase(first);
            setAssignedTo(first.assigned_to || "");
            setFindings(first.findings || "");
            setStatus(first.status || "OPEN");
          }
        }
      })
      .catch(console.error);
  }, []);

  const filteredCases = investigations.filter((item) => {
    return (
      (item.id || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.source_module || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (item.assigned_to || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 p-8">

      <div>
        <h1 className="text-3xl font-bold">
          Investigation Panel
        </h1>

        <p className="mt-2 text-muted-foreground">
          Review and manage investigation cases.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* LEFT SIDEBAR */}

        <div className="rounded-lg border bg-white">

          <div className="border-b p-5">

            <h2 className="text-lg font-semibold">
              Investigations
            </h2>

            <div className="relative mt-4">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search..."
                className="w-full rounded-lg border py-2 pl-10 pr-3 text-sm"
              />

            </div>

          </div>

          <div className="max-h-[650px] overflow-y-auto">

            {filteredCases.map((item) => (

              <button
                key={item.id}
                onClick={() => {
                  setSelectedCase(item);
                  setAssignedTo(item.assigned_to || "");
                  setFindings(item.findings || "");
                  setStatus(item.status || "OPEN");
                }}
                className={cn(
                  "w-full border-b p-4 text-left hover:bg-muted",
                  selectedCase?.id === item.id &&
                    "border-l-4 border-l-primary bg-primary/10"
                )}
              >

                <div className="flex items-center justify-between">

                  <div>

                    <p className="font-medium">
                      {item.source_module}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {item.id}
                    </p>

                  </div>

                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                    {item.status}
                  </span>

                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Assigned:
                  {" "}
                  {item.assigned_to || "Unassigned"}
                </p>

              </button>

            ))}

          </div>

        </div>

                {/* RIGHT PANEL */}

        <div className="lg:col-span-2">

          {selectedCase ? (

            <div className="space-y-6">

              <div className="rounded-lg border bg-white p-6">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-2xl font-bold">
                      Investigation Details
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCase.id}
                    </p>

                  </div>

                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                    {status}
                  </span>

                </div>

                <div className="mt-6 grid grid-cols-2 gap-6">

                  <div className="flex gap-3">

                    <ClipboardList className="h-5 w-5 mt-1 text-primary" />

                    <div>

                      <p className="text-xs text-muted-foreground">
                        Source Module
                      </p>

                      <p className="font-medium">
                        {selectedCase.source_module}
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-3">

                    <User className="h-5 w-5 mt-1 text-primary" />

                    <div>

                      <p className="text-xs text-muted-foreground">
                        Assigned Investigator
                      </p>

                      <input
                        value={assignedTo}
                        onChange={(e) =>
                          setAssignedTo(e.target.value)
                        }
                        className="mt-1 w-full rounded border px-3 py-2 text-sm"
                        placeholder="Assign investigator"
                      />

                    </div>

                  </div>

                  <div className="flex gap-3">

                    <Calendar className="h-5 w-5 mt-1 text-primary" />

                    <div>

                      <p className="text-xs text-muted-foreground">
                        Opened
                      </p>

                      <p className="font-medium">
                        {selectedCase.opened_at
                          ? new Date(
                              selectedCase.opened_at
                            ).toLocaleDateString()
                          : "-"}
                      </p>

                    </div>

                  </div>

                  <div>

                    <p className="text-xs text-muted-foreground">
                      Status
                    </p>

                    <select
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value)
                      }
                      className="mt-1 w-full rounded border px-3 py-2 text-sm"
                    >
                      <option>OPEN</option>
                      <option>IN_PROGRESS</option>
                      <option>CLOSED</option>
                    </select>

                  </div>

                </div>

              </div>

              <div className="rounded-lg border bg-white p-6">

                <h3 className="text-lg font-semibold">
                  Investigation Findings
                </h3>

                <textarea
                  value={findings}
                  onChange={(e) =>
                    setFindings(e.target.value)
                  }
                  rows={8}
                  className="mt-4 w-full rounded border p-3"
                  placeholder="Write investigation findings..."
                />

              </div>

              <div className="flex gap-3">

                <Button
                  onClick={async () => {
                    const res = await fetch(
                      `/api/investigations/${selectedCase.id}`,
                      {
                        method: "PATCH",
                        headers: {
                          "Content-Type":
                            "application/json",
                        },
                        body: JSON.stringify({
                          assigned_to: assignedTo,
                          findings,
                          status,
                        }),
                      }
                    );

                    const data = await res.json();

                    if (data.success) {
                      alert("Investigation Updated");
                    }
                  }}
                  className="flex-1"
                >
                  Save Investigation
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                >
                  Generate Report
                </Button>

              </div>

            </div>

          ) : (

            <div className="rounded-lg border bg-white p-12 text-center text-muted-foreground">

              No investigation selected.

            </div>

          )}

        </div>

      </div>

    </div>
  );
}