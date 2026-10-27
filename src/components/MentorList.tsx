import React from 'react';
import { Plus, UserPlus, Check } from 'lucide-react';
import type { Mentor } from '../types';

interface MentorListProps {
  mentors: Mentor[];
  onToggleFollow: (id: string) => void;
  onAddMentor?: () => void;
  onSeeAllMentors?: () => void;
}

export const MentorList: React.FC<MentorListProps> = ({
  mentors,
  onToggleFollow,
  onAddMentor,
  onSeeAllMentors,
}) => {
  return (
    <div className="bg-white rounded-[26px] p-6 border border-[#EEF0F6] shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-slateText-primary tracking-tight">
          Your mentor
        </h2>
        <button
          onClick={onAddMentor || (() => alert('Find new mentors'))}
          className="w-8 h-8 rounded-full border border-[#E5E7EB] hover:border-brand-500 hover:bg-brand-50 flex items-center justify-center text-slateText-secondary hover:text-brand-500 transition-colors shadow-2xs"
          aria-label="Add mentor"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>

      {/* Mentor Items */}
      <div className="space-y-4">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex items-center justify-between gap-3 group"
          >
            {/* Avatar & Details */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 group-hover:scale-105 transition-transform"
                />
                {mentor.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-black rounded-full ring-2 ring-white" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slateText-primary truncate group-hover:text-brand-500 transition-colors">
                  {mentor.name}
                </p>
                <p className="text-[11px] text-slateText-muted">
                  {mentor.role}
                </p>
              </div>
            </div>

            {/* Follow / Following Toggle Button */}
            <button
              onClick={() => onToggleFollow(mentor.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 active:scale-95 ${
                mentor.isFollowing
                  ? 'bg-brand-500 border-brand-500 text-white shadow-xs'
                  : 'bg-white hover:bg-[#F5F6FA] border-[#E2E4EC] text-slateText-secondary hover:text-slateText-primary'
              }`}
              aria-label={mentor.isFollowing ? `Unfollow ${mentor.name}` : `Follow ${mentor.name}`}
            >
              {mentor.isFollowing ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5 stroke-[2]" />
                  <span>Follow</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <div className="mt-6 pt-1">
        <button
          onClick={onSeeAllMentors || (() => alert('Viewing all mentors'))}
          className="w-full py-2.5 px-4 rounded-full bg-brand-50 hover:bg-brand-100 text-brand-500 font-bold text-xs transition-colors text-center"
        >
          See All
        </button>
      </div>
    </div>
  );
};
