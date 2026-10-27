import React from 'react';
import type { CourseStatus } from '../../types';

interface StatusTabsProps {
  selectedStatus: CourseStatus;
  onSelectStatus: (status: CourseStatus) => void;
  statusCounts: {
    all: number;
    'in-progress': number;
    completed: number;
    'not-started': number;
  };
}

export const StatusTabs: React.FC<StatusTabsProps> = ({
  selectedStatus,
  onSelectStatus,
  statusCounts,
}) => {
  const tabs: Array<{ id: CourseStatus; label: string; count: number }> = [
    { id: 'all', label: 'All Courses', count: statusCounts.all },
    { id: 'in-progress', label: 'In Progress', count: statusCounts['in-progress'] },
    { id: 'completed', label: 'Completed', count: statusCounts.completed },
    { id: 'not-started', label: 'Not Started', count: statusCounts['not-started'] },
  ];

  return (
    <div
      role="tablist"
      aria-label="Course status tabs"
      className="flex items-center gap-1 sm:gap-2 border-b border-slate-200/80 overflow-x-auto no-scrollbar pt-2"
    >
      {tabs.map((tab) => {
        const isActive = selectedStatus === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            id={`status-tab-${tab.id}`}
            onClick={() => onSelectStatus(tab.id)}
            className={`pb-3 px-3.5 text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 relative whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-t-lg select-none ${
              isActive
                ? 'text-brand-500'
                : 'text-slateText-muted hover:text-slateText-primary'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-meta font-semibold transition-colors ${
                isActive
                  ? 'bg-brand-100 text-brand-600'
                  : 'bg-slate-100 text-slateText-muted'
              }`}
            >
              {tab.count}
            </span>

            {/* Bottom active indicator */}
            {isActive && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-500 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
};
