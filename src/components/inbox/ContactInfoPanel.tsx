import React from 'react';
import { BellOff, ExternalLink, FileText, ShieldBan, X } from 'lucide-react';
import type { Contact } from '../../types/message';

interface ContactInfoPanelProps {
  contact: Contact;
  onClose: () => void;
  className?: string;
}

const formatSize = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

export const ContactInfoPanel: React.FC<ContactInfoPanelProps> = ({ contact, onClose, className = '' }) => (
  <aside className={`flex min-h-0 w-[280px] shrink-0 flex-col border-l border-slate-100 bg-white ${className}`} aria-label="Contact information">
    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
      <h2 className="text-sm font-extrabold text-slateText-primary">Contact Info</h2>
      <button type="button" onClick={onClose} aria-label="Close contact information" className="rounded-full p-2 text-slateText-muted transition-colors hover:bg-brand-surface hover:text-slateText-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
        <X className="h-4 w-4" />
      </button>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto p-5">
      <div className="text-center">
        <div className="relative mx-auto w-fit">
          <img src={contact.avatar} alt={contact.name} className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-50" />
          {contact.isOnline && <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />}
        </div>
        <h3 className="mt-3 text-base font-extrabold text-slateText-primary">{contact.name}</h3>
        <p className="mt-1 text-xs font-semibold text-brand-500">{contact.role}</p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button type="button" className="flex items-center justify-center gap-2 rounded-xl bg-brand-surface px-3 py-2.5 text-xs font-bold text-slateText-secondary transition-colors hover:bg-brand-50 hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
          <BellOff className="h-4 w-4" /> Mute
        </button>
        <button type="button" className="flex items-center justify-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-xs font-bold text-rose-500 transition-colors hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400">
          <ShieldBan className="h-4 w-4" /> Block
        </button>
      </div>

      <section className="mt-7">
        <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slateText-muted">Shared Files</h4>
        <div className="space-y-2">
          {contact.sharedFiles.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl bg-brand-surface p-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <FileText className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold text-slateText-primary">{item.name}</span>
                <span className="text-[10px] text-slateText-muted">{formatSize(item.size)}</span>
              </span>
            </div>
          ))}
          {contact.sharedFiles.length === 0 && <p className="text-xs text-slateText-muted">No shared files yet.</p>}
        </div>
      </section>

      <section className="mt-7">
        <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-slateText-muted">Shared Links</h4>
        <div className="space-y-2">
          {contact.sharedLinks.map((link) => (
            <a key={link.id} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-xl p-2 text-xs font-semibold text-slateText-secondary transition-colors hover:bg-brand-surface hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{link.title}</span>
            </a>
          ))}
          {contact.sharedLinks.length === 0 && <p className="text-xs text-slateText-muted">No shared links yet.</p>}
        </div>
      </section>
    </div>
  </aside>
);
