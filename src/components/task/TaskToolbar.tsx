import React from 'react';
import { Columns3, List, Search, ChevronDown } from 'lucide-react';
import type { TaskViewMode } from '../../types/task';
import type { Task } from '../../types/task';

interface TaskToolbarProps {
  viewMode: TaskViewMode;
  onViewModeChange: (mode: TaskViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCourse: string;
  onCourseChange: (id: string) => void;
  tasks: Task[];
}

export const TaskToolbar: React.FC<TaskToolbarProps> = ({
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  tasks,
}) => {
  // Unique courses from tasks
  const courseOptions = Array.from(
    new Map(tasks.map((t) => [t.courseId, { id: t.courseId, label: t.courseLabel }])).values()
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      {/* View toggle */}
      <div
        role="group"
        aria-label="Task view toggle"
        className="flex items-center bg-surface-muted p-1 rounded-full self-start border border-slate-200/60 shrink-0"
      >
        <button
          type="button"
          onClick={() => onViewModeChange('board')}
          aria-pressed={viewMode === 'board'}
          aria-label="Board view"
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
            viewMode === 'board'
              ? 'bg-surface text-brand-500 shadow-xs'
              : 'text-slateText-muted hover:text-slateText-primary'
          }`}
        >
          <Columns3 className="w-3.5 h-3.5" />
          <span>Board</span>
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('list')}
          aria-pressed={viewMode === 'list'}
          aria-label="List view"
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
            viewMode === 'list'
              ? 'bg-surface text-brand-500 shadow-xs'
              : 'text-slateText-muted hover:text-slateText-primary'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>List</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slateText-muted pointer-events-none" />
        <input
          id="task-search"
          type="search"
          placeholder="Search tasks…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-slate-200/80 rounded-full text-sm text-slateText-primary placeholder:text-slateText-muted focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-300 transition-all"
        />
      </div>

      {/* Course filter */}
      <div className="relative shrink-0">
        <label htmlFor="task-course-filter" className="sr-only">Filter by course</label>
        <select
          id="task-course-filter"
          value={selectedCourse}
          onChange={(e) => onCourseChange(e.target.value)}
          className="pl-4 pr-8 py-2.5 bg-surface border border-slate-200/80 rounded-full text-xs font-semibold text-slateText-primary appearance-none cursor-pointer focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-300 transition-all"
        >
          <option value="all">All Courses</option>
          {courseOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slateText-muted pointer-events-none" />
      </div>
    </div>
  );
};
