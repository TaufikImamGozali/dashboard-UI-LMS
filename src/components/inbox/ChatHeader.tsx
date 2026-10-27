import React from 'react';
import { ArrowLeft, Info, Phone, Video } from 'lucide-react';
import type { Contact } from '../../types/message';

interface ChatHeaderProps {
  contact: Contact;
  isInfoOpen: boolean;
  onBack: () => void;
  onToggleInfo: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  contact,
  isInfoOpen,
  onBack,
  onToggleInfo,
}) => (
  <header className="flex h-chat-header shrink-0 items-center gap-3 border-b border-slate-100 px-4 sm:px-5">
    <button
      type="button"
      onClick={onBack}
      aria-label="Back to conversations"
      className="rounded-full p-2 text-slateText-secondary transition-colors hover:bg-brand-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 md:hidden"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
    <div className="relative shrink-0">
      <img height="160" width="160" loading="lazy" src={contact.avatar} alt={contact.name} className="h-10 w-10 rounded-full object-cover" />
      {contact.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-surface" />}
    </div>
    <div className="min-w-0 flex-1">
      <h2 className="truncate text-sm font-extrabold text-slateText-primary">{contact.name}</h2>
      <p className={`mt-0.5 text-meta font-medium ${contact.isOnline ? 'text-emerald-600' : 'text-slateText-muted'}`}>
        {contact.isOnline ? 'Online' : contact.lastSeen}
      </p>
    </div>
    <div className="flex items-center gap-1">
      <button type="button" aria-label={`Call ${contact.name}`} className="rounded-full p-2.5 text-slateText-muted transition-colors hover:bg-brand-50 hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
        <Phone className="h-4.5 w-4.5" />
      </button>
      <button type="button" aria-label={`Video call ${contact.name}`} className="hidden rounded-full p-2.5 text-slateText-muted transition-colors hover:bg-brand-50 hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 sm:block">
        <Video className="h-4.5 w-4.5" />
      </button>
      <button
        type="button"
        aria-label={`${isInfoOpen ? 'Close' : 'Open'} contact information`}
        aria-pressed={isInfoOpen}
        onClick={onToggleInfo}
        className={`rounded-full p-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
          isInfoOpen ? 'bg-brand-50 text-brand-500' : 'text-slateText-muted hover:bg-brand-50 hover:text-brand-500'
        }`}
      >
        <Info className="h-4.5 w-4.5" />
      </button>
    </div>
  </header>
);
