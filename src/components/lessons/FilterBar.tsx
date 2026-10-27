import React from 'react';
import { ArrowUpDown, SlidersHorizontal, ChevronDown } from 'lucide-react';
import type { CategoryType, CourseLevel, SortOption } from '../../types';
import { CategoryChips } from './CategoryChips';

interface FilterBarProps {
  selectedCategory: CategoryType | 'all';
  onSelectCategory: (category: CategoryType | 'all') => void;
  selectedLevel: CourseLevel;
  onSelectLevel: (level: CourseLevel) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedLevel,
  onSelectLevel,
  selectedSort,
  onSelectSort,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pt-1">
      {/* Category Chips */}
      <CategoryChips
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Dropdown Filters (Sort by & Level) */}
      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
        {/* Level Dropdown */}
        <div className="relative inline-flex items-center">
          <label htmlFor="filter-level" className="sr-only">
            Filter by Level
          </label>
          <div className="absolute left-3.5 pointer-events-none text-slateText-muted">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </div>
          <select
            id="filter-level"
            value={selectedLevel}
            onChange={(e) => onSelectLevel(e.target.value as CourseLevel)}
            className="pl-9 pr-8 py-2 bg-surface hover:bg-surface-muted text-slateText-primary text-xs font-semibold rounded-full border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-300 transition-all appearance-none cursor-pointer"
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <div className="absolute right-3 pointer-events-none text-slateText-muted">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Sort By Dropdown */}
        <div className="relative inline-flex items-center">
          <label htmlFor="filter-sort" className="sr-only">
            Sort by
          </label>
          <div className="absolute left-3.5 pointer-events-none text-slateText-muted">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
          <select
            id="filter-sort"
            value={selectedSort}
            onChange={(e) => onSelectSort(e.target.value as SortOption)}
            className="pl-9 pr-8 py-2 bg-surface hover:bg-surface-muted text-slateText-primary text-xs font-semibold rounded-full border border-slate-200/80 focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-300 transition-all appearance-none cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="popular">Sort: Most Popular</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="progress">Sort: Progress</option>
          </select>
          <div className="absolute right-3 pointer-events-none text-slateText-muted">
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
