import { supabase } from '../lib/supabase';
import type { DbAnnouncementInsert, DbAnnouncementUpdate } from '../types/database';

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  courseId: string | null;
  courseTitle: string | null;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementFormData {
  title: string;
  body: string;
  courseId: string | null;
  isPublished: boolean;
}

// Helper to record audit log when admin manages announcements
const recordAuditLog = async (
  action: string,
  entityId: string,
  metadata?: Record<string, unknown>
) => {
  try {
    const { data } = await supabase.auth.getSession();
    const actorId = data.session?.user?.id;
    if (!actorId) return;

    await supabase.from('audit_logs').insert({
      actor_id: actorId,
      action,
      entity_type: 'announcement',
      entity_id: entityId,
      metadata: (metadata || {}) as any,
    });
  } catch (err) {
    console.warn('Failed to record announcement audit log:', err);
  }
};

export const announcementService = {
  // 1. Get published announcements visible to student (enforced by Supabase RLS)
  getAnnouncementsForStudent: async (): Promise<AnnouncementItem[]> => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          body,
          course_id,
          author_id,
          is_published,
          created_at,
          updated_at,
          courses:course_id (
            id,
            title
          ),
          profiles:author_id (
            id,
            name,
            avatar
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching student announcements:', error.message);
        return [];
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        body: row.body,
        courseId: row.course_id,
        courseTitle: row.courses?.title || null,
        authorId: row.author_id,
        authorName: row.profiles?.name || 'Admin Coursue',
        authorAvatar:
          row.profiles?.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            row.profiles?.name || 'Admin'
          )}`,
        isPublished: row.is_published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      console.error('Announcement service error:', err);
      return [];
    }
  },

  // 2. Get latest announcements for dashboard preview widget (default limit: 3)
  getLatestAnnouncements: async (limit = 3): Promise<AnnouncementItem[]> => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          body,
          course_id,
          author_id,
          is_published,
          created_at,
          updated_at,
          courses:course_id (
            id,
            title
          ),
          profiles:author_id (
            id,
            name,
            avatar
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching latest announcements:', error.message);
        return [];
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        body: row.body,
        courseId: row.course_id,
        courseTitle: row.courses?.title || null,
        authorId: row.author_id,
        authorName: row.profiles?.name || 'Admin Coursue',
        authorAvatar:
          row.profiles?.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            row.profiles?.name || 'Admin'
          )}`,
        isPublished: row.is_published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      console.error('Latest announcements error:', err);
      return [];
    }
  },

  // 3. Admin: Get all announcements (including unpublished drafts)
  getAllAnnouncementsAdmin: async (): Promise<AnnouncementItem[]> => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          id,
          title,
          body,
          course_id,
          author_id,
          is_published,
          created_at,
          updated_at,
          courses:course_id (
            id,
            title
          ),
          profiles:author_id (
            id,
            name,
            avatar
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin announcements:', error.message);
        throw new Error(error.message);
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        body: row.body,
        courseId: row.course_id,
        courseTitle: row.courses?.title || null,
        authorId: row.author_id,
        authorName: row.profiles?.name || 'Admin Coursue',
        authorAvatar:
          row.profiles?.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            row.profiles?.name || 'Admin'
          )}`,
        isPublished: row.is_published,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      console.error('Admin announcements fetch error:', err);
      throw err;
    }
  },

  // 4. Admin: Create announcement
  createAnnouncement: async (
    form: AnnouncementFormData
  ): Promise<{ success: boolean; data?: AnnouncementItem; error?: string }> => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const authorId = sessionData.session?.user?.id;
      if (!authorId) {
        return { success: false, error: 'Sesi admin tidak ditemukan. Silakan login kembali.' };
      }

      const insertPayload: DbAnnouncementInsert = {
        title: form.title.trim(),
        body: form.body.trim(),
        course_id: form.courseId || null,
        author_id: authorId,
        is_published: form.isPublished,
      };

      const { data, error } = await supabase
        .from('announcements')
        .insert(insertPayload)
        .select(`
          id,
          title,
          body,
          course_id,
          author_id,
          is_published,
          created_at,
          updated_at,
          courses:course_id (
            id,
            title
          ),
          profiles:author_id (
            id,
            name,
            avatar
          )
        `)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      await recordAuditLog('announcement.create', data.id, {
        title: form.title,
        courseId: form.courseId,
        isPublished: form.isPublished,
      });

      const item: AnnouncementItem = {
        id: data.id,
        title: data.title,
        body: data.body,
        courseId: data.course_id,
        courseTitle: (data.courses as any)?.title || null,
        authorId: data.author_id,
        authorName: (data.profiles as any)?.name || 'Admin Coursue',
        authorAvatar:
          (data.profiles as any)?.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            (data.profiles as any)?.name || 'Admin'
          )}`,
        isPublished: data.is_published,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      return { success: true, data: item };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal membuat pengumuman' };
    }
  },

  // 5. Admin: Update announcement
  updateAnnouncement: async (
    id: string,
    form: Partial<AnnouncementFormData>
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const updatePayload: DbAnnouncementUpdate = {};
      if (form.title !== undefined) updatePayload.title = form.title.trim();
      if (form.body !== undefined) updatePayload.body = form.body.trim();
      if (form.courseId !== undefined) updatePayload.course_id = form.courseId || null;
      if (form.isPublished !== undefined) updatePayload.is_published = form.isPublished;

      const { error } = await supabase
        .from('announcements')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      await recordAuditLog('announcement.update', id, { ...form });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal memperbarui pengumuman' };
    }
  },

  // 6. Admin: Toggle published status
  togglePublish: async (id: string, nextStatus: boolean): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_published: nextStatus })
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      await recordAuditLog(
        nextStatus ? 'announcement.publish' : 'announcement.unpublish',
        id,
        { is_published: nextStatus }
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal mengubah status publikasi' };
    }
  },

  // 7. Admin: Delete announcement
  deleteAnnouncement: async (id: string, title?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }

      await recordAuditLog('announcement.delete', id, { title });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Gagal menghapus pengumuman' };
    }
  },
};

