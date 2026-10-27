import React from 'react';
import type { Course, ViewMode } from '../../types';
import { CourseCard } from '../CourseCard';
import { CourseListItem } from './CourseListItem';

interface CourseListProps {
  courses: Course[];
  viewMode: ViewMode;
  onToggleFavorite: (id: string) => void;
  onSelectCourse: (course: Course) => void;
}

export const CourseList: React.FC<CourseListProps> = ({
  courses,
  viewMode,
  onToggleFavorite,
  onSelectCourse,
}) => {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {courses.map((course) => (
          <div key={course.id} className="flex justify-center">
            <div className="w-full">
              <CourseCard
                course={course}
                onToggleFavorite={onToggleFavorite}
                onClick={onSelectCourse}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {courses.map((course) => (
        <CourseListItem
          key={course.id}
          course={course}
          onToggleFavorite={onToggleFavorite}
          onClick={onSelectCourse}
        />
      ))}
    </div>
  );
};
