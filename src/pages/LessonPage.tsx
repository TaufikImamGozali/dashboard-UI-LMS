import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CategoryType, CourseLevel, CourseStatus, SortOption, ViewMode, Course } from '../types';
import { PageHeader } from '../components/lessons/PageHeader';
import { FilterBar } from '../components/lessons/FilterBar';
import { StatusTabs } from '../components/lessons/StatusTabs';
import { CourseList } from '../components/lessons/CourseList';
import { CourseSkeleton } from '../components/lessons/CourseSkeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Pagination } from '../components/lessons/Pagination';
import { courseService } from '../services/courseService';
import { mockCourses } from '../data/mockData';
import { useFavorites } from '../hooks/useFavorites';

const ITEMS_PER_PAGE = 16;

export const LessonPage: React.FC = () => {
  const navigate = useNavigate();
  const { isFavorite } = useFavorites();

  // ─── Filter state ───────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel>('All');
  const [selectedSort, setSelectedSort] = useState<SortOption>('newest');
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real published courses from Supabase with graceful fallback
  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const data = await courseService.getPublishedCourses();
        if (isMounted) {
          if (data && data.length > 0) {
            setCourses(data);
          } else {
            setCourses(mockCourses);
          }
        }
      } catch (err) {
        console.error('Failed to fetch courses in LessonPage:', err);
        if (isMounted) {
          setCourses(mockCourses);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, []);

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
    if (selectedStatus === 'favorite') {
      result = result.filter((c) => isFavorite(c.id));
    } else if (selectedStatus !== 'all') {
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
        result.sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case 'progress':
        result.sort((a, b) => b.progress - a.progress);
        break;
    }

    return result;
  }, [courses, selectedCategory, selectedLevel, selectedStatus, selectedSort, isFavorite]);

  // ─── Status counts ──────────────────────────────────────────────────────────
  const statusCounts = useMemo(() => {
    return {
      all: courses.length,
      'in-progress': courses.filter((c) => c.status === 'in-progress').length,
      completed: courses.filter((c) => c.status === 'completed').length,
      'not-started': courses.filter((c) => c.status === 'not-started').length,
      favorite: courses.filter((c) => isFavorite(c.id)).length,
    };
  }, [courses, isFavorite]);

  // ─── Pagination ──────────────────────────────────────────────────────────────
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleSelectCourse = (course: Course) => {
    navigate(`/course/${course.slug || course.id}`);
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
        onSelectCategory={(value) => { setSelectedCategory(value); setCurrentPage(1); }}
        selectedLevel={selectedLevel}
        onSelectLevel={(value) => { setSelectedLevel(value); setCurrentPage(1); }}
        selectedSort={selectedSort}
        onSelectSort={(value) => { setSelectedSort(value); setCurrentPage(1); }}
      />

      {/* Status Tabs */}
      <StatusTabs
        selectedStatus={selectedStatus}
        onSelectStatus={(value) => { setSelectedStatus(value); setCurrentPage(1); }}
        statusCounts={statusCounts}
      />

      {/* Course List / Skeleton / Empty */}
      <div className="pt-1">
        {isLoading ? (
          <CourseSkeleton viewMode={viewMode} count={ITEMS_PER_PAGE} />
        ) : paginated.length === 0 ? (
          <EmptyState
            title="Tidak Ada Kursus Ditemukan"
            description="Tidak ada kursus yang cocok dengan filter yang dipilih. Coba reset filter Anda."
            actionLabel="Reset Filter"
            onAction={handleResetFilters}
          />
        ) : (
          <>
            <CourseList
              courses={paginated}
              viewMode={viewMode}
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
