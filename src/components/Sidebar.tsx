import React from 'react';
import {
  LayoutDashboard,
  Mail,
  BookOpen,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import type { Friend } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  friends: Friend[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  friends,
  isOpenMobile = false,
  onCloseMobile,
  onLogout,
}) => {
  const mobilePanelRef = useFocusTrap<HTMLDivElement>(isOpenMobile, () => onCloseMobile?.());
  const isInbox = currentPath === '/inbox' || currentPath.startsWith('/group');
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { id: 'inbox', label: 'Inbox', icon: Mail, path: '/inbox', badge: 3 },
    { id: 'lesson', label: 'Lesson', icon: BookOpen, path: '/lesson' },
    { id: 'task', label: 'Task', icon: CheckSquare, path: '/task' },
    { id: 'group', label: 'Group', icon: Users, path: '/group' },
  ];

  const sidebarContent = (
    <aside className={`w-full h-full flex flex-col justify-between overflow-y-auto no-scrollbar ${isInbox ? 'p-3 xl:p-6' : 'p-6'}`}>
      {/* Top: Logo & Nav */}
      <div>
        {/* Brand Logo */}
        <div className={`flex items-center justify-between mb-8 px-2 ${isInbox ? 'md:max-xl:justify-center' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-purple-glow text-white">
              {/* Star sparkle icon */}
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 fill-white stroke-none"
              >
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>
            <span className={`text-xl font-bold tracking-tight text-slateText-primary font-sans ${isInbox ? 'md:max-xl:hidden' : ''}`}>
              Coursue
            </span>
          </div>

          {/* Mobile close button */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-slateText-secondary hover:bg-slate-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* OVERVIEW Section */}
        <div className="mb-7">
          <p className={`text-meta font-bold tracking-wider text-slateText-muted uppercase px-3 mb-2.5 ${isInbox ? 'md:max-xl:hidden' : ''}`}>
            Overview
          </p>
          <nav className="space-y-1" aria-label="Overview Navigation">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.path ||
                (item.path !== '/' && currentPath.startsWith(`${item.path}/`));
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.path);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group text-left ${isInbox ? 'md:max-xl:justify-center md:max-xl:px-2' : ''} ${
                    isActive
                      ? 'bg-brand-50 text-brand-500 font-semibold shadow-xs'
                      : 'text-slateText-secondary hover:bg-slate-50 hover:text-slateText-primary'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className={`flex items-center gap-3 ${isInbox ? 'md:max-xl:justify-center' : ''}`}>
                    <Icon
                      className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-brand-500 stroke-[2.2]' : 'text-slateText-muted group-hover:text-slateText-secondary stroke-[1.8]'
                      }`}
                    />
                    <span className={isInbox ? 'md:max-xl:hidden' : ''}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-meta font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-500 ${isInbox ? 'md:max-xl:hidden' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* FRIENDS Section */}
        <div className={`mb-6 ${isInbox ? 'md:max-xl:hidden' : ''}`}>
          <p className="text-meta font-bold tracking-wider text-slateText-muted uppercase px-3 mb-3">
            Friends
          </p>
          <div className="space-y-3 px-1">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="relative">
                  <img height="160" width="160" loading="lazy"
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-surface shadow-xs group-hover:scale-105 transition-transform"
                  />
                  {friend.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-surface" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slateText-primary truncate group-hover:text-brand-500 transition-colors">
                    {friend.name}
                  </p>
                  <p className="text-meta text-slateText-muted">
                    {friend.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom: SETTINGS Section */}
      <div className="pt-4 border-t border-slate-100">
        <p className={`text-meta font-bold tracking-wider text-slateText-muted uppercase px-3 mb-2 ${isInbox ? 'md:max-xl:hidden' : ''}`}>
          Settings
        </p>
        <div className="space-y-1">
          <button
            onClick={() => {
              onNavigate('/settings');
              if (onCloseMobile) onCloseMobile();
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slateText-secondary hover:bg-slate-50 hover:text-slateText-primary transition-colors text-left ${isInbox ? 'md:max-xl:justify-center md:max-xl:px-2' : ''}`}
          >
            <Settings className="w-4.5 h-4.5 text-slateText-muted stroke-[1.8]" />
            <span className={isInbox ? 'md:max-xl:hidden' : ''}>Setting</span>
          </button>
          <button
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onLogout) {
                onLogout();
              } else {
                alert('Logout clicked');
              }
            }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors text-left ${isInbox ? 'md:max-xl:justify-center md:max-xl:px-2' : ''}`}
          >
            <LogOut className="w-4.5 h-4.5 text-rose-500 stroke-[1.8]" />
            <span className={isInbox ? 'md:max-xl:hidden' : ''}>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <div className={`hidden md:block shrink-0 border-r border-outline-subtle bg-surface ${isInbox ? 'md:w-20 xl:w-sidebar-wide' : 'w-60 lg:w-sidebar-wide'}`}>
        {sidebarContent}
      </div>

      {/* Mobile Drawer Backdrop & Panel */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-popover bg-black/40 backdrop-blur-xs md:hidden flex"
          onClick={onCloseMobile}
        >
          <div
            ref={mobilePanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="w-contact-panel bg-surface h-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
