import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Eye, EyeOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'notifications'>('profile');
  const [settings, setSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@safesocial.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    alertThreshold: 'medium',
    emailNotifications: true,
    riskNotifications: true,
    theme: 'light',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabButtons = [
    { id: 'profile', label: 'Profile Settings' },
    { id: 'system', label: 'System Settings' },
    { id: 'notifications', label: 'Notifications' },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your account and application preferences</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
          <p className="text-sm font-medium text-green-800">✓ Settings saved successfully</p>
        </div>
      )}

      {/* Mobile Tab Buttons */}
      <div className="md:hidden">
        <div className="rounded-lg border border-border bg-white p-2 flex gap-2 overflow-x-auto">
          {tabButtons.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap text-sm',
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-muted'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Sidebar Navigation - Desktop Only */}
        <div className="hidden md:block md:col-span-1">
          <div className="rounded-lg border border-border bg-white p-4 space-y-2 sticky top-24">
            {tabButtons.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'w-full text-left px-4 py-2 rounded-lg font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Profile Settings</h2>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Password Change */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-medium text-foreground mb-4">Change Password</h3>

                  <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          value={settings.currentPassword}
                          onChange={(e) => handleChange('currentPassword', e.target.value)}
                          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          value={settings.newPassword}
                          onChange={(e) => handleChange('newPassword', e.target.value)}
                          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          value={settings.confirmPassword}
                          onChange={(e) => handleChange('confirmPassword', e.target.value)}
                          className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        <button
                          onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">System Settings</h2>

              <div className="space-y-6">
                {/* Alert Threshold */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Alert Threshold</label>
                  <select
                    value={settings.alertThreshold}
                    onChange={(e) => handleChange('alertThreshold', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="low">Low - Alert on all activities</option>
                    <option value="medium">Medium - Alert on suspicious activities</option>
                    <option value="high">High - Alert on critical activities only</option>
                  </select>
                  <p className="text-xs text-muted-foreground mt-2">Controls the sensitivity of alert notifications</p>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="light">Light Theme</option>
                    <option value="auto">Auto (System Default)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="rounded-lg border border-border bg-white p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Notification Settings</h2>

              <div className="space-y-4">
                {/* Email Notifications */}
                <div className="flex items-start justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Email Alerts</p>
                    <p className="text-sm text-muted-foreground mt-1">Receive email notifications for new alerts</p>
                  </div>
                  <button
                    onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      settings.emailNotifications ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Risk Notifications */}
                <div className="flex items-start justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Risk Notifications</p>
                    <p className="text-sm text-muted-foreground mt-1">Alert on high and critical risk cases</p>
                  </div>
                  <button
                    onClick={() => handleChange('riskNotifications', !settings.riskNotifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
                      settings.riskNotifications ? 'bg-primary' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.riskNotifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
            <Button variant="outline">Cancel</Button>
          </div>

          {/* Logout Section */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h2 className="text-lg font-semibold text-red-900 mb-4">Sign Out</h2>
            <p className="text-sm text-red-700 mb-6">
              You can sign out of your account here. You'll need to log back in to access the platform.
            </p>
            <Button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="bg-red-600 hover:bg-red-700 gap-2 w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
