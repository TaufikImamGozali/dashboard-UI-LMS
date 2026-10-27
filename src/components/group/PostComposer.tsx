import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { currentUser } from '../../data/mockData';

interface PostComposerProps {
  onPost: (content: string) => void;
  disabled?: boolean;
}

export const PostComposer: React.FC<PostComposerProps> = ({ onPost, disabled = false }) => {
  const [content, setContent] = useState('');
  const submit = () => {
    if (!content.trim() || disabled) return;
    onPost(content.trim());
    setContent('');
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-card sm:p-5">
      <div className="flex items-start gap-3">
        <img src={currentUser.avatar} alt={currentUser.name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
        <label className="min-w-0 flex-1">
          <span className="sr-only">Start a discussion</span>
          <textarea rows={2} value={content} onChange={(event) => setContent(event.target.value)} placeholder={disabled ? 'Join this group to start a discussion' : 'Start a discussion...'} disabled={disabled} className="w-full resize-none rounded-2xl border border-transparent bg-brand-surface px-4 py-3 text-sm text-slateText-primary outline-none placeholder:text-slateText-muted focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:opacity-70" />
        </label>
      </div>
      <div className="mt-3 flex justify-end">
        <button type="button" onClick={submit} disabled={!content.trim() || disabled} className="flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-brand-200"><Send className="h-3.5 w-3.5" /> Post</button>
      </div>
    </div>
  );
};
