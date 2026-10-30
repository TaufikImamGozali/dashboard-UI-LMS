import React from 'react';
import { Search, Menu } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import { ProfileMenu } from './profile/ProfileMenu';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileSidebar?: () => void;
  onRequestLogout: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
  onRequestLogout,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 px-6 md:px-8 border-b border-outline-subtle">
      {/* Left: Mobile hamburger + Pill Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {onOpenMobileSidebar && (
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2.5 rounded-full bg-surface-muted text-slateText-secondary hover:text-brand-500 hover:bg-brand-50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slateText-muted">
            <Search className="w-4 h-4 stroke-[2]" />
          </div>
          <input
            type="text"
            id="course-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search your course...."
            className="w-full pl-11 pr-4 py-2.5 bg-surface-muted hover:bg-surface-subtle focus:bg-surface text-slateText-primary placeholder-slateText-muted text-sm rounded-full border border-transparent focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100 transition-all duration-200"
            aria-label="Search your course"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slateText-muted hover:text-slateText-primary"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right: Theme Toggle + Divider + User Profile */}
      <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
        <ThemeToggle />

        {/* Vertical divider */}
        <div className="h-7 w-px bg-outline mx-1 hidden sm:block" />

        <ProfileMenu onRequestLogout={onRequestLogout} />
      </div>
    </header>
  );
};
