import React, { useState, useMemo } from 'react';
import type { AdminUser, UserRole } from '../../types/admin';
import { Search, Shield, UserCheck, UserX, AlertCircle } from 'lucide-react';

interface AdminUsersTabProps {
  users: AdminUser[];
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onToggleStatus: (userId: string) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  onUpdateRole,
  onToggleStatus,
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const getRoleBadgeClass = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 font-extrabold border border-purple-200';
      case 'mentor':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 font-bold border border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-outline bg-surface text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as 'all' | UserRole)}
          aria-label="Filter users by role"
          className="px-3.5 py-2 rounded-full border border-outline bg-surface text-xs text-content-secondary focus:border-brand-500 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admins only</option>
          <option value="mentor">Mentors only</option>
          <option value="student">Students only</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'suspended')}
          aria-label="Filter users by status"
          className="px-3.5 py-2 rounded-full border border-outline bg-surface text-xs text-content-secondary focus:border-brand-500 focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Accounts</option>
          <option value="suspended">Suspended Accounts</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-surface border border-outline shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted border-b border-outline-subtle text-content-muted font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Current Role</th>
                <th className="px-4 py-3.5">Joined Date</th>
                <th className="px-4 py-3.5">Account Status</th>
                <th className="px-5 py-3.5 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-content-primary">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-content-muted">
                    No users found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-outline-subtle shrink-0"
                        />
                        <div>
                          <p className="font-bold text-content-primary flex items-center gap-1.5">
                            {u.name}
                            {u.role === 'admin' && (
                              <Shield className="w-3.5 h-3.5 text-purple-600 fill-purple-100" />
                            )}
                          </p>
                          <p className="text-meta text-content-muted font-mono">{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-mono text-content-secondary">
                      {u.email}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-meta uppercase tracking-wider ${getRoleBadgeClass(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-content-secondary">
                      {u.joinedDate}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(u.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-meta font-bold transition-all ${
                          u.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                        }`}
                        title="Click to toggle status"
                      >
                        {u.status === 'active' ? (
                          <>
                            <UserCheck className="w-3 h-3" /> Active
                          </>
                        ) : (
                          <>
                            <UserX className="w-3 h-3" /> Suspended
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => onUpdateRole(u.id, e.target.value as UserRole)}
                        aria-label={`Change role for ${u.name}`}
                        className="px-3 py-1.5 rounded-xl border border-outline bg-surface text-xs font-semibold text-content-primary focus:border-brand-500 focus:outline-none cursor-pointer"
                      >
                        <option value="student">Student</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-start gap-3 text-xs text-brand-800">
        <AlertCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
        <p>
          <strong>Security Note:</strong> Changing a user's role immediately logs a record into the Security Audit Log table (`public.audit_logs`) and updates database-level RLS privileges.
        </p>
      </div>
    </div>
  );
};
