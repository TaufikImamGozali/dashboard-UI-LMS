import React from 'react';
import type { AdminUser, UserRole } from '../../types/admin';
import {
  Search,
  Shield,
  UserCheck,
  UserX,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface AdminUsersTabProps {
  users: AdminUser[];
  currentAdminId?: string | null;
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onToggleStatus: (userId: string) => void;
  // Pagination & Filtering props
  search?: string;
  onSearchChange?: (val: string) => void;
  roleFilter?: 'all' | UserRole;
  onRoleFilterChange?: (role: 'all' | UserRole) => void;
  statusFilter?: 'all' | 'active' | 'suspended';
  onStatusFilterChange?: (status: 'all' | 'active' | 'suspended') => void;
  page?: number;
  totalPages?: number;
  totalUsers?: number;
  onPageChange?: (page: number) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users,
  currentAdminId,
  onUpdateRole,
  onToggleStatus,
  search = '',
  onSearchChange,
  roleFilter = 'all',
  onRoleFilterChange,
  statusFilter = 'all',
  onStatusFilterChange,
  page = 1,
  totalPages = 1,
  totalUsers = users.length,
  onPageChange,
}) => {
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder="Search by user name or email..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-outline bg-surface text-xs focus:border-brand-500 focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => onRoleFilterChange && onRoleFilterChange(e.target.value as 'all' | UserRole)}
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
            onChange={(e) => onStatusFilterChange && onStatusFilterChange(e.target.value as 'all' | 'active' | 'suspended')}
            aria-label="Filter users by status"
            className="px-3.5 py-2 rounded-full border border-outline bg-surface text-xs text-content-secondary focus:border-brand-500 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="suspended">Suspended Accounts</option>
          </select>
        </div>

        <div className="text-xs text-content-muted">
          Showing <strong>{users.length}</strong> of <strong>{totalUsers}</strong> registered users
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-surface border border-outline shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted border-b border-outline-subtle text-content-muted font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">User Profile</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Current Role</th>
                <th className="px-4 py-3.5">Joined Date</th>
                <th className="px-4 py-3.5">Account Status</th>
                <th className="px-5 py-3.5 text-right">Change Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-content-primary">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-content-muted">
                    No users found matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isCurrentAdmin = currentAdminId && u.id === currentAdminId;

                  return (
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
                              {isCurrentAdmin && (
                                <span className="text-[10px] bg-purple-50 text-purple-700 font-extrabold px-1.5 py-0.2 rounded-md border border-purple-200">
                                  YOU
                                </span>
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
                          disabled={!!isCurrentAdmin}
                          onClick={() => onToggleStatus(u.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-meta font-bold transition-all ${
                            isCurrentAdmin
                              ? 'opacity-60 cursor-not-allowed bg-emerald-50 text-emerald-600'
                              : u.status === 'active'
                              ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                          }`}
                          title={
                            isCurrentAdmin
                              ? 'Anda tidak dapat menonaktifkan akun Anda sendiri'
                              : 'Click to toggle status'
                          }
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
                          disabled={!!isCurrentAdmin}
                          value={u.role}
                          onChange={(e) => onUpdateRole(u.id, e.target.value as UserRole)}
                          aria-label={`Change role for ${u.name}`}
                          className={`px-3 py-1.5 rounded-xl border border-outline bg-surface text-xs font-semibold text-content-primary focus:border-brand-500 focus:outline-none ${
                            isCurrentAdmin ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                          title={
                            isCurrentAdmin
                              ? 'Anda tidak dapat menurunkan role akun sendiri'
                              : `Change role for ${u.name}`
                          }
                        >
                          <option value="student">Student</option>
                          <option value="mentor">Mentor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && onPageChange && (
          <div className="p-4 border-t border-outline-subtle bg-surface-muted/30 flex items-center justify-between text-xs text-content-secondary">
            <span>
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="p-1.5 rounded-lg border border-outline bg-surface hover:bg-surface-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="p-1.5 rounded-lg border border-outline bg-surface hover:bg-surface-muted disabled:opacity-40 disabled:pointer-events-none transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 flex items-start gap-3 text-xs text-brand-800">
        <AlertCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
        <p>
          <strong>Security Enforcement:</strong> Changing a user's role or status immediately executes with Postgres Row Level Security (RLS) triggers (`guard_profile_security`). Self-demotion and self-suspension by administrators are strictly prohibited both in client UI and PostgreSQL trigger constraints.
        </p>
      </div>
    </div>
  );
};
