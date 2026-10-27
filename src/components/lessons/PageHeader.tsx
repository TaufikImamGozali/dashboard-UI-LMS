import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import type { ViewMode } from '../../types';

interface PageHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalCount: number;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  viewMode,
  onViewModeChange,
  totalCount,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary tracking-tight">
            My Lessons
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-600 text-xs font-bold">
            {totalCount}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slateText-muted mt-1">
          Explore and track your enrolled and upcoming skill-building courses
        </p>
      </div>

      {/* Grid / List View Toggle */}
      <div
        className="flex items-center bg-[#F5F6FA] p-1 rounded-full self-start sm:self-auto border border-slate-200/60"
        role="group"
        aria-label="View mode toggle"
      >
        <button
          type="button"
          onClick={() => onViewModeChange('grid')}
          aria-label="Grid view"
          aria-pressed={viewMode === 'grid'}
          className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
            viewMode === 'grid'
              ? 'bg-white text-brand-500 shadow-xs'
              : 'text-slateText-muted hover:text-slateText-primary'
          }`}
        >
          <LayoutGrid className="w-4 h-4 stroke-[2]" />
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange('list')}
          aria-label="List view"
          aria-pressed={viewMode === 'list'}
          className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
            viewMode === 'list'
              ? 'bg-white text-brand-500 shadow-xs'
              : 'text-slateText-muted hover:text-slateText-primary'
          }`}
        >
          <List className="w-4 h-4 stroke-[2]" />
        </button>
      </div>
    </div>
  );
};
