import { createMockNotifications } from '../data/notifications';
import type { AppNotification } from '../types/notification';

const STORAGE_KEY = 'coursue_notifications_v1';

export const notificationsService = {
  getAll(): AppNotification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as AppNotification[]) : createMockNotifications();
    } catch {
      return createMockNotifications();
    }
  },
  save(items: AppNotification[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  },
};
