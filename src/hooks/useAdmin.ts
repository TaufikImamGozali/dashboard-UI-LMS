import { useState, useEffect, useCallback, useRef } from 'react';
import type {
  AdminUser,
  AdminAuditLog,
  PlatformSettings,
  AdminCourse,
  UserRole,
} from '../types/admin';
import { adminService } from '../services/adminService';
import { supabase } from '../lib/supabase';

const defaultSettings: PlatformSettings = {
  platformName: 'Coursue',
  supportEmail: 'support@coursue.test',
  allowRegistration: true,
  maintenanceMode: false,
  maxUploadSizeMb: 10,
  updatedBy: 'Admin',
  updatedAt: new Date().toLocaleDateString('en-GB'),
};

export const useAdmin = () => {
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);

  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersSearch, setUsersSearch] = useState('');
  const [usersRoleFilter, setUsersRoleFilter] = useState<'all' | UserRole>('all');
  const [usersStatusFilter, setUsersStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');

  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [coursesSearch, setCoursesSearch] = useState('');
  const [coursesCategoryFilter, setCoursesCategoryFilter] = useState('all');
  const [coursesStatusFilter, setCoursesStatusFilter] = useState('all');

  const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);

  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  const [auditLogsTotal, setAuditLogsTotal] = useState(0);
  const [auditLogsPage, setAuditLogsPage] = useState(1);
  const [auditLogsTotalPages, setAuditLogsTotalPages] = useState(1);
  const [auditLogsSearch, setAuditLogsSearch] = useState('');

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalMentors: 0,
    totalCourses: 0,
    publishedCourses: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch current user id
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (isMounted.current && data.session?.user) {
        setCurrentAdminId(data.session.user.id);
      }
    });
  }, []);

  // ============================================================================
  // LOAD USERS
  // ============================================================================
  const fetchUsers = useCallback(async () => {
    try {
      const res = await adminService.getUsers({
        search: usersSearch,
        role: usersRoleFilter,
        status: usersStatusFilter,
        page: usersPage,
        limit: 10,
      });
      if (isMounted.current) {
        setUsers(res.users);
        setUsersTotal(res.total);
        setUsersTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  }, [usersSearch, usersRoleFilter, usersStatusFilter, usersPage]);

  useEffect(() => {
    void (async () => {
      await fetchUsers();
    })();
  }, [fetchUsers]);

  // ============================================================================
  // LOAD COURSES
  // ============================================================================
  const fetchCourses = useCallback(async () => {
    try {
      const list = await adminService.getCourses({
        search: coursesSearch,
        category: coursesCategoryFilter,
        status: coursesStatusFilter,
      });
      if (isMounted.current) {
        setCourses(list);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  }, [coursesSearch, coursesCategoryFilter, coursesStatusFilter]);

  useEffect(() => {
    void (async () => {
      await fetchCourses();
    })();
  }, [fetchCourses]);

  // ============================================================================
  // LOAD SETTINGS
  // ============================================================================
  const fetchSettings = useCallback(async () => {
    try {
      const s = await adminService.getSettings();
      if (isMounted.current) {
        setSettings(s);
      }
    } catch (err) {
      console.error('Failed to load platform settings:', err);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchSettings();
    })();
  }, [fetchSettings]);

  // ============================================================================
  // LOAD AUDIT LOGS
  // ============================================================================
  const fetchAuditLogs = useCallback(async () => {
    try {
      const res = await adminService.getAuditLogs({
        search: auditLogsSearch,
        page: auditLogsPage,
        limit: 15,
      });
      if (isMounted.current) {
        setAuditLogs(res.logs);
        setAuditLogsTotal(res.total);
        setAuditLogsTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  }, [auditLogsSearch, auditLogsPage]);

  useEffect(() => {
    void (async () => {
      await fetchAuditLogs();
    })();
  }, [fetchAuditLogs]);

  // ============================================================================
  // LOAD STATS
  // ============================================================================
  const fetchStats = useCallback(async () => {
    try {
      const st = await adminService.getStats();
      if (isMounted.current) {
        setStats(st);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await fetchStats();
    })();
  }, [fetchStats]);

  // Refresh all
  const refreshAll = useCallback(async () => {
    setIsLoading(true);
    await Promise.all([
      fetchUsers(),
      fetchCourses(),
      fetchSettings(),
      fetchAuditLogs(),
      fetchStats(),
    ]);
    if (isMounted.current) {
      setIsLoading(false);
    }
  }, [fetchUsers, fetchCourses, fetchSettings, fetchAuditLogs, fetchStats]);

  // ============================================================================
  // MUTATION HANDLERS
  // ============================================================================
  const updateUserRole = useCallback(
    async (userId: string, newRole: UserRole) => {
      await adminService.updateUserRole(userId, newRole, currentAdminId || undefined);
      await Promise.all([fetchUsers(), fetchAuditLogs(), fetchStats()]);
    },
    [currentAdminId, fetchUsers, fetchAuditLogs, fetchStats]
  );

  const toggleUserStatus = useCallback(
    async (userId: string) => {
      const targetUser = users.find((u) => u.id === userId);
      if (!targetUser) return;
      await adminService.toggleUserStatus(
        userId,
        targetUser.status,
        currentAdminId || undefined
      );
      await Promise.all([fetchUsers(), fetchAuditLogs(), fetchStats()]);
    },
    [users, currentAdminId, fetchUsers, fetchAuditLogs, fetchStats]
  );

  const updateSettings = useCallback(
    async (newSettings: Partial<PlatformSettings>) => {
      const updated = await adminService.updateSettings(newSettings);
      if (isMounted.current) {
        setSettings(updated);
      }
      await fetchAuditLogs();
    },
    [fetchAuditLogs]
  );

  const toggleCoursePublish = useCallback(
    async (courseId: string) => {
      const target = courses.find((c) => c.id === courseId);
      if (!target) return;
      await adminService.toggleCoursePublish(courseId, target.status);
      await Promise.all([fetchCourses(), fetchAuditLogs(), fetchStats()]);
    },
    [courses, fetchCourses, fetchAuditLogs, fetchStats]
  );

  const addCourse = useCallback(
    async (newCourse: {
      title: string;
      category: 'frontend' | 'design' | 'branding' | 'mobile' | 'devops' | 'general';
      level?: 'beginner' | 'intermediate' | 'advanced';
      thumbnail_url?: string;
      price: number;
      status: 'draft' | 'published';
      description?: string;
    }) => {
      const created = await adminService.createCourse(newCourse);
      await Promise.all([fetchCourses(), fetchAuditLogs(), fetchStats()]);
      return created;
    },
    [fetchCourses, fetchAuditLogs, fetchStats]
  );

  const editCourse = useCallback(
    async (
      courseId: string,
      data: {
        title?: string;
        description?: string | null;
        category?: 'frontend' | 'design' | 'branding' | 'mobile' | 'devops' | 'general';
        level?: 'beginner' | 'intermediate' | 'advanced';
        thumbnail_url?: string | null;
        price?: number;
        status?: 'draft' | 'published';
      }
    ) => {
      const updated = await adminService.updateCourse(courseId, data);
      await Promise.all([fetchCourses(), fetchAuditLogs(), fetchStats()]);
      return updated;
    },
    [fetchCourses, fetchAuditLogs, fetchStats]
  );

  const deleteCourse = useCallback(
    async (courseId: string) => {
      const result = await adminService.deleteCourse(courseId);
      if (result.success) {
        await Promise.all([fetchCourses(), fetchAuditLogs(), fetchStats()]);
      }
      return result;
    },
    [fetchCourses, fetchAuditLogs, fetchStats]
  );

  return {
    currentAdminId,
    isLoading,
    // Users
    users,
    usersTotal,
    usersPage,
    usersTotalPages,
    setUsersPage,
    usersSearch,
    setUsersSearch,
    usersRoleFilter,
    setUsersRoleFilter,
    usersStatusFilter,
    setUsersStatusFilter,
    fetchUsers,
    updateUserRole,
    toggleUserStatus,
    // Courses
    courses,
    coursesSearch,
    setCoursesSearch,
    coursesCategoryFilter,
    setCoursesCategoryFilter,
    coursesStatusFilter,
    setCoursesStatusFilter,
    fetchCourses,
    addCourse,
    editCourse,
    deleteCourse,
    toggleCoursePublish,
    // Settings
    settings,
    updateSettings,
    fetchSettings,
    // Audit Logs
    auditLogs,
    auditLogsTotal,
    auditLogsPage,
    auditLogsTotalPages,
    setAuditLogsPage,
    auditLogsSearch,
    setAuditLogsSearch,
    fetchAuditLogs,
    // Stats & Overall
    stats,
    refreshAll,
  };
};
