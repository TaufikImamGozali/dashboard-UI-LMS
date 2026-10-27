import React from 'react';
import { Star, Users, UserPlus, Check } from 'lucide-react';
import type { CourseMentor } from '../../types';

interface CourseMentorCardProps {
  mentor: CourseMentor;
  onToggleFollow: () => void;
}

export const CourseMentorCard: React.FC<CourseMentorCardProps> = ({
  mentor,
  onToggleFollow,
}) => {
  return (
    <div className="bg-surface rounded-card p-5 sm:p-6 border border-outline-subtle shadow-xs space-y-4">
      {/* Header with Title and Follow Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slateText-primary tracking-tight">
          Instructor
        </h2>

        <button
          type="button"
          onClick={onToggleFollow}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 active:scale-95 ${
            mentor.isFollowing
              ? 'bg-brand-500 border-brand-500 text-white shadow-xs'
              : 'bg-surface hover:bg-surface-muted border-outline text-slateText-secondary hover:text-slateText-primary'
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

      {/* Mentor Profile Details */}
      <div className="flex items-start gap-3.5">
        <img height="160" width="160" loading="lazy"
          src={mentor.avatar}
          alt={mentor.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-100 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-slateText-primary truncate">
            {mentor.name}
          </h2>
          <p className="text-xs text-slateText-muted line-clamp-1 mt-0.5">
            {mentor.role}
          </p>

          <div className="flex items-center gap-3 text-xs text-slateText-muted mt-2">
            <span className="flex items-center gap-1 text-slateText-primary font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{mentor.rating.toFixed(2)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{mentor.students} students</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mentor Bio */}
      <p className="text-xs text-slateText-secondary leading-relaxed pt-1 border-t border-outline-subtle">
        {mentor.bio}
      </p>
    </div>
  );
};
