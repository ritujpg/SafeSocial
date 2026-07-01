import { FolderOpen, ShieldCheck, Clock, CheckCircle } from "lucide-react";

export default function CaseManagement() {
  return (
    <div className="p-8 space-y-8">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">
          Case Management
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage investigation requests submitted by users after
          report review and approval.
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
                0
              </h2>

            </div>

            <Clock className="h-10 w-10 text-yellow-500" />

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                In Progress
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                0
              </h2>

            </div>

            <ShieldCheck className="h-10 w-10 text-blue-500" />

          </div>

        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-muted-foreground">
                Completed
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                0
              </h2>

            </div>

            <CheckCircle className="h-10 w-10 text-green-500" />

          </div>

        </div>

      </div>

      {/* Empty State */}

      <div className="rounded-xl border bg-white p-12 text-center shadow-sm">

        <FolderOpen className="mx-auto h-20 w-20 text-gray-400" />

        <h2 className="mt-6 text-2xl font-semibold">
          No Investigation Requests
        </h2>

        <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">

          Investigation requests submitted by users will appear here
          after they request further assistance on an approved or
          rejected report.

        </p>

      </div>

    </div>
  );
}