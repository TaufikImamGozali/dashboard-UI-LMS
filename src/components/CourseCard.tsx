import React from 'react';
import { Heart } from 'lucide-react';
import type { Course } from '../types';
import { TagBadge } from './ui/TagBadge';

interface CourseCardProps {
  course: Course;
  onToggleFavorite: (id: string) => void;
  onClick?: (course: Course) => void;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onToggleFavorite,
  onClick,
  className = '',
}) => {
  const getProgressBarColor = () => {
    switch (course.category) {
      case 'frontend':
        return 'bg-category-frontend-icon';
      case 'design':
        return 'bg-category-design-icon';
      case 'branding':
        return 'bg-category-branding-icon';
      default:
        return 'bg-brand-500';
    }
  };

  return (
    <div
      onClick={() => onClick && onClick(course)}
      onKeyDown={(event) => {
        if (event.currentTarget !== event.target || !onClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(course);
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Open course: ${course.title}` : undefined}
      className={`bg-surface rounded-card p-3.5 border border-outline-subtle hover:border-outline-strong shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer ${
        className || 'w-full'
      }`}
    >
      <div>
        {/* Thumbnail with Heart Icon */}
        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-3.5 bg-slate-100">
          <img
            height="160"
            width="160"
            src={course.thumbnail}
            alt={course.title}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Price Badge */}
          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            {course.price && course.price > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-900/85 backdrop-blur-md text-purple-200 font-extrabold text-micro tracking-wide border border-purple-400/30 shadow-xs">
                ${course.price}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700/85 backdrop-blur-md text-white font-extrabold text-micro tracking-wide shadow-xs">
                GRATIS
              </span>
            )}
          </div>

          {/* Heart / Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(course.id);
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 ${
              course.isFavorite
                ? 'bg-surface text-rose-500 shadow-sm'
                : 'bg-black/25 text-white hover:bg-surface hover:text-rose-500'
            }`}
            aria-label={course.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                course.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Category Pill Tag */}
        <div className="mb-2">
          <TagBadge category={course.category} label={course.categoryLabel} />
        </div>

        {/* Course Title */}
        <h3 className="text-sm font-bold text-slateText-primary leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors min-h-10">
          {course.title}
        </h3>

        {/* Progress Bar */}
        <div className="my-3">
          <div className="w-full bg-surface-subtle rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mentor Info Row */}
      <div className="flex items-center gap-2.5 pt-1 border-t border-outline-subtle">
        <img height="160" width="160" loading="lazy"
          src={course.mentor.avatar}
          alt={course.mentor.name}
          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slateText-primary truncate leading-tight">
            {course.mentor.name}
          </p>
          <p className="text-micro text-slateText-muted leading-tight">
            {course.mentor.role}
          </p>
        </div>
      </div>
    </div>
  );
};
