import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryType, CourseLevel, CourseStatus, SortOption, ViewMode, Course } from '../types';
import { mockCourses } from '../data/mockData';
import { PageHeader } from '../components/lessons/PageHeader';
import { FilterBar } from '../components/lessons/FilterBar';
import { StatusTabs } from '../components/lessons/StatusTabs';
import { CourseList } from '../components/lessons/CourseList';
import { CourseSkeleton } from '../components/lessons/CourseSkeleton';
import { EmptyState } from '../components/lessons/EmptyState';
import { Pagination } from '../components/lessons/Pagination';

const ITEMS_PER_PAGE = 9;

export const LessonPage: React.FC = () => {
  const navigate = useNavigate();

  // ─── Filter state ───────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel>('All');
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate async data fetch on first mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // ─── Reset page on filter change ────────────────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedLevel, selectedSort, selectedStatus]);

  // ─── Filtering + Sorting logic ──────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...courses];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'All') {
      result = result.filter((c) => c.level === selectedLevel);
    }

    // Status tab filter
    if (selectedStatus !== 'all') {
      result = result.filter((c) => c.status === selectedStatus);
    }

    // Sort
    switch (selectedSort) {
      case 'newest':
        result.sort((a, b) =>
          (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '')
        );
        break;
      case 'popular':
        result.sort((a, b) => {
          const aStudents = typeof a.studentsCount === 'string'
            ? parseFloat(a.studentsCount)
            : (a.studentsCount ?? 0);
          const bStudents = typeof b.studentsCount === 'string'
            ? parseFloat(b.studentsCount)
            : (b.studentsCount ?? 0);
          return bStudents - aStudents;
        });
        break;
      case 'rating':
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'progress':
        result.sort((a, b) => b.progress - a.progress);
        break;
    }

    return result;
  }, [courses, selectedCategory, selectedLevel, selectedSort, selectedStatus]);

  // ─── Status counts (based on current category + level filters only) ─────────
  const statusCounts = useMemo(() => {
    let base = [...courses];
    if (selectedCategory !== 'all') {
      base = base.filter((c) => c.category === selectedCategory);
    }
    if (selectedLevel !== 'All') {
      base = base.filter((c) => c.level === selectedLevel);
    }
    return {
      all: base.length,
      'in-progress': base.filter((c) => c.status === 'in-progress').length,
      completed: base.filter((c) => c.status === 'completed').length,
      'not-started': base.filter((c) => c.status === 'not-started').length,
    };
  }, [courses, selectedCategory, selectedLevel]);

  // ─── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleToggleFavorite = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, isFavorite: !c.isFavorite } : c
      )
    );
  };

  const handleSelectCourse = (course: Course) => {
    navigate(`/course/${course.id}`);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel('All');
    setSelectedSort('newest');
    setSelectedStatus('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5 pb-4">
      {/* Page Header: title + view toggle */}
      <PageHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={filtered.length}
      />

      {/* Filter Bar: category chips + sort + level */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        selectedSort={selectedSort}
        onSelectSort={setSelectedSort}
      />

      {/* Status Tabs */}
      <StatusTabs
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
        statusCounts={statusCounts}
      />

      {/* Course List / Skeleton / Empty */}
      <div className="pt-1">
        {isLoading ? (
          <CourseSkeleton viewMode={viewMode} count={ITEMS_PER_PAGE} />
        ) : paginated.length === 0 ? (
          <EmptyState onResetFilters={handleResetFilters} />
        ) : (
          <>
            <CourseList
              courses={paginated}
              viewMode={viewMode}
              onToggleFavorite={handleToggleFavorite}
              onSelectCourse={handleSelectCourse}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalCount={filtered.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
