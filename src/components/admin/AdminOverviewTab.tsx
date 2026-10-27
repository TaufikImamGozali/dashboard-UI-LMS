import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { AdminAuditLog, PlatformSettings } from '../../types/admin';
import { ShieldCheck, Database, Server, Clock, ArrowRight } from 'lucide-react';

interface AdminOverviewTabProps {
  auditLogs: AdminAuditLog[];
  settings: PlatformSettings;
  onNavigateTab: (tabId: string) => void;
}

const enrollmentData = [
  { month: 'May', students: 180, revenue: 14200 },
  { month: 'Jun', students: 240, revenue: 18900 },
  { month: 'Jul', students: 310, revenue: 22400 },
  { month: 'Aug', students: 290, revenue: 21100 },
  { month: 'Sep', students: 380, revenue: 27500 },
  { month: 'Oct', students: 420, revenue: 28450 },
];

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  auditLogs,
  settings,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Top row: Chart + Security Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Growth Chart */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-surface border border-outline shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-lg font-bold text-content-primary">
                Student Enrollment & Activity Growth
              </h3>
              <p className="text-xs text-content-muted">
                Monthly new enrollments across design, branding, and front-end courses
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-content-secondary">
                <span className="w-3 h-3 rounded-md bg-brand-500" />
                New Students
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(108, 92, 231, 0.06)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-surface p-3 rounded-xl border border-outline shadow-card text-xs">
                        <p className="font-bold text-content-primary mb-1">{data.month} 2026</p>
                        <p className="text-brand-500 font-semibold">
                          Students: {data.students}
                        </p>
                        <p className="text-content-muted">
                          Revenue: ${data.revenue.toLocaleString()}
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="students" fill="#6C5CE7" radius={[8, 8, 0, 0]} maxBarSize={44} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Supabase & Security Architecture status */}
        <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-outline shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-content-primary">
                Database & Security Status
              </h3>
            </div>

            <p className="text-xs text-content-secondary leading-relaxed mb-4">
              Configured per Supabase SQL migration: role-based guard triggers, audit logging, and singleton platform settings.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-surface-muted border border-outline-subtle flex items-center justify-between text-xs">
                <span className="font-medium text-content-secondary flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  profiles.role check
                </span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Guarded
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-muted border border-outline-subtle flex items-center justify-between text-xs">
                <span className="font-medium text-content-secondary flex items-center gap-2">
                  <Server className="w-4 h-4 text-brand-500" />
                  Audit Logging Table
                </span>
                <span className="font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                  Enabled
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-muted border border-outline-subtle flex items-center justify-between text-xs">
                <span className="font-medium text-content-secondary flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Maintenance Mode
                </span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${settings.maintenanceMode ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                  {settings.maintenanceMode ? 'Active' : 'Off'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-outline-subtle flex items-center justify-between">
            <span className="text-xs text-content-muted">Max upload: {settings.maxUploadSizeMb} MB</span>
            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1"
            >
              Configure <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Audit Activities Preview */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-outline shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-content-primary">
              Recent Admin & Security Audit Logs
            </h3>
            <p className="text-xs text-content-muted">
              Live feed of administrative actions tracked in the audit trail
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('logs')}
            className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1"
          >
            View All ({auditLogs.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-outline-subtle">
          {auditLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 rounded-md font-mono font-bold text-meta bg-brand-50 text-brand-600 border border-brand-100">
                  {log.action}
                </span>
                <span className="text-content-primary font-medium">
                  {log.actorName} performed on <code className="text-content-secondary font-mono">{log.entityType}</code>
                </span>
              </div>
              <span className="text-content-muted shrink-0">{log.createdAt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
