import React from 'react';
import { Activity, LockKeyhole, Users } from 'lucide-react';
import { TagBadge } from '../ui/TagBadge';
import type { Group } from '../../types/group';

interface GroupCardProps {
  group: Group;
  onOpen: (groupId: string) => void;
  onJoin: (groupId: string) => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({ group, onOpen, onJoin }) => {
  const remainingMembers = Math.max(0, group.totalMembers - 4);

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-100 bg-surface shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-soft">
      <div className={`relative h-28 bg-gradient-to-br ${group.coverClass}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-slateText-primary/20 to-transparent" />
        <span className="absolute bottom-4 left-5 flex h-12 min-w-12 items-center justify-center rounded-2xl bg-surface/90 px-3 text-lg font-extrabold text-brand-600 shadow-soft backdrop-blur-sm">
          {group.icon}
        </span>
        {group.privacy === 'Private' && (
          <span className="absolute right-4 top-4 rounded-full bg-surface/90 p-2 text-slateText-secondary shadow-xs" title="Private group">
            <LockKeyhole className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      <div className="p-5">
        <TagBadge category={group.category} label={group.categoryLabel} />
        <h2 className="mt-3 truncate text-base font-extrabold text-slateText-primary">{group.name}</h2>
        <p className="mt-1.5 line-clamp-2 min-h-10 text-xs leading-relaxed text-slateText-secondary">
          {group.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex min-w-0 items-center">
            <div className="flex -space-x-2">
              {group.members.slice(0, 4).map((member) => (
                <img height="160" width="160" loading="lazy" key={member.id} src={member.avatar} alt={member.name} title={member.name} className="h-7 w-7 rounded-full object-cover ring-2 ring-surface" />
              ))}
              {remainingMembers > 0 && (
                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-100 px-1 text-micro font-extrabold text-brand-600 ring-2 ring-surface">
                  +{remainingMembers}
                </span>
              )}
            </div>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-micro font-semibold text-slateText-muted">
            <Users className="h-3.5 w-3.5" /> {group.totalMembers}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-1.5 truncate text-meta font-semibold text-emerald-600">
            <Activity className="h-3.5 w-3.5" /> {group.newPosts} new posts
          </span>
          <button
            type="button"
            onClick={() => (group.isJoined ? onOpen(group.id) : onJoin(group.id))}
            className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 ${
              group.isJoined
                ? 'bg-brand-50 text-brand-600 hover:bg-brand-100'
                : 'bg-brand-500 text-white hover:bg-brand-600'
            }`}
          >
            {group.isJoined ? 'Open' : 'Join'}
          </button>
        </div>
      </div>
    </article>
  );
};
