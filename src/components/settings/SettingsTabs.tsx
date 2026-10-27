import React from 'react';
import { Bell, Palette, Shield, UserRound } from 'lucide-react';

export type SettingsTab = 'profile' | 'appearance' | 'notifications' | 'account';
const items = [{ id: 'profile', label: 'Profile', icon: UserRound }, { id: 'appearance', label: 'Appearance', icon: Palette }, { id: 'notifications', label: 'Notifications', icon: Bell }, { id: 'account', label: 'Account', icon: Shield }] as const;

interface SettingsTabsProps { active: SettingsTab; onChange: (tab: SettingsTab) => void }
export const SettingsTabs: React.FC<SettingsTabsProps> = ({ active, onChange }) => <div role="tablist" aria-label="Settings sections" className="flex gap-2 overflow-x-auto border-b border-outline-subtle p-3 md:w-56 md:shrink-0 md:flex-col md:border-b-0 md:border-r">{items.map(({ id, label, icon: Icon }) => <button key={id} type="button" role="tab" aria-selected={active === id} onClick={() => onChange(id)} className={`flex min-h-touch shrink-0 items-center gap-3 rounded-xl px-4 text-left text-sm font-bold transition-colors focus-visible:ring-2 focus-visible:ring-brand-400 ${active === id ? 'bg-brand-50 text-brand-600' : 'text-content-secondary hover:bg-surface-muted'}`}><Icon className="h-4 w-4" />{label}</button>)}</div>;
