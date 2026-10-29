import { supabase } from '../lib/supabase';
import type {
  AdminUser,
  AdminAuditLog,
  PlatformSettings,
  AdminCourse,
  AdminLesson,
  UserRole,
} from '../types/admin';
import type { DbCourse, DbLesson } from '../types/database';
import { extractYouTubeVideoId, generateSlug, getCategoryLabel } from '../utils/adminHelpers';

export const adminService = {
  // ============================================================================
  // 1. AUDIT LOGGING HELPER
  // ============================================================================
  recordAuditLog: async (
    action: string,
    entityType: string,
    entityId: string,
    metadata: Record<string, unknown> = {}
  ): Promise<void> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const actorId = sessionData.session?.user?.id || null;

      const { error } = await supabase.from('audit_logs').insert({
        actor_id: actorId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        metadata: metadata as any,
      });

      if (error) {
        console.warn('Failed to record audit log:', error.message);
      }
    } catch (err) {
      console.warn('Error recording audit log:', err);
    }
  },

  // ============================================================================
  // 2. USER MANAGEMENT (profiles)
  // ============================================================================
  getUsers: async (params?: {
    search?: string;
    role?: 'all' | UserRole;
    status?: 'all' | 'active' | 'suspended';
    page?: number;
    limit?: number;
  }): Promise<{
    users: AdminUser[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('profiles')
      .select('id, name, email, avatar, role, is_active, created_at', { count: 'exact' });

    if (params?.search && params.search.trim()) {
      const term = `%${params.search.trim()}%`;
      query = query.or(`name.ilike.${term},email.ilike.${term}`);
    }

    if (params?.role && params.role !== 'all') {
      query = query.eq('role', params.role);
    }

    if (params?.status && params.status !== 'all') {
      query = query.eq('is_active', params.status === 'active');
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching admin users:', error);
      throw new Error(error.message);
    }

    const total = count || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const users: AdminUser[] = (data || []).map((row) => {
      const date = row.created_at ? new Date(row.created_at) : new Date();
      const joinedDate = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

      return {
        id: row.id,
        name: row.name || row.email.split('@')[0],
        email: row.email,
        role: row.role as UserRole,
        avatar:
          row.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(row.name || row.email)}`,
        status: row.is_active ? 'active' : 'suspended',
        isActive: !!row.is_active,
        joinedDate,
      };
    });

    return {
      users,
      total,
      page,
      totalPages,
    };
  },

  updateUserRole: async (
    userId: string,
    newRole: UserRole,
    currentAdminId?: string
  ): Promise<void> => {
    // Client-side self-demotion prevention
    if (currentAdminId && userId === currentAdminId && newRole !== 'admin') {
      throw new Error('Anda tidak dapat menurunkan role akun administrator Anda sendiri.');
    }

    // Fetch previous role for audit details
    const { data: previous } = await supabase
      .from('profiles')
      .select('name, role')
      .eq('id', userId)
      .maybeSingle();

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user role:', error);
      throw new Error(error.message);
    }

    await adminService.recordAuditLog('USER_ROLE_CHANGE', 'profiles', userId, {
      userName: previous?.name,
      from: previous?.role,
      to: newRole,
    });
  },

  toggleUserStatus: async (
    userId: string,
    currentStatus: 'active' | 'suspended',
    currentAdminId?: string
  ): Promise<boolean> => {
    // Client-side self-suspension prevention
    if (currentAdminId && userId === currentAdminId && currentStatus === 'active') {
      throw new Error('Anda tidak dapat menonaktifkan akun administrator Anda sendiri.');
    }

    const nextActive = currentStatus !== 'active';

    const { data: previous } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .maybeSingle();

    const { error } = await supabase
      .from('profiles')
      .update({ is_active: nextActive })
      .eq('id', userId);

    if (error) {
      console.error('Error toggling user status:', error);
      throw new Error(error.message);
    }

    const action = nextActive ? 'USER_ACTIVATE' : 'USER_SUSPEND';
    await adminService.recordAuditLog(action, 'profiles', userId, {
      userName: previous?.name,
      newStatus: nextActive ? 'active' : 'suspended',
    });

    return nextActive;
  },

  // ============================================================================
  // 3. COURSE MANAGEMENT (courses)
  // ============================================================================
  generateUniqueSlug: async (title: string, excludeCourseId?: string): Promise<string> => {
    const baseSlug = generateSlug(title) || 'course';
    let candidate = baseSlug;
    let counter = 1;

    // Check availability against database
    while (true) {
      let query = supabase.from('courses').select('id').eq('slug', candidate);
      if (excludeCourseId) {
        query = query.neq('id', excludeCourseId);
      }
      const { data, error } = await query.maybeSingle();
      if (error && error.code !== 'PGRST116') {
        console.warn('Slug check error:', error);
        break;
      }
      if (!data) {
        return candidate;
      }
      candidate = `${baseSlug}-${counter}`;
      counter++;
    }

    return candidate;
  },

  getCourses: async (params?: {
    search?: string;
    category?: string;
    status?: string;
  }): Promise<AdminCourse[]> => {
    let query = supabase
      .from('courses')
      .select(`
        id,
        title,
        slug,
        description,
        thumbnail_url,
        category,
        level,
        price,
        status,
        created_at,
        mentor_id,
        profiles:mentor_id (
          id,
          name,
          avatar
        ),
        lessons:lessons (count),
        enrollments:enrollments (count)
      `)
      .order('created_at', { ascending: false });

    if (params?.category && params.category !== 'all') {
      query = query.eq('category', params.category);
    }

    if (params?.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching admin courses:', error);
      throw new Error(error.message);
    }

    let coursesList = (data || []).map((row: any) => {
      const instructorName = row.profiles?.name || 'Administrator';
      const instructorAvatar =
        row.profiles?.avatar ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(instructorName)}`;

      const studentsCount = Array.isArray(row.enrollments) && row.enrollments[0]
        ? row.enrollments[0].count
        : (row.enrollments?.count || 0);

      const lessonsCount = Array.isArray(row.lessons) && row.lessons[0]
        ? row.lessons[0].count
        : (row.lessons?.count || 0);

      const createdAtStr = row.created_at
        ? new Date(row.created_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        description: row.description,
        category: row.category,
        categoryLabel: getCategoryLabel(row.category),
        level: row.level,
        instructor: instructorName,
        instructorAvatar,
        studentsCount,
        rating: 5.0,
        status: row.status as 'published' | 'draft',
        price: Number(row.price) || 0,
        createdAt: createdAtStr,
        thumbnail:
          row.thumbnail_url ||
          'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80',
        lessonsCount,
      } as AdminCourse;
    });

    if (params?.search && params.search.trim()) {
      const s = params.search.trim().toLowerCase();
      coursesList = coursesList.filter(
        (c) => c.title.toLowerCase().includes(s) || c.instructor.toLowerCase().includes(s)
      );
    }

    return coursesList;
  },

  createCourse: async (data: {
    title: string;
    description?: string;
    category: 'frontend' | 'design' | 'branding' | 'mobile' | 'devops' | 'general';
    level?: 'beginner' | 'intermediate' | 'advanced';
    thumbnail_url?: string;
    price: number;
    status: 'draft' | 'published';
  }): Promise<DbCourse> => {
    const slug = await adminService.generateUniqueSlug(data.title);

    const { data: sessionData } = await supabase.auth.getSession();
    const mentorId = sessionData.session?.user?.id || null;

    const { data: created, error } = await supabase
      .from('courses')
      .insert({
        title: data.title.trim(),
        slug,
        description: data.description?.trim() || null,
        category: data.category,
        level: data.level || 'beginner',
        thumbnail_url: data.thumbnail_url?.trim() || null,
        price: Number(data.price) || 0,
        status: data.status,
        mentor_id: mentorId,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating course:', error);
      throw new Error(error.message);
    }

    await adminService.recordAuditLog('COURSE_CREATE', 'courses', created.id, {
      title: created.title,
      slug: created.slug,
      category: created.category,
      price: created.price,
      status: created.status,
    });

    return created;
  },

  updateCourse: async (
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
  ): Promise<DbCourse> => {
    const payload: Record<string, unknown> = {};

    if (data.title !== undefined) {
      payload.title = data.title.trim();
    }
    if (data.description !== undefined) {
      payload.description = data.description ? data.description.trim() : null;
    }
    if (data.category !== undefined) {
      payload.category = data.category;
    }
    if (data.level !== undefined) {
      payload.level = data.level;
    }
    if (data.thumbnail_url !== undefined) {
      payload.thumbnail_url = data.thumbnail_url ? data.thumbnail_url.trim() : null;
    }
    if (data.price !== undefined) {
      payload.price = Number(data.price) || 0;
    }
    if (data.status !== undefined) {
      payload.status = data.status;
    }

    const { data: updated, error } = await supabase
      .from('courses')
      .update(payload)
      .eq('id', courseId)
      .select()
      .single();

    if (error) {
      console.error('Error updating course:', error);
      throw new Error(error.message);
    }

    await adminService.recordAuditLog('COURSE_UPDATE', 'courses', courseId, {
      changes: Object.keys(payload),
      title: updated.title,
      status: updated.status,
    });

    return updated;
  },

  toggleCoursePublish: async (
    courseId: string,
    currentStatus: 'published' | 'draft' | string
  ): Promise<'published' | 'draft'> => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';

    const { data: updated, error } = await supabase
      .from('courses')
      .update({ status: nextStatus })
      .eq('id', courseId)
      .select('id, title, status')
      .single();

    if (error) {
      console.error('Error toggling course status:', error);
      throw new Error(error.message);
    }

    const action = nextStatus === 'published' ? 'COURSE_PUBLISH' : 'COURSE_UNPUBLISH';
    await adminService.recordAuditLog(action, 'courses', courseId, {
      title: updated.title,
      newStatus: nextStatus,
    });

    return nextStatus as 'published' | 'draft';
  },

  /**
   * Safe course deletion policy:
   * If a course has active enrollments, hard-deletion is blocked to preserve student progress,
   * grades, and historical logs. Instead, the admin is advised to change the course to 'draft'.
   */
  deleteCourse: async (
    courseId: string
  ): Promise<{
    success: boolean;
    hasEnrollments: boolean;
    enrollmentCount?: number;
    message?: string;
  }> => {
    // 1. Check whether any students are enrolled in this course
    const { count, error: countError } = await supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', courseId);

    if (countError) {
      console.error('Error checking course enrollments:', countError);
    }

    if (count && count > 0) {
      return {
        success: false,
        hasEnrollments: true,
        enrollmentCount: count,
        message: `Kursus memiliki ${count} siswa terdaftar. Penghapusan permanen diblokir demi menjaga data progres dan riwayat belajar siswa. Sebaiknya ubah status kursus menjadi 'Draft' (Unpublish) agar tidak lagi muncul di katalog siswa baru.`,
      };
    }

    // 2. Fetch course title for audit record before deletion
    const { data: targetCourse } = await supabase
      .from('courses')
      .select('title')
      .eq('id', courseId)
      .maybeSingle();

    // 3. Perform hard delete if 0 enrollments
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);

    if (deleteError) {
      console.error('Error deleting course:', deleteError);
      throw new Error(deleteError.message);
    }

    await adminService.recordAuditLog('COURSE_DELETE', 'courses', courseId, {
      title: targetCourse?.title,
    });

    return {
      success: true,
      hasEnrollments: false,
    };
  },

  // ============================================================================
  // 4. LESSON MANAGEMENT (lessons per course)
  // ============================================================================
  getCourseLessons: async (courseId: string): Promise<AdminLesson[]> => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Error fetching lessons:', error);
      throw new Error(error.message);
    }

    return (data || []).map((row) => ({
      id: row.id,
      courseId: row.course_id,
      title: row.title,
      description: row.description,
      youtubeUrl: row.youtube_url,
      youtubeVideoId: row.youtube_video_id,
      durationSeconds: row.duration_seconds || 0,
      position: row.position,
      isPreview: !!row.is_preview,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  },

  createLesson: async (
    courseId: string,
    data: {
      title: string;
      description?: string;
      youtubeUrl: string;
      durationSeconds?: number;
      isPreview?: boolean;
    }
  ): Promise<DbLesson> => {
    // 1. Parse and validate YouTube URL
    const yt = extractYouTubeVideoId(data.youtubeUrl);
    if (!yt.isValid || !yt.videoId) {
      throw new Error('URL YouTube tidak valid. Harap masukkan link video YouTube yang valid (watch, share youtu.be, shorts, embed) atau 11 digit video ID.');
    }

    // 2. Determine next position
    const { data: lastLesson } = await supabase
      .from('lessons')
      .select('position')
      .eq('course_id', courseId)
      .order('position', { ascending: false })
      .limit(1)
      .maybeSingle();

    const nextPosition = (lastLesson?.position || 0) + 1;

    // 3. Insert into lessons
    const { data: created, error } = await supabase
      .from('lessons')
      .insert({
        course_id: courseId,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        youtube_url: yt.normalizedUrl || data.youtubeUrl.trim(),
        youtube_video_id: yt.videoId,
        duration_seconds: Number(data.durationSeconds) || 0,
        position: nextPosition,
        is_preview: !!data.isPreview,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lesson:', error);
      throw new Error(error.message);
    }

    await adminService.recordAuditLog('LESSON_CREATE', 'lessons', created.id, {
      courseId,
      title: created.title,
      position: created.position,
      youtubeVideoId: created.youtube_video_id,
      isPreview: created.is_preview,
    });

    return created;
  },

  updateLesson: async (
    lessonId: string,
    courseId: string,
    data: {
      title?: string;
      description?: string | null;
      youtubeUrl?: string;
      durationSeconds?: number;
      isPreview?: boolean;
    }
  ): Promise<DbLesson> => {
    const payload: Record<string, unknown> = {};

    if (data.title !== undefined) {
      payload.title = data.title.trim();
    }
    if (data.description !== undefined) {
      payload.description = data.description ? data.description.trim() : null;
    }
    if (data.durationSeconds !== undefined) {
      payload.duration_seconds = Number(data.durationSeconds) || 0;
    }
    if (data.isPreview !== undefined) {
      payload.is_preview = !!data.isPreview;
    }

    if (data.youtubeUrl !== undefined) {
      const yt = extractYouTubeVideoId(data.youtubeUrl);
      if (!yt.isValid || !yt.videoId) {
        throw new Error('URL YouTube tidak valid. Harap masukkan link video YouTube yang valid.');
      }
      payload.youtube_url = yt.normalizedUrl || data.youtubeUrl.trim();
      payload.youtube_video_id = yt.videoId;
    }

    const { data: updated, error } = await supabase
      .from('lessons')
      .update(payload)
      .eq('id', lessonId)
      .select()
      .single();

    if (error) {
      console.error('Error updating lesson:', error);
      throw new Error(error.message);
    }

    await adminService.recordAuditLog('LESSON_UPDATE', 'lessons', lessonId, {
      courseId,
      changes: Object.keys(payload),
      title: updated.title,
    });

    return updated;
  },

  deleteLesson: async (lessonId: string, courseId: string): Promise<void> => {
    const { data: targetLesson } = await supabase
      .from('lessons')
      .select('title, position')
      .eq('id', lessonId)
      .maybeSingle();

    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lessonId);

    if (deleteError) {
      console.error('Error deleting lesson:', deleteError);
      throw new Error(deleteError.message);
    }

    await adminService.recordAuditLog('LESSON_DELETE', 'lessons', lessonId, {
      courseId,
      title: targetLesson?.title,
      position: targetLesson?.position,
    });

    // Re-pack positions for remaining lessons
    const remaining = await adminService.getCourseLessons(courseId);
    if (remaining.length > 0) {
      const remainingIds = remaining.map((l) => l.id);
      await adminService.reorderLessons(courseId, remainingIds);
    }
  },

  reorderLessons: async (courseId: string, orderedLessonIds: string[]): Promise<void> => {
    if (!orderedLessonIds || orderedLessonIds.length === 0) return;

    // Try PostgreSQL RPC function first
    const { error: rpcError } = await supabase.rpc('reorder_lessons', {
      p_course_id: courseId,
      p_lesson_ids: orderedLessonIds,
    });

    if (rpcError) {
      console.warn('reorder_lessons RPC failed or not yet deployed, using 2-step fallback:', rpcError.message);
      // Fallback: update positions with temporary negative values then positive
      for (let i = 0; i < orderedLessonIds.length; i++) {
        await supabase
          .from('lessons')
          .update({ position: -(i + 1) })
          .eq('id', orderedLessonIds[i])
          .eq('course_id', courseId);
      }
      for (let i = 0; i < orderedLessonIds.length; i++) {
        await supabase
          .from('lessons')
          .update({ position: i + 1 })
          .eq('id', orderedLessonIds[i])
          .eq('course_id', courseId);
      }
    }

    await adminService.recordAuditLog('LESSON_REORDER', 'lessons', courseId, {
      totalLessons: orderedLessonIds.length,
      orderedIds: orderedLessonIds,
    });
  },

  // ============================================================================
  // 5. PLATFORM SETTINGS (platform_settings)
  // ============================================================================
  getSettings: async (): Promise<PlatformSettings> => {
    const { data, error } = await supabase
      .from('platform_settings')
      .select('*')
      .eq('id', true)
      .maybeSingle();

    if (error) {
      console.error('Error reading platform settings:', error);
      throw new Error(error.message);
    }

    if (!data) {
      return {
        platformName: 'Coursue',
        supportEmail: 'support@coursue.test',
        allowRegistration: true,
        maintenanceMode: false,
        maxUploadSizeMb: 10,
        updatedBy: 'system',
        updatedAt: new Date().toLocaleDateString('en-GB'),
      };
    }

    const updatedAtStr = data.updated_at
      ? new Date(data.updated_at).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : new Date().toLocaleDateString('en-GB');

    return {
      platformName: data.platform_name,
      supportEmail: data.support_email,
      allowRegistration: data.allow_registration,
      maintenanceMode: data.maintenance_mode,
      maxUploadSizeMb: data.max_upload_size_mb,
      updatedBy: data.updated_by || 'Admin',
      updatedAt: updatedAtStr,
    };
  },

  updateSettings: async (newSettings: Partial<PlatformSettings>): Promise<PlatformSettings> => {
    const { data: sessionData } = await supabase.auth.getSession();
    const adminId = sessionData.session?.user?.id || null;

    const payload: Record<string, unknown> = {
      updated_by: adminId,
      updated_at: new Date().toISOString(),
    };

    if (newSettings.platformName !== undefined) payload.platform_name = newSettings.platformName;
    if (newSettings.supportEmail !== undefined) payload.support_email = newSettings.supportEmail;
    if (newSettings.allowRegistration !== undefined) payload.allow_registration = newSettings.allowRegistration;
    if (newSettings.maintenanceMode !== undefined) payload.maintenance_mode = newSettings.maintenanceMode;
    if (newSettings.maxUploadSizeMb !== undefined) payload.max_upload_size_mb = newSettings.maxUploadSizeMb;

    const { data, error } = await supabase
      .from('platform_settings')
      .update(payload)
      .eq('id', true)
      .select()
      .single();

    if (error) {
      console.error('Error updating platform settings:', error);
      throw new Error(error.message);
    }

    await adminService.recordAuditLog('PLATFORM_SETTINGS_UPDATE', 'platform_settings', 'singleton', {
      changes: Object.keys(payload).filter((k) => k !== 'updated_by' && k !== 'updated_at'),
      maintenanceMode: data.maintenance_mode,
    });

    return await adminService.getSettings();
  },

  // ============================================================================
  // 6. AUDIT LOGS QUERY (audit_logs)
  // ============================================================================
  getAuditLogs: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    logs: AdminAuditLog[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    const page = params?.page || 1;
    const limit = params?.limit || 15;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('audit_logs')
      .select(`
        id,
        actor_id,
        action,
        entity_type,
        entity_id,
        metadata,
        created_at,
        profiles:actor_id (
          id,
          name,
          email,
          role
        )
      `, { count: 'exact' });

    if (params?.search && params.search.trim()) {
      const term = `%${params.search.trim()}%`;
      query = query.or(`action.ilike.${term},entity_type.ilike.${term},entity_id.ilike.${term}`);
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching audit logs:', error);
      throw new Error(error.message);
    }

    const total = count || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const logs: AdminAuditLog[] = (data || []).map((row: any) => {
      const date = row.created_at ? new Date(row.created_at) : new Date();
      const dateStr = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeStr = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });

      const actorProfile = row.profiles;
      const actorName = actorProfile?.name || (row.actor_id ? 'Administrator' : 'System Service');
      const actorRole = (actorProfile?.role as UserRole) || 'admin';

      return {
        id: row.id,
        actorId: row.actor_id || 'system',
        actorName,
        actorRole,
        action: row.action,
        entityType: row.entity_type,
        entityId: row.entity_id || '-',
        metadata: (row.metadata as Record<string, unknown>) || {},
        createdAt: `${dateStr}, ${timeStr}`,
      };
    });

    return {
      logs,
      total,
      page,
      totalPages,
    };
  },

  // ============================================================================
  // 7. STATS & OVERVIEW
  // ============================================================================
  getStats: async (): Promise<{
    totalStudents: number;
    totalMentors: number;
    totalCourses: number;
    publishedCourses: number;
  }> => {
    try {
      const [studentsRes, mentorsRes, coursesRes, publishedRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'mentor'),
        supabase.from('courses').select('id', { count: 'exact', head: true }),
        supabase.from('courses').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      ]);

      return {
        totalStudents: studentsRes.count || 0,
        totalMentors: mentorsRes.count || 0,
        totalCourses: coursesRes.count || 0,
        publishedCourses: publishedRes.count || 0,
      };
    } catch (err) {
      console.warn('Error fetching admin stats:', err);
      return {
        totalStudents: 0,
        totalMentors: 0,
        totalCourses: 0,
        publishedCourses: 0,
      };
    }
  },
};

