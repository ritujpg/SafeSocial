import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function Settings() {

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "profile" | "system" | "notifications"
  >("profile");

  const [settings, setSettings] = useState({

    name: user?.fullName || "",

    email: user?.email || "",

    currentPassword: "",

    newPassword: "",

    confirmPassword: "",

    alertThreshold: "medium",

    emailNotifications: true,

    riskNotifications: true,

    theme: "light",

  });

  const [showPasswords, setShowPasswords] =
    useState({

      current: false,

      new: false,

      confirm: false,

    });

  const [saved, setSaved] =
    useState(false);

  const handleChange = (
    key: string,
    value: any
  ) => {

    setSettings((prev) => ({

      ...prev,

      [key]: value,

    }));

    setSaved(false);

  };

  const handleSave = () => {

    setSaved(true);

    setTimeout(() => {

      setSaved(false);

    }, 3000);

  };

  const tabButtons = [

    {
      id: "profile",
      label: "Profile Settings",
    },

    {
      id: "system",
      label: "System Settings",
    },

    {
      id: "notifications",
      label: "Notifications",
    },

  ];

  return (

    <div className="space-y-8 p-4 md:p-8">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold text-foreground">
          Settings
        </h1>

        <p className="mt-2 text-muted-foreground">
          Manage your account and application preferences
        </p>

      </div>

      {saved && (

        <div className="rounded-lg border border-green-200 bg-green-50 p-4">

          <p className="text-sm font-medium text-green-800">
            ✓ Settings saved successfully
          </p>

        </div>

      )}

      {/* Mobile Tabs */}

      <div className="md:hidden">

        <div className="flex gap-2 overflow-x-auto rounded-lg border border-border bg-white p-2">

          {tabButtons.map((tab) => (

            <button

              key={tab.id}

              onClick={() =>
                setActiveTab(tab.id as any)
              }

              className={cn(

                "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",

                activeTab === tab.id

                  ? "bg-primary text-white"

                  : "text-foreground hover:bg-muted"

              )}

            >

              {tab.label}

            </button>

          ))}

        </div>

      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Sidebar */}

      <div className="hidden md:block">

        <div className="sticky top-24 space-y-2 rounded-lg border border-border bg-white p-4">

          {tabButtons.map((tab) => (

            <button

              key={tab.id}

              onClick={() =>
                setActiveTab(tab.id as any)
              }

              className={cn(

                "w-full rounded-lg px-4 py-2 text-left font-medium transition-colors",

                activeTab === tab.id

                  ? "bg-primary text-white"

                  : "text-foreground hover:bg-muted"

              )}

            >

              {tab.label}

            </button>

          ))}

        </div>

      </div>

      {/* Settings Content */}

      <div className="space-y-8 md:col-span-2">

        {/* Profile */}

        {activeTab === "profile" && (

          <div className="rounded-lg border border-border bg-white p-6">

            <h2 className="mb-6 text-lg font-semibold">
              Profile Settings
            </h2>

            <div className="space-y-6">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Full Name
                </label>

                <input

                  type="text"

                  value={settings.name}

                  onChange={(e) =>
                    handleChange(
                      "name",
                      e.target.value
                    )
                  }

                  className="w-full rounded-lg border border-input px-4 py-2"

                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <input

                  type="email"

                  value={settings.email}

                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value
                    )
                  }

                  className="w-full rounded-lg border border-input px-4 py-2"

                />

              </div>

            </div>

          </div>

        )}

        {/* System */}

        {activeTab === "system" && (

          <div className="rounded-lg border border-border bg-white p-6">

            <h2 className="mb-6 text-lg font-semibold">
              System Settings
            </h2>

            <div className="space-y-6">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Alert Threshold
                </label>

                <select

                  value={settings.alertThreshold}

                  onChange={(e) =>
                    handleChange(
                      "alertThreshold",
                      e.target.value
                    )
                  }

                  className="w-full rounded-lg border border-input px-4 py-2"

                >

                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>

                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Theme
                </label>

                <select

                  value={settings.theme}

                  onChange={(e) =>
                    handleChange(
                      "theme",
                      e.target.value
                    )
                  }

                  className="w-full rounded-lg border border-input px-4 py-2"

                >

                  <option value="light">
                    Light
                  </option>

                  <option value="auto">
                    Auto
                  </option>

                </select>

              </div>

            </div>

          </div>

        )}

        {/* Notifications */}

        {activeTab === "notifications" && (

          <div className="rounded-lg border border-border bg-white p-6">

            <h2 className="mb-6 text-lg font-semibold">
              Notification Settings
            </h2>

            <div className="space-y-4">

              <label className="flex items-center justify-between rounded-lg border border-border p-4">

                <span>Email Notifications</span>

                <input

                  type="checkbox"

                  checked={
                    settings.emailNotifications
                  }

                  onChange={() =>
                    handleChange(
                      "emailNotifications",
                      !settings.emailNotifications
                    )
                  }

                />

              </label>

              <label className="flex items-center justify-between rounded-lg border border-border p-4">

                <span>Risk Notifications</span>

                <input

                  type="checkbox"

                  checked={
                    settings.riskNotifications
                  }

                  onChange={() =>
                    handleChange(
                      "riskNotifications",
                      !settings.riskNotifications
                    )
                  }

                />

              </label>

            </div>

          </div>

        )}

        {/* Action Buttons */}

        <div className="flex flex-col gap-3 sm:flex-row">

          <Button
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>

          <Button
            variant="outline"
          >
            Cancel
          </Button>

        </div>

        {/* Logout */}

        <div className="rounded-lg border border-red-200 bg-red-50 p-6">

          <h2 className="mb-4 text-lg font-semibold text-red-900">
            Sign Out
          </h2>

          <p className="mb-6 text-sm text-red-700">
            You can safely sign out of your account.
          </p>

          <Button

            onClick={() => {

              logout();

              navigate("/login");

            }}

            className="w-full gap-2 bg-red-600 hover:bg-red-700 sm:w-auto"

          >

            <LogOut className="h-4 w-4" />

            Sign Out

          </Button>

        </div>

      </div>

    </div>

  );
</div>
  )}
