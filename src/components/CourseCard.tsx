import React from 'react';
import { Heart } from 'lucide-react';
import type { Course } from '../types';
import { CategoryBadge } from './CategoryBadge';

interface CourseCardProps {
  course: Course;
  onToggleFavorite: (id: string) => void;
  onClick?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onToggleFavorite,
  onClick,
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
      className="bg-white rounded-[24px] p-3.5 border border-[#EEF0F6] hover:border-[#DFE2EC] shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between shrink-0 w-[270px] sm:w-[285px] group cursor-pointer"
    >
      <div>
        {/* Thumbnail with Heart Icon */}
        <div className="relative aspect-[16/10] w-full rounded-[18px] overflow-hidden mb-3.5 bg-slate-100">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Heart / Favorite Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(course.id);
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 ${
              course.isFavorite
                ? 'bg-white text-rose-500 shadow-sm'
                : 'bg-black/25 text-white hover:bg-white hover:text-rose-500'
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
          <CategoryBadge category={course.category} label={course.categoryLabel} />
        </div>

        {/* Course Title */}
        <h3 className="text-sm font-bold text-slateText-primary leading-snug line-clamp-2 group-hover:text-brand-500 transition-colors min-h-[40px]">
          {course.title}
        </h3>

        {/* Progress Bar */}
        <div className="my-3">
          <div className="w-full bg-[#F0F2F7] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor()}`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mentor Info Row */}
      <div className="flex items-center gap-2.5 pt-1 border-t border-[#F5F6FA]">
        <img
          src={course.mentor.avatar}
          alt={course.mentor.name}
          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slateText-primary truncate leading-tight">
            {course.mentor.name}
          </p>
          <p className="text-[10px] text-slateText-muted leading-tight">
            {course.mentor.role}
          </p>
        </div>
      </div>
    </div>
  );
};
