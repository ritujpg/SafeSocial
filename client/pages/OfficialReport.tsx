import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, FileText, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfficialReport() {

  const { investigationId } = useParams();

  const [report, setReport] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!investigationId) return;

    fetch(`/api/investigation-reports/${investigationId}`)
      .then((res) => res.json())
      .then((data) => {

        if (data.success) {

          setReport(data.report);

        }

      })
      .finally(() => setLoading(false));

  }, [investigationId]);

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center">

        <p className="text-lg font-medium">

          Loading Official Investigation Report...

        </p>

      </div>

    );

  }

  if (!report) {

    return (

      <div className="flex h-screen items-center justify-center">

        <p className="text-lg font-medium text-red-500">

          Report not found.

        </p>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-100 py-10">

      <div
        id="official-report"
        className="mx-auto max-w-5xl rounded-xl bg-white shadow-xl"
      >

        {/* HEADER */}

        <div className="border-b bg-slate-900 px-10 py-8 text-white">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="rounded-full bg-blue-600 p-3">

                <ShieldCheck className="h-8 w-8" />

              </div>

              <div>

                <h1 className="text-3xl font-bold">

                  SafeSocial

                </h1>

                <p className="text-slate-300">

                  AI-Powered Cyber Investigation Platform

                </p>

              </div>

            </div>

            <FileText className="h-12 w-12 text-blue-300" />

          </div>

          <div className="mt-8">

            <h2 className="text-4xl font-bold tracking-wide">

              OFFICIAL INVESTIGATION REPORT

            </h2>

            <p className="mt-2 text-slate-300">

              Generated after AI analysis and investigator review.

            </p>

          </div>

        </div>

        {/* CASE INFO */}

        <div className="grid grid-cols-4 gap-6 border-b px-10 py-8">

          <div>

            <p className="text-sm text-gray-500">

              Report ID

            </p>

            <p className="mt-1 font-semibold">

              {report.id}

            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">

              Investigation ID

            </p>

            <p className="mt-1 font-semibold">

              {report.investigation_id}

            </p>

          </div>

          <div>

            <p className="text-sm text-gray-500">

              Generated On

            </p>

            <div className="mt-1 flex items-center gap-2">

              <Calendar className="h-4 w-4" />

              {new Date(
                report.generated_at
              ).toLocaleString()}

            </div>

          </div>

          <div>

            <p className="text-sm text-gray-500">

              Status

            </p>

            <div className="mt-1 flex items-center gap-2 text-green-600 font-semibold">

              <CheckCircle className="h-5 w-5" />

              Completed

            </div>

          </div>

        </div>
                {/* INCIDENT SUMMARY */}

        <div className="px-10 py-8 border-b">

          <h3 className="text-2xl font-bold text-slate-800">

            Incident Summary

          </h3>

          <div className="mt-5 rounded-lg border bg-slate-50 p-6 leading-8 text-gray-700 whitespace-pre-wrap">

            {report.incident_summary}

          </div>

        </div>

        {/* AI ANALYSIS */}

        <div className="px-10 py-8 border-b">

          <h3 className="text-2xl font-bold text-slate-800">

            AI Analysis

          </h3>

          <div className="mt-6 grid grid-cols-3 gap-6">

            <div className="rounded-lg border bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">

                AI Classification

              </p>

              <p className="mt-2 text-xl font-semibold text-blue-700">

                {report.title.replace(
                  "SafeSocial Official Investigation Report - ",
                  ""
                )}

              </p>

            </div>

            <div className="rounded-lg border bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">

                AI Summary

              </p>

              <p className="mt-2 leading-7">

                {report.ai_summary}

              </p>

            </div>

            <div className="rounded-lg border bg-white p-5 shadow-sm">

              <p className="text-sm text-gray-500">

                Investigation Summary

              </p>

              <p className="mt-2 leading-7">

                {report.investigation_summary}

              </p>

            </div>

          </div>

        </div>

        {/* EVIDENCE */}

        <div className="px-10 py-8 border-b">

          <h3 className="text-2xl font-bold text-slate-800">

            Evidence Submitted

          </h3>

          <div className="mt-5 rounded-lg border bg-slate-50 p-6">

            <p className="text-gray-700 leading-8 whitespace-pre-wrap">

              {report.evidence || "Evidence attached during report submission."}

            </p>

          </div>

        </div>

        {/* INVESTIGATION FINDINGS */}

        <div className="px-10 py-8 border-b">

          <h3 className="text-2xl font-bold text-slate-800">

            Investigation Findings

          </h3>

          <div className="mt-5 rounded-lg border bg-slate-50 p-6 leading-8 whitespace-pre-wrap">

            {report.findings}

          </div>

        </div>
                {/* RECOMMENDATIONS */}

        <div className="px-10 py-8 border-b">

          <h3 className="text-2xl font-bold text-slate-800">

            Recommendations

          </h3>

          <div className="mt-5 rounded-lg border bg-slate-50 p-6 leading-8 whitespace-pre-wrap">

            {report.recommendations}

          </div>

        </div>

        {/* SUGGESTED ACTIONS */}

        <div className="px-10 py-8 border-b">

          <h3 className="text-2xl font-bold text-slate-800">

            Suggested Actions

          </h3>

          <div className="mt-6 grid grid-cols-2 gap-4">

            {report.suggested_actions?.map(
              (action: string) => (

                <div
                  key={action}
                  className="flex items-center gap-3 rounded-lg border bg-green-50 p-4"
                >

                  <CheckCircle className="h-5 w-5 text-green-600" />

                  <span className="font-medium">

                    {action}

                  </span>

                </div>

              )
            )}

          </div>

        </div>

        {/* FURTHER ASSISTANCE */}

        <div className="px-10 py-8 border-b">

          <h3 className="text-2xl font-bold text-slate-800">

            Further Assistance

          </h3>

          <div className="grid grid-cols-2 gap-8 mt-6">

            {/* Cyber Crime */}

            <div className="rounded-xl border bg-red-50 p-6">

              <h4 className="text-xl font-bold text-red-700">

                🇮🇳 National Cyber Crime Portal

              </h4>

              <p className="mt-4">

                <strong>Website</strong>

              </p>

              <p>

                https://cybercrime.gov.in

              </p>

              <p className="mt-4">

                <strong>Helpline</strong>

              </p>

              <p>

                1930

              </p>

              <p className="mt-4 text-sm text-gray-600 leading-7">

                Report cyberbullying, identity theft,
                financial fraud, impersonation and
                other cyber crimes through the
                National Cyber Crime Reporting Portal.

              </p>

            </div>

            {/* Platform Resources */}

            <div className="rounded-xl border bg-blue-50 p-6">

              <h4 className="text-xl font-bold text-blue-700">

                Platform Help Centres

              </h4>

              <div className="mt-5 space-y-3 text-sm">

                <div>

                  📷 Instagram – https://help.instagram.com

                </div>

                <div>

                  👍 Facebook – https://www.facebook.com/help

                </div>

                <div>

                  ✖ X (Twitter) – https://help.x.com

                </div>

                <div>

                  💼 LinkedIn – https://www.linkedin.com/help

                </div>

                <div>

                  💬 WhatsApp – https://www.whatsapp.com/contact

                </div>

                <div>

                  ▶ YouTube – https://support.google.com/youtube

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* VERIFICATION */}

        <div className="px-10 py-8">

          <div className="rounded-xl bg-slate-900 text-white p-8">

            <h3 className="text-2xl font-bold">

              SafeSocial Verification

            </h3>

            <div className="grid grid-cols-2 gap-8 mt-6">

              <div>

                <p className="text-slate-300">

                  Verification ID

                </p>

                <p className="mt-2 text-xl font-semibold">

                  SS-
                  {report.id.slice(0,8).toUpperCase()}

                </p>

              </div>

              <div>

                <p className="text-slate-300">

                  Generated By

                </p>

                <p className="mt-2 text-xl font-semibold">

                  SafeSocial AI Investigation System

                </p>

              </div>

            </div>

            <p className="mt-8 text-sm text-slate-300 leading-7">

              This investigation report has been
              generated after AI-assisted analysis
              and human investigator review.
              It is intended to assist the reporting
              user in understanding the incident
              and taking appropriate next steps.

            </p>

          </div>

        </div>
                {/* ACTIONS */}

        <div className="border-t px-10 py-8">

          <div className="flex items-center justify-end gap-4">

            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Back
            </Button>

            <Button
              onClick={() => {

                window.open(

                  `/api/investigation-reports/${report.investigation_id}/pdf`,

                  "_blank"

                );

              }}
            >

              Generate PDF

            </Button>

            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={async () => {

                const response = await fetch(

                  `/api/investigation-reports/${report.investigation_id}/send`,

                  {

                    method: "PATCH",

                  }

                );

                const data = await response.json();

                if (data.success) {

                  alert(

                    "Official Investigation Report has been sent to the user."

                  );

                } else {

                  alert(data.message);

                }

              }}
            >
              Send To User
            </Button>

          </div>

        </div>

        {/* FOOTER */}

        <div className="border-t bg-slate-100 px-10 py-8">

          <div className="flex items-center justify-between">

            <div>

              <h4 className="text-xl font-bold">

                SafeSocial

              </h4>

              <p className="text-sm text-gray-600 mt-1">

                AI-powered Cyber Investigation Platform

              </p>

            </div>

            <div className="text-right text-sm text-gray-600">

              <p>

                Official Investigation Report

              </p>

              <p className="mt-1">

                © 2026 SafeSocial

              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}