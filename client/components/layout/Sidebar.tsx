import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Bell,
  AlertCircle,
  Users,
  MessageSquare,
  AlertTriangle,
  Image,
  Activity,
  Search,
  BarChart3,
  Shield,
  X,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Alerts', icon: Bell, path: '/alerts' },
  { label: 'Fake Accounts', icon: Users, path: '/fake-accounts' },
  { label: 'Cyberbullying', icon: MessageSquare, path: '/cyberbullying' },
  { label: 'Threats', icon: AlertTriangle, path: '/threats' },
  { label: 'Image Misuse', icon: Image, path: '/image-misuse' },
  { label: 'Activity Logs', icon: Activity, path: '/activity-logs' },
  { label: 'Investigation', icon: Search, path: '/investigation' },
  { label: 'User Management', icon: Users, path: '/user-management' },
  { label: 'Reports', icon: BarChart3, path: '/reports' },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  const sidebarContent = (
    <>
      {/* Logo and User Info */}
      <div className="border-b border-sidebar-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">SafeSocial</span>
        </div>
        {user && (
          <div className="pt-4 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/70">Logged in as</p>
            <p className="text-sm font-medium text-sidebar-foreground">{user.fullName}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="space-y-1 p-4 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      {user && (
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="text-lg">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-50 md:hidden bg-black/50 transition-opacity',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />
      
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 border-r border-border bg-sidebar flex flex-col transition-transform duration-300 md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close Button */}
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          <span className="text-lg font-bold text-sidebar-foreground">Menu</span>
          <button onClick={onClose} className="text-sidebar-foreground hover:text-sidebar-primary">
            <X className="h-6 w-6" />
          </button>
        </div>

        {sidebarContent}
      </aside>
    </>
  );
}
