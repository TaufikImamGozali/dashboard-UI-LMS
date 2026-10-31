import { supabase } from '../lib/supabase';
import type { DbCourseAssignment, DbAssignmentSubmission } from '../types';

export const assignmentService = {
  // Fetch assignment requirements for a given course
  getAssignmentByCourse: async (courseId: string): Promise<DbCourseAssignment | null> => {
    try {
      const { data, error } = await supabase
        .from('course_assignments')
        .select('*')
        .eq('course_id', courseId)
        .maybeSingle();

      if (error || !data) return null;

      let reqs: string[] = [];
      if (Array.isArray(data.requirements)) {
        reqs = data.requirements as string[];
      } else if (typeof data.requirements === 'string') {
        try {
          reqs = JSON.parse(data.requirements);
        } catch {
          reqs = [];
        }
      }

      return {
        ...data,
        requirements: reqs,
      } as DbCourseAssignment;
    } catch {
      return null;
    }
  },

  // Fetch logged-in user's submission for an assignment
  getMySubmission: async (assignmentId: string): Promise<DbAssignmentSubmission | null> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('assignment_submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error || !data) return null;
      return data as DbAssignmentSubmission;
    } catch {
      return null;
    }
  },

  // Submit or update project assignment
  submitAssignment: async (
    courseId: string,
    assignmentId: string,
    projectUrl: string,
    notes: string
  ): Promise<{ success: boolean; data?: DbAssignmentSubmission; error?: string }> => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Silakan login terlebih dahulu untuk mengumpulkan tugas.' };
      }

      const cleanUrl = projectUrl.trim();
      if (!cleanUrl) {
        return { success: false, error: 'URL proyek atau repositori wajib diisi.' };
      }

      // Check if submission already exists
      const { data: existing } = await supabase
        .from('assignment_submissions')
        .select('id, status')
        .eq('assignment_id', assignmentId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        if (existing.status === 'approved') {
          return { success: false, error: 'Tugas ini telah disetujui dan dinyatakan lulus.' };
        }

        const { data: updated, error: updateErr } = await supabase
          .from('assignment_submissions')
          .update({
            project_url: cleanUrl,
            notes: notes.trim() || null,
            status: 'submitted',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updateErr) {
          return { success: false, error: updateErr.message };
        }
        return { success: true, data: updated as DbAssignmentSubmission };
      }

      // Insert new submission
      const { data: created, error: insertErr } = await supabase
        .from('assignment_submissions')
        .insert({
          course_id: courseId,
          assignment_id: assignmentId,
          user_id: user.id,
          project_url: cleanUrl,
          notes: notes.trim() || null,
          status: 'submitted',
        })
        .select()
        .single();

      if (insertErr) {
        return { success: false, error: insertErr.message };
      }

      return { success: true, data: created as DbAssignmentSubmission };
    } catch {
      return { success: false, error: 'Gagal menyimpan pengumpulan tugas.' };
    }
  },
};

