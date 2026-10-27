import React from 'react';
import { Download, ExternalLink, FileText, Link2 } from 'lucide-react';
import type { Resource } from '../../types/group';

interface ResourceItemProps {
  resource: Resource;
  onDownload: () => void;
}

const formatSize = (bytes?: number) => {
  if (!bytes) return 'External link';
  return bytes < 1_048_576 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1_048_576).toFixed(1)} MB`;
};

export const ResourceItem: React.FC<ResourceItemProps> = ({ resource, onDownload }) => (
  <article className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-card">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
      {resource.type === 'file' ? <FileText className="h-5 w-5" /> : <Link2 className="h-5 w-5" />}
    </span>
    <div className="min-w-0 flex-1">
      <h3 className="truncate text-sm font-extrabold text-slateText-primary">{resource.name}</h3>
      <p className="mt-1 truncate text-[10px] text-slateText-muted">{formatSize(resource.size)} · Shared by {resource.uploadedBy} · {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(resource.uploadedAt))}</p>
    </div>
    {resource.type === 'link' ? (
      <a href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${resource.name}`} className="rounded-full p-2.5 text-slateText-muted hover:bg-brand-50 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"><ExternalLink className="h-4 w-4" /></a>
    ) : (
      <button type="button" onClick={onDownload} aria-label={`Download ${resource.name}`} className="rounded-full p-2.5 text-slateText-muted hover:bg-brand-50 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"><Download className="h-4 w-4" /></button>
    )}
  </article>
);
