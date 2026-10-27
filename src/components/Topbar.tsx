import React from 'react';
import { Search, Mail, Bell, Menu } from 'lucide-react';
import { currentUser } from '../data/mockData';
import { ThemeToggle } from './ui/ThemeToggle';

interface TopbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenMobileSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenMobileSidebar,
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

      {/* Right: Notification Icons + Divider + User Profile */}
      <div className="flex items-center justify-end gap-3 sm:gap-4 shrink-0">
        <ThemeToggle />
        {/* Mail Icon Button */}
        <button
          className="relative w-10 h-10 rounded-full bg-surface hover:bg-surface-muted border border-outline flex items-center justify-center text-slateText-secondary hover:text-brand-500 transition-colors shadow-2xs"
          aria-label="Open messages"
        >
          <Mail className="w-4 h-4 stroke-[2]" />
        </button>

        {/* Bell Notification Button */}
        <button
          className="relative w-10 h-10 rounded-full bg-surface hover:bg-surface-muted border border-outline flex items-center justify-center text-slateText-secondary hover:text-brand-500 transition-colors shadow-2xs"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4 stroke-[2]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-surface" />
        </button>

        {/* Vertical divider */}
        <div className="h-7 w-px bg-outline mx-1 hidden sm:block" />

        {/* User Avatar + Name */}
        <div className="flex items-center gap-3 pl-1 group">
          <div className="relative">
            <img height="160" width="160" loading="lazy"
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-100 group-hover:ring-brand-300 transition-all"
            />
          </div>
          <span className="text-sm font-semibold text-slateText-primary group-hover:text-brand-500 transition-colors hidden sm:inline-block">
            {currentUser.name}
          </span>
        </div>
      </div>
    </header>
  );
};
