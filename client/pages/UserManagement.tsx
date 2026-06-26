import { useState, useEffect } from 'react';
import { Search, X, Plus, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockUsers, User } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 10;

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<any[]>([]);
    useEffect(() => {
      loadUsers();
    }, []);

    const loadUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
      }
    };
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("active");

  let filtered = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filterStatus) {
    filtered = filtered.filter(user => user.accountStatus === filterStatus);
  }

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getStatusColor = (status: string) => {
    if (status === 'active') return 'bg-green-100 text-green-700';
    if (status === 'suspended') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    setSelectedUser(null);
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return 'text-red-600';
    if (score >= 50) return 'text-orange-600';
    if (score >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  const saveUser = async () => {

  try {

    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        username,
        email,
        accountStatus: status,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save user");
    }

    await loadUsers();

    setShowModal(false);

    setFullName("");
    setUsername("");
    setEmail("");
    setStatus("active");

    alert("User added successfully!");

  } catch (err) {
    console.error(err);
    alert("Error adding user");
  }

};
  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="mt-2 text-muted-foreground">Manage platform users and their accounts</p>
        </div>
        <Button onClick={() => { setEditingUser(null); setShowModal(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="rounded-lg border border-border bg-white p-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by username, email, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Account Status</label>
          <select
            value={filterStatus || ''}
            onChange={(e) => {
              setFilterStatus(e.target.value || null);
              setCurrentPage(1);
            }}
            className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-foreground">User ID</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Username</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Email</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Status</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Risk Score</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Alerts</th>
                <th className="px-6 py-3 text-left font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr key={user.id} className="border-b border-border hover:bg-muted transition-colors">
                  <td className="px-6 py-4 font-medium text-primary cursor-pointer hover:underline" onClick={() => setSelectedUser(user)}>
                    {user.id}
                  </td>
                  <td className="px-6 py-4 text-foreground">{user.username}</td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={cn('rounded-full px-3 py-1 text-xs font-medium', getStatusColor(user.accountStatus))}>
                      {user.accountStatus.charAt(0).toUpperCase() + user.accountStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('font-bold', getRiskColor(user.riskScore))}>
                      {user.riskScore}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground">{user.alertsCount}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link to={`/user-profile/${user.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setEditingUser(user); setShowModal(true); }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="border-t border-border px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-96 w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedUser.fullName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selectedUser.username}</p>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 border-t border-border pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">User ID</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Status</p>
                  <span className={cn('mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium', getStatusColor(selectedUser.accountStatus))}>
                    {selectedUser.accountStatus.charAt(0).toUpperCase() + selectedUser.accountStatus.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Risk Score</p>
                  <p className={cn('mt-1 text-sm font-bold', getRiskColor(selectedUser.riskScore))}>{selectedUser.riskScore}%</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-border pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedUser.activityCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Activities</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{selectedUser.alertsCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Alerts</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    {selectedUser.lastLogin.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Last Login</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3 border-t border-border pt-4">
              <Link to={`/user-profile/${selectedUser.id}`} className="flex-1">
                <Button className="w-full">View Profile</Button>
              </Link>
              <Button variant="outline" className="flex-1" onClick={() => setSelectedUser(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-96 w-full max-w-md overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-start justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <button onClick={() => { setShowModal(false); setEditingUser(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm"
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                className="flex-1"
                onClick={saveUser}
              >
                Save User
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => { setShowModal(false); setEditingUser(null); }}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
