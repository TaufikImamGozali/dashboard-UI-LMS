import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/Toast';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminStatsCards } from '../components/admin/AdminStatsCards';
import { AdminOverviewTab } from '../components/admin/AdminOverviewTab';
import { AdminCoursesTab } from '../components/admin/AdminCoursesTab';
import { AdminUsersTab } from '../components/admin/AdminUsersTab';
import { AdminAuditLogsTab } from '../components/admin/AdminAuditLogsTab';
import { AdminSettingsTab } from '../components/admin/AdminSettingsTab';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ShieldAlert,
  Settings as SettingsIcon,
} from 'lucide-react';

type TabId = 'overview' | 'courses' | 'users' | 'logs' | 'settings';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const {
    users,
    settings,
    auditLogs,
    courses,
    updateUserRole,
    toggleUserStatus,
    updateSettings,
    toggleCoursePublish,
    addCourse,
    deleteCourse,
  } = useAdmin();

  const { toasts, showToast, dismissToast } = useToast();

  const tabs: { id: TabId; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen, badge: courses.length },
    { id: 'users', label: 'Users & Roles', icon: Users, badge: users.length },
    { id: 'logs', label: 'Audit Logs', icon: ShieldAlert, badge: auditLogs.length },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  const totalStudents = users.filter((u) => u.role === 'student').length * 480 + 240;
  const totalMentors = users.filter((u) => u.role === 'mentor').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Admin Header */}
      <AdminHeader
        activeTab={activeTab}
        onRefresh={() => showToast('Data refreshed successfully', 'info')}
      />

      {/* KPI Stats Cards */}
      <AdminStatsCards
        totalStudents={totalStudents}
        totalCourses={courses.length}
        totalMentors={totalMentors || 3}
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
            onTogglePublish={(id) => {
              toggleCoursePublish(id);
              showToast('Course publish status updated', 'success');
            }}
            onDeleteCourse={(id) => {
              deleteCourse(id);
              showToast('Course removed from catalog', 'info');
            }}
            onAddCourse={(newC) => {
              addCourse(newC);
              showToast('New course created & published!', 'success');
            }}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsersTab
            users={users}
            onUpdateRole={(id, role) => {
              updateUserRole(id, role);
              showToast(`User role updated to ${role}`, 'success');
            }}
            onToggleStatus={(id) => {
              toggleUserStatus(id);
              showToast('Account status updated', 'info');
            }}
          />
        )}

        {activeTab === 'logs' && <AdminAuditLogsTab logs={auditLogs} />}

        {activeTab === 'settings' && (
          <AdminSettingsTab
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
