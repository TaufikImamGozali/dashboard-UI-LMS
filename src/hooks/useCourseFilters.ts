import { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Course, CategoryType, CourseLevel, CourseStatus, SortOption } from '../types';

export const ITEMS_PER_PAGE = 6;

export function useCourseFilters(allCourses: Course[], topbarSearch: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [debouncedSearch, setDebouncedSearch] = useState(topbarSearch);
  const [isLoading, setIsLoading] = useState(false);
  const initialLoadRef = useRef(true);

  // Debounce search input from topbar
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(topbarSearch);
    }, 300);

    return () => clearTimeout(handler);
  }, [topbarSearch]);

  // Read params from URL with fallback defaults
  const currentCategory = (searchParams.get('category') as CategoryType | 'all') || 'all';
  const currentLevel = (searchParams.get('level') as CourseLevel) || 'All';
  const currentStatus = (searchParams.get('status') as CourseStatus) || 'all';
  const currentSort = (searchParams.get('sort') as SortOption) || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Update query string helper
  const updateParam = (key: string, value: string) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === 'all' || value === 'All' || (key === 'page' && value === '1')) {
          next.delete(key);
        } else {
          next.set(key, value);
        }
        // When changing any filter other than page, reset to page 1
        if (key !== 'page') {
          next.delete('page');
        }
        return next;
      },
      { replace: true }
    );
  };

  const setCategory = (cat: CategoryType | 'all') => updateParam('category', cat);
  const setLevel = (lvl: CourseLevel) => updateParam('level', lvl);
  const setStatus = (st: CourseStatus) => updateParam('status', st);
  const setSort = (s: SortOption) => updateParam('sort', s);
  const setPage = (p: number) => updateParam('page', p.toString());

  const resetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Trigger 500ms simulated skeleton loading on filter changes
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentCategory, currentLevel, currentStatus, currentSort, debouncedSearch]);

  // Filter courses based on criteria
  const filteredCourses = useMemo(() => {
    return allCourses
      .filter((course) => {
        // Category filter
        if (currentCategory !== 'all' && course.category !== currentCategory) {
          return false;
        }

        // Level filter
        if (currentLevel !== 'All' && course.level !== currentLevel) {
          return false;
        }

        // Status filter
        if (currentStatus !== 'all') {
          if (currentStatus === 'completed' && course.progress !== 100) return false;
          if (currentStatus === 'not-started' && course.progress !== 0) return false;
          if (
            currentStatus === 'in-progress' &&
            (course.progress === 0 || course.progress === 100)
          ) {
            return false;
          }
        }

        // Search filter (title, category label, mentor name)
        if (debouncedSearch.trim()) {
          const q = debouncedSearch.toLowerCase();
          const matchTitle = course.title.toLowerCase().includes(q);
          const matchCat = course.categoryLabel.toLowerCase().includes(q);
          const matchMentor = course.mentor.name.toLowerCase().includes(q);
          if (!matchTitle && !matchCat && !matchMentor) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (currentSort) {
          case 'newest':
            return (
              new Date(b.releaseDate || '2026-01-01').getTime() -
              new Date(a.releaseDate || '2026-01-01').getTime()
            );
          case 'popular': {
            const studentsA = parseInt(String(a.studentsCount || '0').replace(/[^0-9]/g, ''), 10) || 0;
            const studentsB = parseInt(String(b.studentsCount || '0').replace(/[^0-9]/g, ''), 10) || 0;
            return studentsB - studentsA;
          }
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'progress':
            return b.progress - a.progress;
          default:
            return 0;
        }
      });
  }, [allCourses, currentCategory, currentLevel, currentStatus, currentSort, debouncedSearch]);

  // Status counts (calculated on category/search filtered items)
  const statusCounts = useMemo(() => {
    const base = allCourses.filter((course) => {
      if (currentCategory !== 'all' && course.category !== currentCategory) return false;
      if (currentLevel !== 'All' && course.level !== currentLevel) return false;
      if (debouncedSearch.trim()) {
        const q = debouncedSearch.toLowerCase();
        return (
          course.title.toLowerCase().includes(q) ||
          course.categoryLabel.toLowerCase().includes(q) ||
          course.mentor.name.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return {
      all: base.length,
      'in-progress': base.filter((c) => c.progress > 0 && c.progress < 100).length,
      completed: base.filter((c) => c.progress === 100).length,
      'not-started': base.filter((c) => c.progress === 0).length,
    };
  }, [allCourses, currentCategory, currentLevel, debouncedSearch]);

  // Pagination calculation
  const totalCount = filteredCourses.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedCourses = useMemo(() => {
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    return filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCourses, validPage]);

  return {
    category: currentCategory,
    level: currentLevel,
    status: currentStatus,
    sort: currentSort,
    page: validPage,
    search: debouncedSearch,
    setCategory,
    setLevel,
    setStatus,
    setSort,
    setPage,
    resetFilters,
    filteredCourses,
    paginatedCourses,
    totalCount,
    totalPages,
    statusCounts,
    isLoading,
  };
}
