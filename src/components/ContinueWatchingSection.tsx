import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import type { Course } from '../types';
import { CourseCard } from './CourseCard';

interface ContinueWatchingSectionProps {
  courses: Course[];
  searchQuery: string;
  onToggleFavorite: (id: string) => void;
  onCourseClick?: (course: Course) => void;
}

export const ContinueWatchingSection: React.FC<ContinueWatchingSectionProps> = ({
  courses,
  searchQuery,
  onToggleFavorite,
  onCourseClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const filteredCourses = courses.filter((course) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(query) ||
      course.categoryLabel.toLowerCase().includes(query) ||
      course.mentor.name.toLowerCase().includes(query)
    );
  });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Carousel Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slateText-primary tracking-tight">
            Continue Watching
          </h2>
        </div>

        {/* Carousel controls matching screenshot */}
        <div className="flex items-center gap-2">
          {/* Prev button */}
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full border border-[#E5E7EB] hover:border-brand-300 bg-white hover:bg-slate-50 flex items-center justify-center text-slateText-secondary transition-all active:scale-95 shadow-2xs"
            aria-label="Previous courses"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          {/* Next button (purple active state) */}
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center transition-all active:scale-95 shadow-purple-glow"
            aria-label="Next courses"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Carousel Track */}
      {filteredCourses.length > 0 ? (
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2 pt-1"
        >
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onToggleFavorite={onToggleFavorite}
              onClick={onCourseClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 border border-[#EEF0F6] text-center space-y-2">
          <Compass className="w-8 h-8 text-brand-400 mx-auto" />
          <p className="text-sm font-semibold text-slateText-primary">
            No courses found matching "{searchQuery}"
          </p>
          <p className="text-xs text-slateText-muted">
            Try searching for "UI/UX", "Front End", or "Branding"
          </p>
        </div>
      )}
    </div>
  );
};
