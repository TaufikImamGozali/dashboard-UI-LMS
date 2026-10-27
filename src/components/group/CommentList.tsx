import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { currentUser } from '../../data/mockData';
import type { Comment } from '../../types/group';

interface CommentListProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
}

const relativeTime = (timestamp: string) => {
  const elapsed = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(elapsed / 3_600_000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const CommentList: React.FC<CommentListProps> = ({ comments, onAddComment }) => {
  const [value, setValue] = useState('');
  const submit = () => {
    if (!value.trim()) return;
    onAddComment(value.trim());
    setValue('');
  };

  return (
    <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-2.5">
          <img src={comment.author.avatar} alt={comment.author.name} className="h-8 w-8 shrink-0 rounded-full object-cover" />
          <div className="min-w-0 rounded-2xl rounded-tl-md bg-brand-surface px-3.5 py-2.5">
            <div className="flex flex-wrap items-center gap-x-2">
              <span className="text-xs font-extrabold text-slateText-primary">{comment.author.name}</span>
              <time className="text-[10px] text-slateText-muted" dateTime={comment.createdAt}>{relativeTime(comment.createdAt)}</time>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-slateText-secondary">{comment.content}</p>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-2 pt-1">
        <img src={currentUser.avatar} alt="Your avatar" className="h-8 w-8 shrink-0 rounded-full object-cover" />
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Write a comment</span>
          <input value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); submit(); } }} placeholder="Write a comment..." className="w-full rounded-full bg-brand-surface py-2.5 pl-4 pr-10 text-xs text-slateText-primary outline-none placeholder:text-slateText-muted focus:ring-2 focus:ring-brand-300" />
          <button type="button" onClick={submit} disabled={!value.trim()} aria-label="Post comment" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 text-brand-500 hover:bg-brand-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:text-slateText-light"><Send className="h-3.5 w-3.5" /></button>
        </label>
      </div>
    </div>
  );
};
