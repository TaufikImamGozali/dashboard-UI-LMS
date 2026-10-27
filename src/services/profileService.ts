import type { NotificationPreferences, UserProfile } from '../types/settings';
import { currentUser } from '../data/mockData';

const PROFILE_KEY = 'coursue_profile_v1';
const PREFERENCES_KEY = 'coursue_notification_preferences_v1';

export const defaultProfile: UserProfile = {
  name: currentUser.name,
  email: 'jason.ranti@coursue.test',
  phone: '+62 812 3456 7890',
  bio: 'Curious learner focused on design and front-end development.',
  avatar: currentUser.avatar,
  completionPercentage: currentUser.completionPercentage,
};

export const defaultNotificationPreferences: NotificationPreferences = {
  task: true,
  message: true,
  group: true,
  course: true,
};

const read = <T,>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? { ...fallback, ...(JSON.parse(stored) as T) } : fallback;
  } catch {
    return fallback;
  }
};

export const profileService = {
  getProfile: () => read(PROFILE_KEY, defaultProfile),
  saveProfile: (profile: UserProfile) => localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)),
  getNotificationPreferences: () => read(PREFERENCES_KEY, defaultNotificationPreferences),
  saveNotificationPreferences: (preferences: NotificationPreferences) => localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences)),
  clearAccountData: () => {
    localStorage.clear();
  },
};
