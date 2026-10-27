import { useState, useEffect, useCallback } from 'react';
import type { AdminUser, AdminAuditLog, PlatformSettings, AdminCourse, UserRole } from '../types/admin';
import {
  initialAdminUsers,
  initialPlatformSettings,
  initialAdminAuditLogs,
  initialAdminCourses,
} from '../data/adminMockData';

const STORAGE_KEYS = {
  USERS: 'coursue_admin_users_v1',
  SETTINGS: 'coursue_admin_settings_v1',
  LOGS: 'coursue_admin_logs_v1',
  COURSES: 'coursue_admin_courses_v1',
};

const getStored = <T>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const useAdmin = () => {
  const [users, setUsers] = useState<AdminUser[]>(() =>
    getStored(STORAGE_KEYS.USERS, initialAdminUsers)
  );
  const [settings, setSettings] = useState<PlatformSettings>(() =>
    getStored(STORAGE_KEYS.SETTINGS, initialPlatformSettings)
  );
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() =>
    getStored(STORAGE_KEYS.LOGS, initialAdminAuditLogs)
  );
  const [courses, setCourses] = useState<AdminCourse[]>(() =>
    getStored(STORAGE_KEYS.COURSES, initialAdminCourses)
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  // Helper to record an audit log
  const recordLog = useCallback(
    (action: string, entityType: string, entityId: string, metadata: Record<string, unknown> = {}) => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newLog: AdminAuditLog = {
        id: `log-${Date.now()}`,
        actorId: 'u-admin-1',
        actorName: 'Sarah Connor',
        actorRole: 'admin',
        action,
        entityType,
        entityId,
        metadata,
        createdAt: `${dateStr}, ${timeStr}`,
      };

      setAuditLogs((prev) => [newLog, ...prev]);
    },
    []
  );

  // User Actions
  const updateUserRole = useCallback(
    (userId: string, newRole: UserRole) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            recordLog('USER_ROLE_CHANGE', 'profiles', u.id, {
              userName: u.name,
              from: u.role,
              to: newRole,
            });
            return { ...u, role: newRole };
          }
          return u;
        })
      );
    },
    [recordLog]
  );

  const toggleUserStatus = useCallback(
    (userId: string) => {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === userId) {
            const nextStatus = u.status === 'active' ? 'suspended' : 'active';
            recordLog(
              nextStatus === 'suspended' ? 'USER_SUSPEND' : 'USER_ACTIVATE',
              'profiles',
              u.id,
              { userName: u.name, newStatus: nextStatus }
            );
            return { ...u, status: nextStatus };
          }
          return u;
        })
      );
    },
    [recordLog]
  );

  // Settings Actions
  const updateSettings = useCallback(
    (newSettings: Partial<PlatformSettings>) => {
      setSettings((prev) => {
        const updated = {
          ...prev,
          ...newSettings,
          updatedAt: new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        recordLog('PLATFORM_SETTINGS_UPDATE', 'platform_settings', 'singleton', {
          changes: Object.keys(newSettings),
        });
        return updated;
      });
    },
    [recordLog]
  );

  // Course Actions
  const toggleCoursePublish = useCallback(
    (courseId: string) => {
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id === courseId) {
            const nextStatus = c.status === 'published' ? 'draft' : 'published';
            recordLog(
              nextStatus === 'published' ? 'COURSE_PUBLISH' : 'COURSE_UNPUBLISH',
              'courses',
              c.id,
              { title: c.title, newStatus: nextStatus }
            );
            return { ...c, status: nextStatus };
          }
          return c;
        })
      );
    },
    [recordLog]
  );

  const addCourse = useCallback(
    (newCourse: Omit<AdminCourse, 'id' | 'createdAt' | 'studentsCount' | 'rating'>) => {
      const created: AdminCourse = {
        ...newCourse,
        id: `c-adm-${Date.now()}`,
        studentsCount: 0,
        rating: 5.0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCourses((prev) => [created, ...prev]);
      recordLog('COURSE_CREATE', 'courses', created.id, {
        title: created.title,
        category: created.category,
      });
      return created;
    },
    [recordLog]
  );

  const deleteCourse = useCallback(
    (courseId: string) => {
      setCourses((prev) => {
        const target = prev.find((c) => c.id === courseId);
        if (target) {
          recordLog('COURSE_DELETE', 'courses', courseId, {
            title: target.title,
          });
        }
        return prev.filter((c) => c.id !== courseId);
      });
    },
    [recordLog]
  );

  return {
    users,
    settings,
    auditLogs,
    courses,
    updateUserRole,
    toggleUserStatus,
    updateSettings,
    toggleCoursePublish,
    addCourse,
    deleteCourse,
    recordLog,
  };
};
