export type UserRole = 'student' | 'mentor' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'suspended';
  isActive?: boolean;
  joinedDate: string;
  coursesEnrolled?: number;
  coursesCreated?: number;
}

export interface AdminAuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  allowRegistration: boolean;
  maintenanceMode: boolean;
  maxUploadSizeMb: number;
  updatedBy: string;
  updatedAt: string;
}

export interface AdminCourse {
  id: string;
  title: string;
  slug?: string;
  description?: string | null;
  category: 'frontend' | 'design' | 'branding' | 'mobile' | 'devops' | 'general';
  categoryLabel: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  instructorAvatar: string;
  studentsCount: number;
  rating: number;
  status: 'published' | 'draft' | 'archived';
  price: number;
  createdAt: string;
  thumbnail: string;
  lessonsCount?: number;
}

export interface AdminLesson {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  youtubeUrl: string | null;
  youtubeVideoId: string | null;
  durationSeconds: number;
  position: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}
