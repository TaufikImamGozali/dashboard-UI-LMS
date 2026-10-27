import React from 'react';
import { ShieldCheck, Eye, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  activeTab: string;
  onRefresh?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onRefresh }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-outline-subtle">
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-brand-100 text-brand-600 border border-brand-200 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
            ADMIN CONSOLE
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Database RLS Active
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
          Platform Administration
        </h1>
        <p className="text-sm text-content-secondary mt-1">
          Full oversight of courses, user privileges, security audit logs, and global platform configuration.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="p-2.5 rounded-full border border-outline hover:bg-surface-muted text-content-secondary transition-colors"
            title="Refresh Data"
            aria-label="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-outline hover:border-brand-300 hover:bg-brand-50/50 text-content-primary font-semibold text-sm transition-all shadow-xs"
        >
          <Eye className="w-4 h-4 text-brand-500" />
          <span>View Student LMS</span>
        </button>
      </div>
    </div>
  );
};
