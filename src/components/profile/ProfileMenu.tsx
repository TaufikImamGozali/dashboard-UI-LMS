import React, { useState } from 'react';
import { ChevronDown, CircleHelp, LogOut, Settings, UserRound, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { Popover } from '../ui/Popover';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface ProfileMenuProps {
  onRequestLogout: () => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onRequestLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { resolvedTheme, setTheme } = useTheme();
  const { role, isAdmin, switchRole } = useAuth();

  const go = (path: string, state?: object) => {
    setOpen(false);
    navigate(path, { state });
  };

  const handleToggleAdminRole = () => {
    const nextRole = isAdmin ? 'student' : 'admin';
    switchRole(nextRole);
    setOpen(false);
    if (nextRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="Profile menu"
      role="menu"
      widthClass="md:w-80"
      trigger={(props) => (
        <button
          type="button"
          {...props}
          className="group flex min-h-touch items-center gap-3 rounded-full pl-1 pr-2 focus-visible:ring-2 focus-visible:ring-brand-400"
          aria-label={`Open profile menu for ${profile.name}`}
        >
          <div className="relative">
            <img
              src={profile.avatar}
              alt=""
              width="40"
              height="40"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-100 transition-all group-hover:ring-brand-300"
            />
            {isAdmin && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[9px] ring-2 ring-surface">
                ★
              </span>
            )}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-semibold text-content-primary group-hover:text-brand-500">
              {profile.name}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-content-muted">
              {role}
            </span>
          </div>
          <ChevronDown
            className={`hidden h-4 w-4 text-content-muted transition-transform sm:block ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}
    >
      <div className="flex items-center gap-3 border-b border-outline-subtle px-5 py-4">
        <img
          src={profile.avatar}
          alt={profile.name}
          width="48"
          height="48"
          className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-100"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-extrabold text-content-primary">
              {profile.name}
            </p>
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                isAdmin
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-brand-50 text-brand-600'
              }`}
            >
              {role}
            </span>
          </div>
          <p className="truncate text-xs text-content-muted">{profile.email}</p>
        </div>
      </div>

      <div className="p-2 space-y-1">
        {isAdmin && (
          <button
            data-navigation
            role="menuitem"
            type="button"
            onClick={() => go('/admin')}
            className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-purple-700 bg-purple-50/70 hover:bg-purple-100/70 transition-colors"
          >
            <ShieldCheck className="h-4 w-4 text-purple-600" />
            Admin Console
          </button>
        )}

        <button
          data-navigation
          role="menuitem"
          type="button"
          onClick={() => go('/settings', { tab: 'profile' })}
          className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-content-secondary hover:bg-surface-muted transition-colors"
        >
          <UserRound className="h-4 w-4" />
          My Profile
        </button>

        <button
          data-navigation
          role="menuitem"
          type="button"
          onClick={() => go('/settings')}
          className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-content-secondary hover:bg-surface-muted transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>

        <div className="px-1 py-1">
          <ToggleSwitch
            label="Dark Mode"
            checked={resolvedTheme === 'dark'}
            onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>

        <button
          role="menuitem"
          type="button"
          onClick={handleToggleAdminRole}
          className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          {isAdmin ? 'Switch to Student View' : 'Switch to Admin Role'}
        </button>

        <button
          data-navigation
          role="menuitem"
          type="button"
          onClick={() => go('/help')}
          className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-content-secondary hover:bg-surface-muted transition-colors"
        >
          <CircleHelp className="h-4 w-4" />
          Help & Support
        </button>
      </div>

      <div className="border-t border-outline-subtle p-2">
        <button
          role="menuitem"
          type="button"
          onClick={() => {
            setOpen(false);
            onRequestLogout();
          }}
          className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </Popover>
  );
};
