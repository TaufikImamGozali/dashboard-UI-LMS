import React from 'react';
import { MessageCircle } from 'lucide-react';
import type { Member } from '../../types/group';

interface MemberCardProps {
  member: Member;
  onMessage: () => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member, onMessage }) => (
  <article className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-surface p-4 shadow-card">
    <img height="160" width="160" loading="lazy" src={member.avatar} alt={member.name} className="h-11 w-11 shrink-0 rounded-full object-cover" />
    <div className="min-w-0 flex-1">
      <h3 className="truncate text-sm font-extrabold text-slateText-primary">{member.name}</h3>
      <p className="mt-0.5 text-meta font-semibold text-brand-500">{member.role}</p>
    </div>
    <button type="button" onClick={onMessage} aria-label={`Message ${member.name}`} className="rounded-full bg-brand-50 p-2.5 text-brand-600 hover:bg-brand-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"><MessageCircle className="h-4 w-4" /></button>
  </article>
);
