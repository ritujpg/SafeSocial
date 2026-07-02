import { Button } from "@/components/ui/button";
import { X, ShieldCheck, ExternalLink, CheckCircle2 } from "lucide-react";

interface FurtherAssistanceModalProps {

  open: boolean;

  onClose: () => void;

}

export default function FurtherAssistanceModal({

  open,

  onClose,

}: FurtherAssistanceModalProps) {

  if (!open) return null;

  const platforms = [

    {

      name: "Instagram",

      url: "https://help.instagram.com",

    },

    {

      name: "Facebook",

      url: "https://www.facebook.com/help",

    },

    {

      name: "X (Twitter)",

      url: "https://help.x.com",

    },

    {

      name: "LinkedIn",

      url: "https://www.linkedin.com/help",

    },

    {

      name: "WhatsApp",

      url: "https://www.whatsapp.com/contact",

    },

    {

      name: "YouTube",

      url: "https://support.google.com/youtube",

    },

    {

      name: "Telegram",

      url: "https://telegram.org/support",

    },

    {

      name: "Snapchat",

      url: "https://help.snapchat.com",

    },

    {

      name: "Discord",

      url: "https://discord.com/safety",

    },

  ];

  const actions = [

    "Preserve screenshots and all available evidence.",

    "Block the reported account.",

    "Report the account on the respective social media platform.",

    "File a complaint through the National Cyber Crime Reporting Portal if required.",

  ];

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-8 shadow-xl">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-3xl font-bold">

              Further Assistance

            </h2>

            <p className="mt-2 text-muted-foreground">

              Your investigation has been completed. If further action is required, the following official resources may help.

            </p>

          </div>

          <Button

            variant="outline"

            onClick={onClose}

          >

            <X className="mr-2 h-4 w-4" />

            Close

          </Button>

        </div>
                {/* National Cyber Crime Portal */}

        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">

          <div className="flex items-center gap-3">

            <ShieldCheck className="h-8 w-8 text-red-600" />

            <h3 className="text-2xl font-bold text-red-700">

              National Cyber Crime Reporting Portal

            </h3>

          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <p className="font-semibold">

                Official Website

              </p>

              <a

                href="https://cybercrime.gov.in"

                target="_blank"

                rel="noreferrer"

                className="mt-2 inline-flex items-center gap-2 text-blue-600 underline"

              >

                https://cybercrime.gov.in

                <ExternalLink className="h-4 w-4" />

              </a>

            </div>

            <div>

              <p className="font-semibold">

                National Cyber Helpline

              </p>

              <p className="mt-2 text-2xl font-bold text-red-700">

                1930

              </p>

            </div>

          </div>

          <Button

            className="mt-6"

            onClick={() =>

              window.open(

                "https://cybercrime.gov.in",

                "_blank"

              )

            }

          >

            Visit National Cyber Crime Portal

          </Button>

        </div>
                {/* Platform Help Centres */}

        <div className="mt-10">

          <h3 className="text-2xl font-bold">

            Social Media Help Centres

          </h3>

          <p className="mt-2 text-muted-foreground">

            Contact the respective platform to report fake accounts,
            impersonation, cyberbullying, threats, or image misuse.

          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            {platforms.map((platform) => (

              <div
                key={platform.name}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >

                <h4 className="text-lg font-semibold">

                  {platform.name}

                </h4>

                <p className="mt-2 text-sm text-muted-foreground">

                  Official Help Centre

                </p>

                <Button
                  className="mt-5 w-full"
                  variant="outline"
                  onClick={() =>
                    window.open(
                      platform.url,
                      "_blank"
                    )
                  }
                >

                  <ExternalLink className="mr-2 h-4 w-4" />

                  Visit Help Centre

                </Button>

              </div>

            ))}

          </div>

        </div>
                {/* Recommended Actions */}

        <div className="mt-10">

          <h3 className="text-2xl font-bold">

            Recommended Actions

          </h3>

          <p className="mt-2 text-muted-foreground">

            Follow these recommendations to help protect yourself and preserve evidence.

          </p>

          <div className="mt-6 space-y-4">

            {actions.map((action) => (

              <div
                key={action}
                className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4"
              >

                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />

                <p className="text-sm text-gray-700">

                  {action}

                </p>

              </div>

            ))}

          </div>

        </div>

        {/* Footer */}

        <div className="mt-10 flex justify-end">

          <Button

            onClick={onClose}

          >

            Close

          </Button>

        </div>

      </div>

    </div>

  );

}