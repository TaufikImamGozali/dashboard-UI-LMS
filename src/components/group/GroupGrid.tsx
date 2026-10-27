import React from 'react';
import { SearchX, UsersRound } from 'lucide-react';
import type { Group } from '../../types/group';
import { EmptyState } from '../ui/EmptyState';
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
    return <EmptyState
      title={hasSearchOrFilter ? 'No groups found' : 'You have not joined a group yet'}
      description={hasSearchOrFilter ? 'Try changing your search, category, or sort options.' : 'Discover a community that matches what you want to learn.'}
      icon={hasSearchOrFilter ? <SearchX className="h-6 w-6" /> : <UsersRound className="h-6 w-6" />}
      actionLabel={isMyGroups && !hasSearchOrFilter ? 'Discover Groups' : undefined}
      onAction={isMyGroups && !hasSearchOrFilter ? onDiscover : undefined}
      className="min-h-72"
    />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {groups.map((group) => (
        <GroupCard key={group.id} group={group} onOpen={onOpen} onJoin={onJoin} />
      ))}
    </div>
  );
};
