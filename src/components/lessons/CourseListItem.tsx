import React from 'react';
import { Heart, Clock, Star, ArrowRight } from 'lucide-react';
import type { Course } from '../../types';
import { TagBadge } from '../ui/TagBadge';
import { useFavorites } from '../../hooks/useFavorites';
import { formatPrice } from '../../utils/currency';

interface CourseListItemProps {
  course: Course;
  onToggleFavorite?: (id: string) => void;
  onClick: (course: Course) => void;
}

export const CourseListItem: React.FC<CourseListItemProps> = ({
  course,
  onToggleFavorite,
  onClick,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const effectiveIsFavorite = isFavorite(course.id);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(course.id, course.title);
    onToggleFavorite?.(course.id);
  };

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
      onClick={() => onClick(course)}
      onKeyDown={(event) => {
        if (event.currentTarget !== event.target) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick(course);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open course: ${course.title}`}
      className="bg-surface rounded-card p-4 border border-outline-subtle hover:border-outline-strong shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer"
    >
      {/* Left: Thumbnail & Main Info */}
      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
        {/* Thumbnail with Heart Icon */}
        <div className="relative w-28 sm:w-36 h-20 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
          <img
            height="160"
            width="160"
            src={course.thumbnail}
            alt={course.title}
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Favorite heart button */}
          <button
            type="button"
            onClick={handleHeartClick}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-200 active:scale-75 hover:scale-110 ${
              effectiveIsFavorite
                ? 'bg-surface text-rose-500 shadow-sm ring-1 ring-rose-200'
                : 'bg-black/30 text-white hover:bg-surface hover:text-rose-500'
            }`}
            aria-label={effectiveIsFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
          >
            <Heart
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                effectiveIsFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white'
              }`}
            />
          </button>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <TagBadge
              category={course.category}
              label={course.categoryLabel}
              className="scale-90 origin-left"
            />
            {course.level && (
              <span className="text-meta font-semibold text-slateText-muted bg-slate-100 px-2 py-0.5 rounded-full">
                {course.level}
              </span>
            )}
            {course.price !== undefined && (
              <span
                className={`text-meta font-extrabold px-2.5 py-0.5 rounded-full ${
                  course.price > 0
                    ? 'bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}
              >
                {course.price > 0 ? (
                  <>
                    <span>👑</span>
                    <span>{formatPrice(course.price)}</span>
                  </>
                ) : (
                  'GRATIS'
                )}
              </span>
            )}
          </div>

          <h2 className="text-sm sm:text-base font-bold text-slateText-primary group-hover:text-brand-500 transition-colors line-clamp-1">
            {course.title}
          </h2>

          {/* Mentor & Rating Row */}
          <div className="flex items-center gap-3 text-xs text-slateText-muted flex-wrap">
            <div className="flex items-center gap-1.5">
              <img height="160" width="160" loading="lazy"
                src={course.mentor.avatar}
                alt={course.mentor.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="font-medium text-slateText-secondary truncate">
                {course.mentor.name}
              </span>
            </div>

            {course.rating && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slateText-primary">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{course.rating.toFixed(1)}</span>
                </span>
              </>
            )}

            {course.totalDuration && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slateText-muted" />
                  <span>{course.totalDuration}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Progress Bar & Continue CTA */}
      <div className="flex items-center justify-between md:justify-end gap-5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
        {/* Progress Info */}
        <div className="w-32 sm:w-40 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slateText-secondary">
            <span>Progress</span>
            <span className="text-slateText-primary font-bold">{course.progress}%</span>
          </div>
          <div className="w-full bg-surface-subtle rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick(course);
          }}
          className="inline-flex items-center gap-2 pl-4 pr-3 py-2 bg-brand-50 hover:bg-brand-500 text-brand-600 hover:text-white text-xs font-bold rounded-full transition-all duration-200 group-hover:bg-brand-500 group-hover:text-white shadow-2xs shrink-0"
        >
          <span>Continue</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
};
