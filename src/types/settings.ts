export type AccentColor = 'purple' | 'blue' | 'emerald' | 'rose';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  completionPercentage: number;
}

export interface NotificationPreferences {
  task: boolean;
  message: boolean;
  group: boolean;
  course: boolean;
}
