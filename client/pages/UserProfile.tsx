import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);

  useEffect(() => {

    if (!userId) return;

    fetch(`/api/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {

        if (data.success) {
          setUser(data.user);
        }

      })
      .catch(console.error);

  }, [userId]);

  if (!user) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    );
  }

  const userAlerts: any[] = [];
  const userActivities: any[] = [];
  const userInvestigations: any[] = [];

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
              <p className="text-sm font-medium text-foreground">{new Date(user.joined).toLocaleDateString()}</p>
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
                {Math.floor(
                  (Date.now() - new Date(user.joined).getTime()) /
                  (1000 * 60 * 60 * 24)
                )} days
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
