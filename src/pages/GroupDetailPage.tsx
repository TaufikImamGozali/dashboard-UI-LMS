import React, { useState } from 'react';
import { CalendarDays, ChevronLeft, Info, ShieldCheck } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/group/ConfirmDialog';
import { DiscussionPost } from '../components/group/DiscussionPost';
import { GroupHeader } from '../components/group/GroupHeader';
import { GroupTabs } from '../components/group/GroupTabs';
import { MemberCard } from '../components/group/MemberCard';
import { PostComposer } from '../components/group/PostComposer';
import { ResourceItem } from '../components/group/ResourceItem';
import { TopContributors } from '../components/group/TopContributors';
import { UpcomingSessionCard } from '../components/group/UpcomingSessionCard';
import { ToastContainer } from '../components/task/Toast';
import { useGroups } from '../hooks/useGroups';
import { useToast } from '../hooks/useToast';
import type { GroupDetailTab } from '../types/group';

export const GroupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { groups, joinGroup, leaveGroup, addPost, toggleLike, addComment, setReminder } = useGroups();
  const { toasts, showToast, dismissToast } = useToast();
  const [activeTab, setActiveTab] = useState<GroupDetailTab>('discussion');
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const group = groups.find((item) => item.id === id);

  if (!group) {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white px-6 text-center shadow-card">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-500"><Info className="h-7 w-7" /></span>
        <h1 className="mt-5 text-2xl font-extrabold text-slateText-primary">Group not found</h1>
        <p className="mt-2 text-sm text-slateText-muted">This group may have been removed or the link is incorrect.</p>
        <button type="button" onClick={() => navigate('/group')} className="mt-6 flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"><ChevronLeft className="h-4 w-4" /> Back to Groups</button>
      </div>
    );
  }

  const handleInvite = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('Invite link copied!', 'success');
    } catch {
      showToast('Unable to copy the invite link.', 'error');
    }
  };

  const handleJoin = () => {
    joinGroup(group.id);
    showToast('You joined the group!', 'success');
  };

  const handleLeave = () => {
    leaveGroup(group.id);
    setLeaveDialogOpen(false);
    showToast('You left the group.', 'delete');
  };

  return (
    <div className="space-y-6">
      <GroupHeader group={group} onBack={() => navigate('/group')} onJoin={handleJoin} onLeave={() => setLeaveDialogOpen(true)} onInvite={handleInvite} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <main className="min-w-0 space-y-5 xl:col-span-8">
          <div className="rounded-3xl border border-slate-100 bg-white px-4 shadow-card sm:px-5">
            <GroupTabs
              ariaLabel="Group content"
              tabs={[
                { id: 'discussion', label: 'Discussion', count: group.posts.length },
                { id: 'members', label: 'Members', count: group.totalMembers },
                { id: 'resources', label: 'Resources', count: group.resources.length },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>

          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <PostComposer disabled={!group.isJoined} onPost={(content) => { addPost(group.id, content); showToast('Discussion posted!', 'success'); }} />
              {group.posts.map((post) => (
                <DiscussionPost key={post.id} post={post} onToggleLike={() => toggleLike(group.id, post.id)} onAddComment={(content) => addComment(group.id, post.id, content)} />
              ))}
              {group.posts.length === 0 && <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slateText-muted">No discussions yet. Start the first conversation.</div>}
            </div>
          )}

          {activeTab === 'members' && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {group.members.map((member) => <MemberCard key={member.id} member={member} onMessage={() => navigate('/inbox')} />)}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-3">
              {group.resources.map((resource) => <ResourceItem key={resource.id} resource={resource} onDownload={() => showToast(`Mock download started for ${resource.name}`, 'success')} />)}
              {group.resources.length === 0 && <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slateText-muted">No resources have been shared yet.</div>}
            </div>
          )}
        </main>

        <aside className="space-y-5 xl:col-span-4">
          <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
            <h2 className="text-sm font-extrabold text-slateText-primary">About</h2>
            <p className="mt-3 text-xs leading-relaxed text-slateText-secondary">{group.about}</p>
            <p className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slateText-muted"><CalendarDays className="h-4 w-4 text-brand-500" /> Created {new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(group.createdAt))}</p>
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h3 className="flex items-center gap-2 text-xs font-extrabold text-slateText-primary"><ShieldCheck className="h-4 w-4 text-brand-500" /> Group Rules</h3>
              <ol className="mt-3 space-y-2">
                {group.rules.map((rule, index) => <li key={rule} className="flex gap-2 text-[11px] leading-relaxed text-slateText-secondary"><span className="font-extrabold text-brand-500">{index + 1}.</span>{rule}</li>)}
              </ol>
            </div>
          </section>
          <UpcomingSessionCard session={group.upcomingSession} onToggleReminder={() => setReminder(group.id)} />
          <TopContributors members={group.members} />
        </aside>
      </div>

      {leaveDialogOpen && <ConfirmDialog title="Leave this group?" message={`You will leave ${group.name} and it will be removed from My Groups. You can join again later.`} confirmLabel="Leave Group" onConfirm={handleLeave} onCancel={() => setLeaveDialogOpen(false)} />}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};
