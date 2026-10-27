import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { NotificationsContext } from '../contexts/NotificationsContext';
import { useProfile } from '../hooks/useProfile';
import { notificationsService } from '../services/notificationsService';

export const NotificationsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [stored, setStored] = useState(notificationsService.getAll);
  const { preferences } = useProfile();
  useEffect(() => notificationsService.save(stored), [stored]);
  const notifications = useMemo(() => stored.filter((item) => !item.isDeleted && preferences[item.type]), [preferences, stored]);
  const unreadCount = useMemo(() => notifications.filter((item) => !item.isRead).length, [notifications]);
  const markAsRead = useCallback((id: string) => setStored((items) => items.map((item) => item.id === id ? { ...item, isRead: true } : item)), []);
  const markAllAsRead = useCallback(() => setStored((items) => items.map((item) => ({ ...item, isRead: true }))), []);
  const clearAll = useCallback(() => setStored((items) => items.map((item) => ({ ...item, isDeleted: true }))), []);
  const value = useMemo(() => ({ notifications, unreadCount, markAsRead, markAllAsRead, clearAll }), [clearAll, markAllAsRead, markAsRead, notifications, unreadCount]);
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};
