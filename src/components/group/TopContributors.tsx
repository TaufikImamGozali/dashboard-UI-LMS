import React from 'react';
import { Award } from 'lucide-react';
import type { Member } from '../../types/group';

interface TopContributorsProps {
  members: Member[];
}

export const TopContributors: React.FC<TopContributorsProps> = ({ members }) => {
  const topMembers = [...members].sort((a, b) => b.contributions - a.contributions).slice(0, 3);
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
      <div className="flex items-center gap-2"><Award className="h-4 w-4 text-amber-500" /><h2 className="text-sm font-extrabold text-slateText-primary">Top Contributors</h2></div>
      <div className="mt-4 space-y-3">
        {topMembers.map((member, index) => (
          <div key={member.id} className="flex items-center gap-3">
            <span className="w-4 text-center text-xs font-extrabold text-slateText-muted">{index + 1}</span>
            <img src={member.avatar} alt={member.name} className="h-9 w-9 rounded-full object-cover" />
            <div className="min-w-0 flex-1"><p className="truncate text-xs font-bold text-slateText-primary">{member.name}</p><p className="text-[10px] text-slateText-muted">{member.role}</p></div>
            <span className="rounded-full bg-brand-50 px-2 py-1 text-[10px] font-bold text-brand-600">{member.contributions}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
