import React from 'react';
import { Search, Mail, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from './ui/ThemeToggle';
import { useChat } from '../hooks/useChat';
import { NotificationBell } from './notifications/NotificationBell';
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
  const navigate = useNavigate();
  const { conversations } = useChat();
  const unreadMessages = conversations.reduce((total, item) => total + item.unreadCount, 0);
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
          type="button"
          data-navigation
          onClick={() => navigate('/inbox')}
          title="Messages"
          className="relative w-10 h-10 rounded-full bg-surface hover:bg-surface-muted border border-outline flex items-center justify-center text-slateText-secondary hover:text-brand-500 transition-colors shadow-2xs"
          aria-label={`Messages, ${unreadMessages} unread`}
        >
          <Mail className="w-4 h-4 stroke-[2]" />
          {unreadMessages > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-micro font-extrabold text-white ring-2 ring-surface">{unreadMessages > 9 ? '9+' : unreadMessages}</span>}
        </button>

        <NotificationBell />

        {/* Vertical divider */}
        <div className="h-7 w-px bg-outline mx-1 hidden sm:block" />

        <ProfileMenu onRequestLogout={onRequestLogout} />
      </div>
    </header>
  );
};
