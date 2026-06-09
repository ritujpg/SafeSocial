import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Settings, X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockUsers, mockAlerts, mockActivityLogs } from '@/lib/mock-data';

interface TopNavProps {
  onMenuOpen?: () => void;
}

export function TopNav({ onMenuOpen }: TopNavProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      title: 'Critical Alert',
      description: 'Threat detected: ALT-001',
      time: '5 mins ago',
      type: 'critical'
    },
    {
      id: 2,
      title: 'Fake Account Detected',
      description: 'FA-001 has been flagged',
      time: '1 hour ago',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Investigation Update',
      description: 'INV-001 status changed to active',
      time: '3 hours ago',
      type: 'info'
    },
    {
      id: 4,
      title: 'Report Generated',
      description: 'Monthly report is ready for download',
      time: '1 day ago',
      type: 'success'
    },
  ];

  const currentTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="fixed right-0 top-0 z-30 h-16 w-full md:w-[calc(100%-256px)] border-b border-border bg-white">
      <div className="flex h-full items-center justify-between px-4 md:px-8 gap-4">
        {/* Hamburger Menu - Mobile */}
        <button onClick={onMenuOpen} className="md:hidden text-foreground hover:text-primary">
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 min-w-0">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(e.target.value.length > 0);
              }}
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            
            {/* Search Results */}
            {searchOpen && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 w-full rounded-lg border border-border bg-white shadow-lg max-h-96 overflow-y-auto z-50">
                {(() => {
                  const userResults = mockUsers.filter(u =>
                    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    u.id.toLowerCase().includes(searchQuery.toLowerCase())
                  ).slice(0, 3);

                  const alertResults = mockAlerts.filter(a =>
                    a.id.toLowerCase().includes(searchQuery.toLowerCase())
                  ).slice(0, 3);

                  if (userResults.length === 0 && alertResults.length === 0) {
                    return (
                      <div className="p-4 text-center text-muted-foreground">
                        No results found
                      </div>
                    );
                  }

                  return (
                    <>
                      {userResults.length > 0 && (
                        <>
                          <div className="border-b border-border px-4 py-2">
                            <p className="text-xs font-medium text-muted-foreground">Users</p>
                          </div>
                          {userResults.map(user => (
                            <button
                              key={user.id}
                              onClick={() => {
                                navigate(`/user-profile/${user.id}`);
                                setSearchQuery('');
                                setSearchOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                            >
                              <p className="font-medium text-foreground text-sm">{user.username}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </button>
                          ))}
                        </>
                      )}
                      {alertResults.length > 0 && (
                        <>
                          <div className="border-b border-border px-4 py-2">
                            <p className="text-xs font-medium text-muted-foreground">Alerts</p>
                          </div>
                          {alertResults.map(alert => (
                            <button
                              key={alert.id}
                              onClick={() => {
                                navigate('/alerts');
                                setSearchQuery('');
                                setSearchOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-b-0"
                            >
                              <p className="font-medium text-foreground text-sm">{alert.id}</p>
                              <p className="text-xs text-muted-foreground">{alert.description}</p>
                            </button>
                          ))}
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Date - Hidden on small screens */}
          <div className="hidden lg:block text-sm text-muted-foreground whitespace-nowrap">
            {currentTime}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-lg p-2 hover:bg-muted transition-colors"
            >
              <Bell className="h-5 w-5 text-foreground" />
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border border-border bg-white shadow-lg">
                <div className="border-b border-border p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Notifications</h3>
                    <button
                      onClick={() => setNotificationsOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className="border-b border-border p-4 hover:bg-muted transition-colors cursor-pointer last:border-b-0"
                    >
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            'mt-1 h-2 w-2 rounded-full flex-shrink-0',
                            notif.type === 'critical' && 'bg-red-500',
                            notif.type === 'warning' && 'bg-amber-500',
                            notif.type === 'info' && 'bg-blue-500',
                            notif.type === 'success' && 'bg-green-500'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{notif.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{notif.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            onClick={() => navigate('/settings')}
            className="rounded-lg p-2 hover:bg-muted transition-colors hidden sm:block"
          >
            <Settings className="h-5 w-5 text-foreground" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 md:gap-3 border-l border-border pl-2 md:pl-6">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              JD
            </div>
            <div className="text-sm hidden sm:block">
              <p className="font-medium text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
