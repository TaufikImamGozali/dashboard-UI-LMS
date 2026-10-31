import React from 'react';
import { MoreVertical, Scissors, Palette, Code2 } from 'lucide-react';
import type { ProgressSummary } from '../types';

interface CourseProgressCardProps {
  progress: ProgressSummary;
  onClick?: () => void;
}

export const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  progress,
  onClick,
}) => {
  const getIconAndColors = () => {
    switch (progress.category) {
      case 'design':
        return {
          icon: <Scissors className="w-5 h-5 stroke-[2]" />,
          tileBg: 'bg-category-design-bg text-category-design-text',
        };
      case 'branding':
        return {
          icon: <Palette className="w-5 h-5 stroke-[2]" />,
          tileBg: 'bg-category-branding-bg text-category-branding-text',
        };
      case 'frontend':
        return {
          icon: <Code2 className="w-5 h-5 stroke-[2]" />,
          tileBg: 'bg-category-frontend-bg text-category-frontend-text',
        };
      default:
        return {
          icon: <Code2 className="w-5 h-5 stroke-[2]" />,
          tileBg: 'bg-category-frontend-bg text-category-frontend-text',
        };
    }
  };

  const { icon, tileBg } = getIconAndColors();

  return (
    <div
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.currentTarget !== event.target || !onClick) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Open course progress: ${progress.title}` : undefined}
      className={`bg-surface rounded-card p-4 sm:p-5 border border-outline-subtle hover:border-outline-strong shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-3 group ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-center gap-3.5">
        {/* Category Icon Tile */}
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${tileBg} group-hover:scale-105 transition-transform`}
        >
          {icon}
        </div>

        {/* Info */}
        <div>
          <p className="text-meta font-medium text-slateText-muted leading-tight">
            {progress.watched}/{progress.total} watched
          </p>
          <h2 className="text-sm sm:text-sm font-bold text-slateText-primary mt-0.5 group-hover:text-brand-500 transition-colors">
            {progress.title}
          </h2>
        </div>
      </div>

      {/* Three dots menu */}
      <button
        type="button"
        onClick={(e) => e.stopPropagation()}
        className="w-8 h-8 rounded-full flex items-center justify-center text-slateText-muted hover:text-slateText-primary hover:bg-surface-muted transition-colors"
        aria-label="Options"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
};
