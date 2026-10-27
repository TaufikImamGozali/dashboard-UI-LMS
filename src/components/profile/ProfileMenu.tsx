import React, { useState } from 'react';
import { ChevronDown, CircleHelp, LogOut, Settings, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../hooks/useProfile';
import { useTheme } from '../../hooks/useTheme';
import { Popover } from '../ui/Popover';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface ProfileMenuProps { onRequestLogout: () => void }

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ onRequestLogout }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { resolvedTheme, setTheme } = useTheme();
  const go = (path: string, state?: object) => { setOpen(false); navigate(path, { state }); };
  return <Popover open={open} onOpenChange={setOpen} label="Profile menu" role="menu" widthClass="md:w-80" trigger={(props) => <button type="button" {...props} className="group flex min-h-touch items-center gap-3 rounded-full pl-1 pr-2 focus-visible:ring-2 focus-visible:ring-brand-400" aria-label={`Open profile menu for ${profile.name}`}><img src={profile.avatar} alt="" width="40" height="40" className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-100 transition-all group-hover:ring-brand-300" /><span className="hidden text-sm font-semibold text-content-primary group-hover:text-brand-500 sm:inline">{profile.name}</span><ChevronDown className={`hidden h-4 w-4 text-content-muted transition-transform sm:block ${open ? 'rotate-180' : ''}`} /></button>}>
    <div className="flex items-center gap-3 border-b border-outline-subtle px-5 py-4"><img src={profile.avatar} alt={profile.name} width="48" height="48" className="h-12 w-12 rounded-full object-cover" /><div className="min-w-0"><p className="truncate text-sm font-extrabold text-content-primary">{profile.name}</p><p className="truncate text-xs text-content-muted">{profile.email}</p></div></div>
    <div className="p-2"><button data-navigation role="menuitem" type="button" onClick={() => go('/settings', { tab: 'profile' })} className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-content-secondary hover:bg-surface-muted"><UserRound className="h-4 w-4" /> My Profile</button><button data-navigation role="menuitem" type="button" onClick={() => go('/settings')} className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-content-secondary hover:bg-surface-muted"><Settings className="h-4 w-4" /> Settings</button><div className="px-1 py-1"><ToggleSwitch label="Dark Mode" checked={resolvedTheme === 'dark'} onChange={(checked) => setTheme(checked ? 'dark' : 'light')} /></div><button data-navigation role="menuitem" type="button" onClick={() => go('/help')} className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-content-secondary hover:bg-surface-muted"><CircleHelp className="h-4 w-4" /> Help & Support</button></div>
    <div className="border-t border-outline-subtle p-2"><button role="menuitem" type="button" onClick={() => { setOpen(false); onRequestLogout(); }} className="flex min-h-touch w-full items-center gap-3 rounded-xl px-3 text-sm font-bold text-rose-500 hover:bg-rose-50"><LogOut className="h-4 w-4" /> Logout</button></div>
  </Popover>;
};
