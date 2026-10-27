import { createContext } from 'react';
import type { AppNotification } from '../types/notification';

export interface NotificationsContextValue { notifications: AppNotification[]; unreadCount: number; markAsRead: (id: string) => void; markAllAsRead: () => void; clearAll: () => void }
export const NotificationsContext = createContext<NotificationsContextValue | null>(null);
