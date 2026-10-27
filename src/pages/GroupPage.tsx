import React, { useMemo, useState } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CreateGroupModal } from '../components/group/CreateGroupModal';
import { GroupGrid } from '../components/group/GroupGrid';
import { GroupTabs } from '../components/group/GroupTabs';
import { ToastContainer } from '../components/task/Toast';
import { useGroups } from '../hooks/useGroups';
import { useToast } from '../hooks/useToast';
import type { CategoryType } from '../types';
import type { GroupListTab, GroupSort, NewGroupForm } from '../types/group';

type CategoryFilter = 'all' | CategoryType;

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'design', label: 'UI/UX Design' },
  { value: 'branding', label: 'Branding' },
  { value: 'frontend', label: 'Front End' },
];

const validTab = (value: string | null): GroupListTab => value === 'discover' ? 'discover' : 'my-groups';
const validCategory = (value: string | null): CategoryFilter =>
  value === 'design' || value === 'branding' || value === 'frontend' ? value : 'all';
const validSort = (value: string | null): GroupSort =>
  value === 'newest' || value === 'members' ? value : 'active';

export const GroupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { groups, joinGroup, createGroup } = useGroups();
  const { toasts, showToast, dismissToast } = useToast();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const tab = validTab(searchParams.get('tab'));
  const query = searchParams.get('q') ?? '';
  const category = validCategory(searchParams.get('category'));
  const sort = validSort(searchParams.get('sort'));
  const joinedCount = groups.filter((group) => group.isJoined).length;
  const discoverCount = groups.filter((group) => !group.isJoined).length;

  const updateParam = (key: string, value: string, defaultValue?: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === defaultValue) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const visibleGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return groups
      .filter((group) => tab === 'my-groups' ? group.isJoined : !group.isJoined)
      .filter((group) => category === 'all' || group.category === category)
      .filter((group) => !normalizedQuery || group.name.toLowerCase().includes(normalizedQuery) || group.description.toLowerCase().includes(normalizedQuery))
      .sort((a, b) => {
        if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sort === 'members') return b.totalMembers - a.totalMembers;
        return b.newPosts - a.newPosts;
      });
  }, [category, groups, query, sort, tab]);

  const handleJoin = (groupId: string) => {
    joinGroup(groupId);
    updateParam('tab', 'my-groups', 'my-groups');
    showToast('You joined the group!', 'success');
  };

  const handleCreate = (form: NewGroupForm) => {
    createGroup(form);
    setCreateModalOpen(false);
    const next = new URLSearchParams();
    setSearchParams(next, { replace: true });
    showToast('Group created successfully!', 'success');
  };

  return (
    <div className="pb-20 md:pb-0">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slateText-primary sm:text-3xl">Study Groups</h1>
          <p className="mt-2 text-sm text-slateText-muted">Learn together, exchange feedback, and make consistent progress.</p>
        </div>
        <button type="button" onClick={() => setCreateModalOpen(true)} className="hidden shrink-0 items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-purple-glow hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 md:flex"><Plus className="h-4 w-4" /> Create Group</button>
      </header>

      <section className="rounded-3xl border border-slate-100 bg-white p-4 shadow-card sm:p-5">
        <GroupTabs
          ariaLabel="Group collection"
          tabs={[{ id: 'my-groups', label: 'My Groups', count: joinedCount }, { id: 'discover', label: 'Discover', count: discoverCount }]}
          activeTab={tab}
          onChange={(value) => updateParam('tab', value, 'my-groups')}
        />

        <div className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">Search groups</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slateText-muted" />
              <input type="search" value={query} onChange={(event) => updateParam('q', event.target.value)} placeholder="Search study groups..." className="w-full rounded-full bg-brand-surface py-3 pl-11 pr-4 text-sm text-slateText-primary outline-none placeholder:text-slateText-muted focus:ring-2 focus:ring-brand-300" />
            </label>
            <label className="relative shrink-0">
              <span className="sr-only">Sort groups</span>
              <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slateText-muted" />
              <select value={sort} onChange={(event) => updateParam('sort', event.target.value, 'active')} className="w-full appearance-none rounded-full border border-slate-200 bg-white py-3 pl-10 pr-9 text-xs font-bold text-slateText-secondary outline-none focus:border-brand-300 focus:ring-2 focus:ring-brand-100 lg:w-auto">
                <option value="active">Most Active</option><option value="newest">Newest</option><option value="members">Most Members</option>
              </select>
            </label>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar" aria-label="Filter by category">
            {CATEGORIES.map((item) => (
              <button key={item.value} type="button" aria-pressed={category === item.value} onClick={() => updateParam('category', item.value, 'all')} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${category === item.value ? 'bg-brand-500 text-white' : 'bg-brand-surface text-slateText-secondary hover:bg-brand-50 hover:text-brand-600'}`}>{item.label}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-6">
        <GroupGrid groups={visibleGroups} isMyGroups={tab === 'my-groups'} hasSearchOrFilter={Boolean(query.trim()) || category !== 'all'} onOpen={(id) => navigate(`/group/${id}`)} onJoin={handleJoin} onDiscover={() => updateParam('tab', 'discover', 'my-groups')} />
      </div>

      <button type="button" onClick={() => setCreateModalOpen(true)} aria-label="Create group" className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-purple-glow hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 md:hidden"><Plus className="h-6 w-6" /></button>
      {createModalOpen && <CreateGroupModal onClose={() => setCreateModalOpen(false)} onSubmit={handleCreate} />}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
