import React from 'react';
import { ArrowLeft, LockKeyhole, UserPlus, Users } from 'lucide-react';
import { CategoryBadge } from '../CategoryBadge';
import type { Group } from '../../types/group';

interface GroupHeaderProps {
  group: Group;
  onBack: () => void;
  onJoin: () => void;
  onLeave: () => void;
  onInvite: () => void;
}

export const GroupHeader: React.FC<GroupHeaderProps> = ({ group, onBack, onJoin, onLeave, onInvite }) => (
  <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
    <div className={`relative h-40 bg-gradient-to-br sm:h-48 ${group.coverClass}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-slateText-primary/35 to-transparent" />
      <button type="button" onClick={onBack} aria-label="Back to study groups" className="absolute left-4 top-4 rounded-full bg-white/90 p-2.5 text-slateText-secondary shadow-soft backdrop-blur-sm hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <ArrowLeft className="h-5 w-5" />
      </button>
      {group.privacy === 'Private' && (
        <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-2 text-[11px] font-bold text-slateText-secondary shadow-soft backdrop-blur-sm"><LockKeyhole className="h-3.5 w-3.5" /> Private</span>
      )}
    </div>
    <div className="relative px-5 pb-5 sm:px-7 sm:pb-7">
      <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 items-end gap-4">
          <span className="flex h-20 min-w-20 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-white px-3 text-2xl font-extrabold text-brand-600 shadow-card">
            {group.icon}
          </span>
          <div className="min-w-0 pb-1">
            <CategoryBadge category={group.category} label={group.categoryLabel} />
            <h1 className="mt-2 truncate text-xl font-extrabold tracking-tight text-slateText-primary sm:text-2xl">{group.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slateText-muted"><Users className="h-3.5 w-3.5" /> {group.totalMembers} members</p>
          </div>
        </div>
        <div className="flex gap-2 sm:pb-1">
          <button type="button" onClick={onInvite} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-xs font-bold text-slateText-secondary hover:bg-brand-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 sm:flex-none"><UserPlus className="h-4 w-4" /> Invite</button>
          <button type="button" onClick={group.isJoined ? onLeave : onJoin} className={`flex-1 rounded-full px-5 py-2.5 text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 sm:flex-none ${group.isJoined ? 'bg-brand-50 text-brand-600 hover:bg-brand-100' : 'bg-brand-500 text-white hover:bg-brand-600'}`}>
            {group.isJoined ? 'Leave' : 'Join Group'}
          </button>
        </div>
      </div>
    </div>
  </section>
);
