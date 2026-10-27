import React, { useState, useMemo } from 'react';
import type { AdminAuditLog } from '../../types/admin';
import { Search, ShieldAlert, Code2, X, Download } from 'lucide-react';

interface AdminAuditLogsTabProps {
  logs: AdminAuditLog[];
}

export const AdminAuditLogsTab: React.FC<AdminAuditLogsTabProps> = ({ logs }) => {
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchSearch =
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.actorName.toLowerCase().includes(search.toLowerCase()) ||
        log.entityType.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [logs, search]);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `coursue_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, or entity..."
            className="w-full pl-10 pr-4 py-2 rounded-full border border-outline bg-surface text-xs focus:border-brand-500 focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleExportJSON}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-outline hover:bg-surface-muted text-content-primary font-semibold text-xs shrink-0 transition-all"
        >
          <Download className="w-4 h-4 text-content-secondary" />
          <span>Export Logs (JSON)</span>
        </button>
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
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-content-muted">
                    No audit logs match query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <span className="px-2.5 py-1 rounded-md font-mono font-bold text-meta bg-purple-50 text-purple-700 border border-purple-200">
                          {log.action}
                        </span>
                        <span className="font-mono text-content-secondary text-meta">
                          on <strong>{log.entityType}</strong>
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-content-primary">
                      {log.actorName} <span className="text-meta text-content-muted font-mono">({log.actorRole})</span>
                    </td>
                    <td className="px-4 py-4 font-mono text-meta text-content-muted">
                      {log.entityId}
                    </td>
                    <td className="px-4 py-4 text-content-secondary">
                      {log.createdAt}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-outline hover:border-brand-300 hover:bg-brand-50/40 text-brand-600 font-semibold text-meta transition-all"
                      >
                        <Code2 className="w-3.5 h-3.5" /> View JSON
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Viewer Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 z-modal bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedLog(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="log-detail-title"
            className="w-full max-w-lg bg-surface rounded-3xl p-6 border border-outline shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-outline-subtle mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-500 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 id="log-detail-title" className="text-sm font-bold text-content-primary">
                    Audit Log Details ({selectedLog.id})
                  </h3>
                  <p className="text-meta text-content-muted">{selectedLog.action}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="p-1.5 rounded-full hover:bg-surface-muted text-content-muted"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-80 leading-relaxed shadow-inner">
              <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-outline-subtle">
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
