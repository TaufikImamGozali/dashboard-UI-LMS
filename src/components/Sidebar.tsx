import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Megaphone,
  Settings,
  LogOut,
  X,
  Shield,
} from 'lucide-react';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  isOpenMobile = false,
  onCloseMobile,
  onLogout,
}) => {
  const mobilePanelRef = useFocusTrap<HTMLDivElement>(isOpenMobile, () => onCloseMobile?.());
  const { isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'explore', label: 'Explore', icon: Compass, path: '/explore' },
    { id: 'lesson', label: 'Lesson', icon: BookOpen, path: '/lesson' },
    { id: 'announcements', label: 'Pengumuman', icon: Megaphone, path: '/announcements' },
  ];

  const sidebarContent = (
    <aside className="w-full h-full flex flex-col justify-between overflow-y-auto no-scrollbar p-6">
      {/* Top: Logo & Nav */}
      <div>
        {/* Brand Logo */}
        <div className="flex items-center justify-between mb-8 px-2">
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
            <span className="text-xl font-bold tracking-tight text-slateText-primary font-sans">
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
          <p className="text-meta font-bold tracking-wider text-slateText-muted uppercase px-3 mb-2.5">
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
                  data-navigation
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.path);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group text-left ${
                    isActive
                      ? 'bg-brand-50 text-brand-500 font-semibold shadow-xs'
                      : 'text-slateText-secondary hover:bg-slate-50 hover:text-slateText-primary'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? 'text-brand-500 stroke-[2.2]' : 'text-slateText-muted group-hover:text-slateText-secondary stroke-[1.8]'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ADMINISTRATION Section (Visible for Admin) */}
        {(isAdmin || currentPath.startsWith('/admin')) && (
          <div className="mb-6">
            <p className="text-meta font-bold tracking-wider text-purple-600 dark:text-purple-400 uppercase px-3 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </p>
            <nav className="space-y-1" aria-label="Admin Navigation">
              <button
                data-navigation
                type="button"
                onClick={() => {
                  onNavigate('/admin');
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group text-left ${
                  currentPath.startsWith('/admin')
                    ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold shadow-xs'
                    : 'text-slateText-secondary hover:bg-purple-50 hover:text-purple-700'
                }`}
                aria-current={currentPath.startsWith('/admin') ? 'page' : undefined}
              >
                <div className="flex items-center gap-3">
                  <Shield
                    className={`w-4.5 h-4.5 transition-transform duration-200 group-hover:scale-110 ${
                      currentPath.startsWith('/admin') ? 'text-purple-600 stroke-[2.2]' : 'text-slateText-muted group-hover:text-purple-600 stroke-[1.8]'
                    }`}
                  />
                  <span>Admin Panel</span>
                </div>
                <span className="text-meta font-extrabold px-1.5 py-0.5 rounded-md bg-purple-200 text-purple-800">
                  PRO
                </span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Bottom: SETTINGS Section */}
      <div className="pt-4 border-t border-slate-100">
        <p className="text-meta font-bold tracking-wider text-slateText-muted uppercase px-3 mb-2">
          Settings
        </p>
        <div className="space-y-1">
          <button
            type="button"
            data-navigation
            title="Setting"
            onClick={() => {
              onNavigate('/settings');
              if (onCloseMobile) onCloseMobile();
            }}
            aria-current={currentPath === '/settings' ? 'page' : undefined}
            className={`group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${currentPath === '/settings' ? 'bg-brand-50 text-brand-500' : 'text-slateText-secondary hover:bg-slate-50 hover:text-slateText-primary'}`}
          >
            <Settings className="w-4.5 h-4.5 text-slateText-muted stroke-[1.8]" />
            <span>Setting</span>
          </button>
          <button
            type="button"
            title="Logout"
            onClick={() => {
              if (onCloseMobile) onCloseMobile();
              if (onLogout) {
                onLogout();
              } else {
                alert('Logout clicked');
              }
            }}
            className="group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-50 transition-colors text-left"
          >
            <LogOut className="w-4.5 h-4.5 text-rose-500 stroke-[1.8]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <div className="hidden md:block shrink-0 border-r border-outline-subtle bg-surface w-60 lg:w-sidebar-wide">
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
