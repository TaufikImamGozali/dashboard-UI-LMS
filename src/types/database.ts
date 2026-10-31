export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CourseCategory =
  | 'frontend'
  | 'design'
  | 'branding'
  | 'mobile'
  | 'devops'
  | 'general';

export type DbCourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type CoursePublishStatus = 'draft' | 'published';
export type EnrollmentStatus = 'active' | 'revoked';
export type EnrollmentSource = 'free' | 'purchase' | 'admin';

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string | null;
          thumbnail_url: string | null;
          category: CourseCategory;
          level: DbCourseLevel;
          price: number;
          status: CoursePublishStatus;
          mentor_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description?: string | null;
          thumbnail_url?: string | null;
          category: CourseCategory;
          level?: DbCourseLevel;
          price?: number;
          status?: CoursePublishStatus;
          mentor_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          thumbnail_url?: string | null;
          category?: CourseCategory;
          level?: DbCourseLevel;
          price?: number;
          status?: CoursePublishStatus;
          mentor_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          youtube_url: string | null;
          youtube_video_id: string | null;
          duration_seconds: number;
          position: number;
          is_preview: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          description?: string | null;
          youtube_url?: string | null;
          youtube_video_id?: string | null;
          duration_seconds?: number;
          position: number;
          is_preview?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          description?: string | null;
          youtube_url?: string | null;
          youtube_video_id?: string | null;
          duration_seconds?: number;
          position?: number;
          is_preview?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          status: EnrollmentStatus;
          source: EnrollmentSource;
          enrolled_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          status?: EnrollmentStatus;
          source?: EnrollmentSource;
          enrolled_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          status?: EnrollmentStatus;
          source?: EnrollmentSource;
          enrolled_at?: string;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed: boolean;
          last_position_seconds: number;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed?: boolean;
          last_position_seconds?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completed?: boolean;
          last_position_seconds?: number;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          avatar: string;
          role: 'student' | 'mentor' | 'admin';
          is_active: boolean;
          phone: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email: string;
          avatar?: string;
          role?: 'student' | 'mentor' | 'admin';
          is_active?: boolean;
          phone?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          avatar?: string;
          role?: 'student' | 'mentor' | 'admin';
          is_active?: boolean;
          phone?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      platform_settings: {
        Row: {
          id: boolean;
          platform_name: string;
          support_email: string;
          allow_registration: boolean;
          maintenance_mode: boolean;
          max_upload_size_mb: number;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: {
          id?: boolean;
          platform_name?: string;
          support_email?: string;
          allow_registration?: boolean;
          maintenance_mode?: boolean;
          max_upload_size_mb?: number;
          updated_by?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: boolean;
          platform_name?: string;
          support_email?: string;
          allow_registration?: boolean;
          maintenance_mode?: boolean;
          max_upload_size_mb?: number;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          body: string;
          course_id: string | null;
          author_id: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          course_id?: string | null;
          author_id: string;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          course_id?: string | null;
          author_id?: string;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      course_outline: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          description: string | null;
          position: number;
          duration_seconds: number;
          is_preview: boolean;
        };
      };
      user_course_progress: {
        Row: {
          user_id: string;
          course_id: string;
          course_title: string;
          course_slug: string;
          course_thumbnail: string | null;
          course_category: CourseCategory;
          course_level: DbCourseLevel;
          course_price: number;
          enrollment_status: EnrollmentStatus;
          enrolled_at: string;
          total_lessons: number;
          completed_lessons: number;
          progress_percentage: number;
          calculated_status: 'not-started' | 'in-progress' | 'completed';
          last_activity_at: string | null;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      get_user_course_progress: {
        Args: {
          p_user_id: string;
          p_course_id: string;
        };
        Returns: {
          total_lessons: number;
          completed_lessons: number;
          progress_percentage: number;
          status: string;
        }[];
      };
      reorder_lessons: {
        Args: {
          p_course_id: string;
          p_lesson_ids: string[];
        };
        Returns: void;
      };
    };
  };
}

// Convenience Type Aliases for Application & Service Consumption
export type DbCourse = Database['public']['Tables']['courses']['Row'];
export type DbCourseInsert = Database['public']['Tables']['courses']['Insert'];
export type DbCourseUpdate = Database['public']['Tables']['courses']['Update'];

export type DbLesson = Database['public']['Tables']['lessons']['Row'];
export type DbLessonInsert = Database['public']['Tables']['lessons']['Insert'];
export type DbLessonUpdate = Database['public']['Tables']['lessons']['Update'];

export type DbEnrollment = Database['public']['Tables']['enrollments']['Row'];
export type DbEnrollmentInsert = Database['public']['Tables']['enrollments']['Insert'];

export type DbLessonProgress = Database['public']['Tables']['lesson_progress']['Row'];
export type DbLessonProgressInsert = Database['public']['Tables']['lesson_progress']['Insert'];
export type DbLessonProgressUpdate = Database['public']['Tables']['lesson_progress']['Update'];

export type CourseOutlineItem = Database['public']['Views']['course_outline']['Row'];
export type UserCourseProgress = Database['public']['Views']['user_course_progress']['Row'];

export type DbAuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type DbAuditLogInsert = Database['public']['Tables']['audit_logs']['Insert'];

export type DbPlatformSettings = Database['public']['Tables']['platform_settings']['Row'];
export type DbPlatformSettingsUpdate = Database['public']['Tables']['platform_settings']['Update'];

export type DbAnnouncement = Database['public']['Tables']['announcements']['Row'];
export type DbAnnouncementInsert = Database['public']['Tables']['announcements']['Insert'];
export type DbAnnouncementUpdate = Database['public']['Tables']['announcements']['Update'];

export type SubmissionStatus = 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface DbCourseAssignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  requirements: string[];
  due_days: number;
  created_at: string;
  updated_at: string;
}

export interface DbAssignmentSubmission {
  id: string;
  assignment_id: string;
  course_id: string;
  user_id: string;
  project_url: string;
  notes: string | null;
  status: SubmissionStatus;
  grade: number | null;
  feedback: string | null;
  submitted_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}
