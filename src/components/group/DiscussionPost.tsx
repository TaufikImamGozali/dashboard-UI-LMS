import React, { useState } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import type { Post } from '../../types/group';
import { CommentList } from './CommentList';

interface DiscussionPostProps {
  post: Post;
  onToggleLike: () => void;
  onAddComment: (content: string) => void;
}

const relativeTime = (timestamp: string) => {
  const elapsed = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
};

export const DiscussionPost: React.FC<DiscussionPostProps> = ({ post, onToggleLike, onAddComment }) => {
  const [commentsOpen, setCommentsOpen] = useState(false);
  return (
    <article className="rounded-3xl border border-slate-100 bg-surface p-5 shadow-card">
      <div className="flex items-start gap-3">
        <img height="160" width="160" loading="lazy" src={post.author.avatar} alt={post.author.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <h3 className="text-sm font-extrabold text-slateText-primary">{post.author.name}</h3>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-micro font-bold uppercase text-brand-600">{post.author.role}</span>
            <time dateTime={post.createdAt} className="text-micro text-slateText-muted">{relativeTime(post.createdAt)}</time>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slateText-secondary">{post.content}</p>
          <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
            <button type="button" aria-pressed={post.isLiked} onClick={onToggleLike} className={`flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${post.isLiked ? 'text-rose-500' : 'text-slateText-muted hover:text-rose-500'}`}>
              <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likes}
            </button>
            <button type="button" onClick={() => setCommentsOpen((current) => !current)} aria-expanded={commentsOpen} className="flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-bold text-slateText-muted hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
              <MessageCircle className="h-4 w-4" /> {post.comments.length}
            </button>
          </div>
          {commentsOpen && <CommentList comments={post.comments} onAddComment={onAddComment} />}
        </div>
      </div>
    </article>
  );
};
