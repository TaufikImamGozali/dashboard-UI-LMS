import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminStatsCards } from '../components/admin/AdminStatsCards';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminCoursesTab } from '../components/admin/AdminCoursesTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminAnnouncementsTab } from '../components/admin/AdminAnnouncementsTab';
import { AdminAuditLogsTab } from '../components/admin/AdminAuditLogsTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Megaphone,
  ShieldAlert,
  Settings as SettingsIcon,
} from 'lucide-react';

type TabId = 'overview' | 'courses' | 'users' | 'announcements' | 'logs' | 'settings';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const {
    currentAdminId,
    // Users
    users,
    usersTotal,
    usersPage,
    usersTotalPages,
    setUsersPage,
    usersSearch,
    setUsersSearch,
    usersRoleFilter,
    setUsersRoleFilter,
    usersStatusFilter,
    setUsersStatusFilter,
    updateUserRole,
    toggleUserStatus,
    // Courses
    courses,
    fetchCourses,
    addCourse,
    editCourse,
    deleteCourse,
    toggleCoursePublish,
    // Settings
    settings,
    updateSettings,
    // Audit Logs
    auditLogs,
    auditLogsTotal,
    auditLogsPage,
    auditLogsTotalPages,
    setAuditLogsPage,
    auditLogsSearch,
    setAuditLogsSearch,
    // Stats & Overall
    stats,
    refreshAll,
  } = useAdmin();

  const { toasts, showToast, dismissToast } = useToast();

  const tabs: { id: TabId; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen, badge: courses.length },
    { id: 'users', label: 'Users & Roles', icon: Users, badge: usersTotal || users.length },
    { id: 'announcements', label: 'Pengumuman', icon: Megaphone },
    { id: 'logs', label: 'Audit Logs', icon: ShieldAlert, badge: auditLogsTotal || auditLogs.length },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Admin Header */}
      <AdminHeader
        activeTab={activeTab}
        onRefresh={async () => {
          await refreshAll();
          showToast('Data refreshed successfully from Supabase', 'info');
        }}
      />

      {/* KPI Stats Cards */}
      <AdminStatsCards
        totalStudents={stats.totalStudents}
        totalCourses={stats.totalCourses}
        totalMentors={stats.totalMentors}
      />

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface border border-outline shadow-xs overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? 'bg-brand-500 text-white shadow-purple-glow'
                  : 'text-content-secondary hover:bg-surface-muted hover:text-content-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-meta px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-muted text-content-muted'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="animate-fade-in">
        {activeTab === 'overview' && (
          <AdminOverviewTab
            auditLogs={auditLogs}
            settings={settings}
            onNavigateTab={(tab) => setActiveTab(tab as TabId)}
          />
        )}

        {activeTab === 'courses' && (
          <AdminCoursesTab
            courses={courses}
            onTogglePublish={async (id) => {
              try {
                await toggleCoursePublish(id);
                showToast('Course publish status updated', 'success');
              } catch (err: any) {
                showToast(err?.message || 'Failed to update publish status', 'error');
              }
            }}
            onDeleteCourse={async (id) => {
              try {
                const res = await deleteCourse(id);
                if (res.success) {
                  showToast('Course deleted permanently from catalog', 'info');
                }
                return res;
              } catch (err: any) {
                showToast(err?.message || 'Failed to delete course', 'error');
                return { success: false, hasEnrollments: false, message: err?.message };
              }
            }}
            onAddCourse={async (newC) => {
              try {
                await addCourse(newC);
                showToast('New course created & published to Supabase!', 'success');
              } catch (err: any) {
                showToast(err?.message || 'Failed to create course', 'error');
                throw err;
              }
            }}
            onEditCourse={async (id, data) => {
              try {
                await editCourse(id, data);
                showToast('Course updated successfully!', 'success');
              } catch (err: any) {
                showToast(err?.message || 'Failed to update course', 'error');
                throw err;
              }
            }}
            onRefreshCourses={fetchCourses}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsersTab
            users={users}
            currentAdminId={currentAdminId}
            search={usersSearch}
            onSearchChange={setUsersSearch}
            roleFilter={usersRoleFilter}
            onRoleFilterChange={setUsersRoleFilter}
            statusFilter={usersStatusFilter}
            onStatusFilterChange={setUsersStatusFilter}
            page={usersPage}
            totalPages={usersTotalPages}
            totalUsers={usersTotal}
            onPageChange={setUsersPage}
            onUpdateRole={async (id, role) => {
              try {
                await updateUserRole(id, role);
                showToast(`User role updated to ${role}`, 'success');
              } catch (err: any) {
                showToast(err?.message || 'Failed to update role', 'error');
              }
            }}
            onToggleStatus={async (id) => {
              try {
                await toggleUserStatus(id);
                showToast('Account status updated successfully', 'info');
              } catch (err: any) {
                showToast(err?.message || 'Failed to update status', 'error');
              }
            }}
          />
        )}

        {activeTab === 'announcements' && (
          <AdminAnnouncementsTab onShowToast={showToast} />
        )}

        {activeTab === 'logs' && (
          <AdminAuditLogsTab
            logs={auditLogs}
            search={auditLogsSearch}
            onSearchChange={setAuditLogsSearch}
            page={auditLogsPage}
            totalPages={auditLogsTotalPages}
            totalLogs={auditLogsTotal}
            onPageChange={setAuditLogsPage}
          />
        )}

        {activeTab === 'settings' && (
          <AdminSettingsTab
            key={`${settings.platformName}-${settings.updatedAt}`}
            settings={settings}
            onSave={updateSettings}
            showToast={showToast}
          />
        )}
      </div>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
