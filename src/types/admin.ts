export type UserRole = 'student' | 'mentor' | 'admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'suspended';
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
  category: 'frontend' | 'design' | 'branding';
  categoryLabel: string;
  instructor: string;
  instructorAvatar: string;
  studentsCount: number;
  rating: number;
  status: 'published' | 'draft' | 'archived';
  price: number;
  createdAt: string;
  thumbnail: string;
}
