import React from 'react';
import { Star, Users, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CourseDetail } from '../../types';
import { TagBadge } from '../ui/TagBadge';

interface CourseHeaderProps {
  course: CourseDetail;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ course }) => {
  return (
    <div className="space-y-3.5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slateText-muted flex-wrap">
        <Link to="/" className="hover:text-brand-500 transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/lesson" className="hover:text-brand-500 transition-colors">
          Lesson
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slateText-primary font-semibold truncate max-w-xs sm:max-w-md">
          {course.title}
        </span>
      </nav>

      {/* Category Pill */}
      <div>
        <TagBadge category={course.category} label={course.categoryLabel} />
      </div>

      {/* Main Course Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary tracking-tight leading-tight">
        {course.title}
      </h1>

      {/* Stats Meta Row */}
      <div className="flex items-center gap-4 sm:gap-6 text-xs text-slateText-secondary flex-wrap pt-1">
        {/* Rating */}
        <div className="flex items-center gap-1.5 font-semibold text-slateText-primary">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{course.rating.toFixed(1)}</span>
          <span className="text-slateText-muted font-normal">
            ({course.reviewsCount} reviews)
          </span>
        </div>

        {/* Students */}
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-slateText-muted" />
          <span>{course.studentsCount} students</span>
        </div>

        {/* Total Duration */}
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slateText-muted" />
          <span>{course.totalDuration}</span>
        </div>

        {/* Last Updated */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-slateText-muted" />
          <span>Updated {course.lastUpdated}</span>
        </div>
      </div>
    </div>
  );
};
