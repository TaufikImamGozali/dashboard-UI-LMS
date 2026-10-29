import React, { useState } from 'react';
import type { AdminAuditLog } from '../../types/admin';
import {
  Search,
  Code2,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface AdminAuditLogsTabProps {
  logs: AdminAuditLog[];
  search?: string;
  onSearchChange?: (val: string) => void;
  page?: number;
  totalPages?: number;
  totalLogs?: number;
  onPageChange?: (page: number) => void;
}

export const AdminAuditLogsTab: React.FC<AdminAuditLogsTabProps> = ({
  logs,
  search = '',
  onSearchChange,
  page = 1,
  totalPages = 1,
  totalLogs = logs.length,
  onPageChange,
}) => {
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `coursue_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getActionBadge = (action: string) => {
    if (action.includes('CREATE') || action.includes('ACTIVATE')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (action.includes('DELETE') || action.includes('SUSPEND')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (action.includes('SETTINGS') || action.includes('REORDER')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  return (
    <div className="space-y-5">
      {/* Search & Export Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative min-w-[240px] flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-content-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search action, actor, or entity..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-outline bg-surface text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-content-muted">
            Total recorded: <strong>{totalLogs}</strong>
          </span>
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-outline hover:bg-surface-muted text-content-primary font-semibold text-xs shrink-0 transition-all"
          >
            <Download className="w-4 h-4 text-content-secondary" />
            <span>Export (JSON)</span>
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl bg-surface border border-outline shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-muted border-b border-outline-subtle text-content-muted font-bold uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Action & Entity</th>
                <th className="px-4 py-3.5">Actor</th>
                <th className="px-4 py-3.5">Entity ID</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-subtle text-content-primary">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-content-muted">
                    No audit logs match query.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2.5 py-1 rounded-md font-mono font-bold text-meta border ${getActionBadge(
                            log.action
                          )}`}
                        >
                          {log.action}
                        </span>
                        <span className="font-mono text-content-secondary text-meta">
                          on <strong>{log.entityType}</strong>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-content-primary">
                      {log.actorName}{' '}
                      <span className="text-meta text-content-muted font-mono">
                        ({log.actorRole})
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-meta text-content-muted truncate max-w-[120px]">
                      {log.entityId}
                    </td>
                    <td className="px-4 py-4 text-content-secondary font-mono text-[11px]">
                      {log.createdAt}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline hover:border-brand-500 hover:text-brand-600 font-semibold text-meta bg-surface transition-all"
                      >
                        <Code2 className="w-3.5 h-3.5 text-brand-500" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
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

      {/* Inspect JSON Details Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-modal bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-xl bg-surface rounded-3xl p-6 border border-outline shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-subtle mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                <h3 className="text-sm font-bold text-content-primary">
                  Audit Log Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-full hover:bg-surface-muted text-content-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs mb-4">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-surface-muted">
                <div>
                  <span className="text-content-muted block text-meta">Action:</span>
                  <span className="font-mono font-bold text-content-primary">
                    {selectedLog.action}
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block text-meta">Entity:</span>
                  <span className="font-mono font-semibold text-content-primary">
                    {selectedLog.entityType} ({selectedLog.entityId})
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block text-meta">Actor:</span>
                  <span className="font-semibold text-content-primary">
                    {selectedLog.actorName} ({selectedLog.actorRole})
                  </span>
                </div>
                <div>
                  <span className="text-content-muted block text-meta">Recorded At:</span>
                  <span className="font-mono text-content-secondary">
                    {selectedLog.createdAt}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-content-muted font-bold block mb-1">
                  Metadata JSON:
                </span>
                <pre className="p-3.5 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-56">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-full bg-brand-500 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
