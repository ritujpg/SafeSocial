import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Calendar, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUsers, mockAlerts, mockActivityLogs, mockInvestigationCases } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const user = mockUsers.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="space-y-6 p-8">
        <Button onClick={() => navigate('/user-management')} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <div className="rounded-lg border border-border bg-white p-8 text-center">
          <p className="text-foreground font-medium">User not found</p>
        </div>
      </div>
    );
  }

  const userAlerts = mockAlerts.filter(a => a.user === user.fullName);
  const userActivities = mockActivityLogs.filter(a => a.userId === user.id);
  const userInvestigations = mockInvestigationCases.filter(c => c.userId === user.id);

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'bg-red-100 text-red-700 border-red-200';
    if (score >= 50) return 'bg-orange-100 text-orange-700 border-orange-200';
    if (score >= 25) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  };

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-green-100 text-green-700';
    if (status === 'suspended') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6 p-8">
      {/* Back Button */}
      <Button onClick={() => navigate('/user-management')} variant="outline" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Users
      </Button>

      {/* User Header */}
      <div className="rounded-lg border border-border bg-white p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{user.fullName}</h1>
            <p className="text-muted-foreground mt-2">{user.username}</p>
          </div>
          <div className={cn('rounded-lg border-2 p-6 text-center', getRiskColor(user.riskScore))}>
            <p className="text-xs font-medium mb-2">Risk Score</p>
            <p className="text-3xl font-bold">{user.riskScore}%</p>
          </div>
        </div>

        {/* User Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-border pt-6">
          <div>
            <p className="text-xs text-muted-foreground mb-2">User ID</p>
            <p className="text-sm font-medium text-foreground">{user.id}</p>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Email</p>
              <p className="text-sm font-medium text-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
            <div>
              <p className="text-xs text-muted-foreground mb-2">Joined</p>
              <p className="text-sm font-medium text-foreground">{user.joinDate.toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Status</p>
            <span className={cn('inline-block rounded-full px-3 py-1 text-xs font-medium', getStatusColor(user.accountStatus))}>
              {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 border-t border-border pt-6 mt-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{user.activityCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Total Activities</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-orange-600">{user.alertsCount}</p>
            <p className="text-sm text-muted-foreground mt-2">Alerts Triggered</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{userInvestigations.length}</p>
            <p className="text-sm text-muted-foreground mt-2">Investigations</p>
          </div>
        </div>
      </div>

      {/* Related Alerts */}
      {userAlerts.length > 0 && (
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Alert History</h2>
          <div className="space-y-3">
            {userAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                <AlertCircle className={cn(
                  'h-5 w-5 flex-shrink-0 mt-0.5',
                  alert.riskLevel === 'critical' && 'text-red-500',
                  alert.riskLevel === 'high' && 'text-orange-500',
                  alert.riskLevel === 'medium' && 'text-yellow-500',
                  alert.riskLevel === 'low' && 'text-green-500'
                )} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{alert.id}</p>
                    <span className={cn(
                      'rounded-full px-2 py-1 text-xs font-medium',
                      alert.riskLevel === 'critical' && 'bg-red-100 text-red-700',
                      alert.riskLevel === 'high' && 'bg-orange-100 text-orange-700',
                      alert.riskLevel === 'medium' && 'bg-yellow-100 text-yellow-700',
                      alert.riskLevel === 'low' && 'bg-green-100 text-green-700'
                    )}>
                      {alert.riskLevel.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {alert.timestamp.toLocaleDateString()} {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      {userActivities.length > 0 && (
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {userActivities.slice(0, 5).map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg border border-border">
                <Activity className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-medium text-foreground">{activity.activity}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.timestamp.toLocaleDateString()} {activity.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investigation Records */}
      {userInvestigations.length > 0 && (
        <div className="rounded-lg border border-border bg-white p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Investigation Records</h2>
          <div className="space-y-3">
            {userInvestigations.map((investigation) => (
              <div key={investigation.id} className="p-4 rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">{investigation.id}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {investigation.incidents.length} incidents detected
                    </p>
                  </div>
                  <span className={cn(
                    'rounded-full px-3 py-1 text-xs font-medium capitalize',
                    investigation.status === 'active' && 'bg-orange-100 text-orange-700',
                    investigation.status === 'open' && 'bg-blue-100 text-blue-700',
                    investigation.status === 'closed' && 'bg-green-100 text-green-700'
                  )}>
                    {investigation.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Risk Assessment</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-foreground">Overall Risk Score</p>
              <p className="text-sm font-bold text-foreground">{user.riskScore}%</p>
            </div>
            <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={cn('h-full transition-all', 
                  user.riskScore >= 75 && 'bg-red-500',
                  user.riskScore >= 50 && user.riskScore < 75 && 'bg-orange-500',
                  user.riskScore >= 25 && user.riskScore < 50 && 'bg-yellow-500',
                  user.riskScore < 25 && 'bg-green-500'
                )}
                style={{ width: `${user.riskScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Account Age</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {Math.floor((Date.now() - user.joinDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted">
              <p className="text-xs text-muted-foreground">Activity Level</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {user.activityCount > 500 ? 'High' : user.activityCount > 200 ? 'Medium' : 'Low'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
