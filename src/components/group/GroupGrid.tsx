import React from 'react';
import { SearchX, UsersRound } from 'lucide-react';
import type { Group } from '../../types/group';
import { GroupCard } from './GroupCard';

interface GroupGridProps {
  groups: Group[];
  isMyGroups: boolean;
  hasSearchOrFilter: boolean;
  onOpen: (groupId: string) => void;
  onJoin: (groupId: string) => void;
  onDiscover: () => void;
}

export const GroupGrid: React.FC<GroupGridProps> = ({ groups, isMyGroups, hasSearchOrFilter, onOpen, onJoin, onDiscover }) => {
  if (groups.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white px-6 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
          {hasSearchOrFilter ? <SearchX className="h-6 w-6" /> : <UsersRound className="h-6 w-6" />}
        </span>
        <h2 className="text-base font-extrabold text-slateText-primary">
          {hasSearchOrFilter ? 'No groups found' : 'You have not joined a group yet'}
        </h2>
        <p className="mt-2 max-w-sm text-sm text-slateText-muted">
          {hasSearchOrFilter ? 'Try changing your search, category, or sort options.' : 'Discover a community that matches what you want to learn.'}
        </p>
        {isMyGroups && !hasSearchOrFilter && (
          <button type="button" onClick={onDiscover} className="mt-5 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2">
            Discover Groups
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} onOpen={onOpen} onJoin={onJoin} />
      ))}
    </div>
  );
};
