import React from 'react';
import { BellRing, BookOpen, CheckSquare, Mail, Users } from 'lucide-react';
import type { AppNotification, NotificationType } from '../../types/notification';
import { relativeTime } from '../../utils/date';

const icons: Record<NotificationType, React.ReactNode> = {
  course: <BookOpen className="h-4 w-4" />,
  task: <CheckSquare className="h-4 w-4" />,
  message: <Mail className="h-4 w-4" />,
  group: <Users className="h-4 w-4" />,
};
const tones: Record<NotificationType, string> = { course: 'bg-sky-50 text-sky-600', task: 'bg-amber-50 text-amber-600', message: 'bg-brand-50 text-brand-600', group: 'bg-emerald-50 text-emerald-600' };

interface NotificationItemProps { notification: AppNotification; onSelect: (notification: AppNotification) => void; menuItem?: boolean }

export const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onSelect, menuItem = false }) => (
  <button type="button" data-navigation role={menuItem ? 'menuitem' : undefined} onClick={() => onSelect(notification)} className="flex w-full gap-3 border-b border-outline-subtle px-5 py-4 text-left transition-colors last:border-0 hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400">
    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[notification.type]}`}>{icons[notification.type] ?? <BellRing className="h-4 w-4" />}</span>
    <span className="min-w-0 flex-1"><span className="flex items-start justify-between gap-2"><span className="text-xs font-extrabold text-content-primary">{notification.title}</span>{!notification.isRead && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" aria-label="Unread" />}</span><span className="mt-1 block text-xs leading-relaxed text-content-secondary">{notification.description}</span><time className="mt-1.5 block text-micro font-semibold text-content-muted" dateTime={notification.createdAt}>{relativeTime(notification.createdAt)}</time></span>
  </button>
);
