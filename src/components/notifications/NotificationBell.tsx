import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import { Popover } from '../ui/Popover';
import { NotificationItem } from './NotificationItem';

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const visible = tab === 'unread' ? notifications.filter((item) => !item.isRead) : notifications.slice(0, 6);
  return <Popover open={open} onOpenChange={setOpen} label="Notifications" trigger={(props) => <button type="button" {...props} title="Notifications" aria-label={`Notifications, ${unreadCount} unread`} className="relative flex h-10 w-10 items-center justify-center rounded-full border border-outline bg-surface text-content-secondary shadow-2xs transition-colors hover:bg-surface-muted hover:text-brand-500 focus-visible:ring-2 focus-visible:ring-brand-400"><Bell className="h-4 w-4" />{unreadCount > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-surface" />}</button>}>
    <div className="flex items-center justify-end border-b border-outline-subtle px-5 py-3 md:justify-between md:py-4"><h2 className="hidden text-base font-extrabold text-content-primary md:block">Notifications</h2><button type="button" onClick={markAllAsRead} disabled={!unreadCount} className="min-h-touch text-xs font-bold text-brand-600 disabled:text-content-muted">Mark all as read</button></div>
    <div className="flex gap-1 border-b border-outline-subtle px-5 py-2" role="tablist" aria-label="Notification status"><button type="button" role="tab" aria-selected={tab === 'all'} onClick={() => setTab('all')} className={`min-h-touch rounded-full px-4 text-xs font-bold ${tab === 'all' ? 'bg-brand-500 text-white' : 'text-content-secondary hover:bg-surface-muted'}`}>All</button><button type="button" role="tab" aria-selected={tab === 'unread'} onClick={() => setTab('unread')} className={`min-h-touch rounded-full px-4 text-xs font-bold ${tab === 'unread' ? 'bg-brand-500 text-white' : 'text-content-secondary hover:bg-surface-muted'}`}>Unread</button></div>
    <div role="menu">{visible.map((item) => <NotificationItem key={item.id} notification={item} menuItem onSelect={(selected) => { markAsRead(selected.id); setOpen(false); navigate(selected.href); }} />)}{visible.length === 0 && <div className="flex flex-col items-center px-6 py-12 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500"><BellOff className="h-6 w-6" /></span><p className="mt-3 text-sm font-extrabold text-content-primary">You're all caught up</p><p className="mt-1 text-xs text-content-muted">There are no notifications to show.</p></div>}</div>
    <div className="flex items-center justify-between border-t border-outline-subtle px-5 py-3"><button type="button" onClick={clearAll} disabled={!notifications.length} className="min-h-touch text-xs font-bold text-rose-500 disabled:text-content-muted">Clear all</button><button type="button" data-navigation onClick={() => { setOpen(false); navigate('/notifications'); }} className="min-h-touch text-xs font-bold text-brand-600">View all</button></div>
  </Popover>;
};
