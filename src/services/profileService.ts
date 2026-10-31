import { supabase } from '../lib/supabase';
import type { NotificationPreferences, UserProfile } from '../types/settings';

const PROFILE_KEY = 'coursue_profile_v2';
const LEGACY_PROFILE_KEY = 'coursue_profile_v1';
const PREFERENCES_KEY = 'coursue_notification_preferences_v1';

export const emptyProfile: UserProfile = {
  name: 'Student User',
  email: '',
  phone: '',
  bio: '',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  completionPercentage: 0,
};

export const defaultNotificationPreferences: NotificationPreferences = {
  task: true,
  message: true,
  group: true,
  course: true,
};

const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const profileService = {
  // Read locally cached profile or fallback
  getLocalProfile: (): UserProfile => {
    // Clean legacy mock profile cache if present
    if (localStorage.getItem(LEGACY_PROFILE_KEY)) {
      localStorage.removeItem(LEGACY_PROFILE_KEY);
    }
    return readStorage<UserProfile>(PROFILE_KEY, emptyProfile);
  },

  // Save profile to local storage cache
  syncLocalProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.warn('Failed to cache profile locally:', err);
    }
  },

  // Clear local profile cache (called on logout)
  clearProfile: (): void => {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(LEGACY_PROFILE_KEY);
  },

  // Fetch real profile row from Supabase
  fetchProfile: async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, avatar, phone, bio')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching Supabase profile:', error.message);
        return null;
      }

      if (!data) return null;

      const profile: UserProfile = {
        name: data.name || '',
        email: data.email || '',
        avatar:
          data.avatar ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'User')}`,
        phone: data.phone || '',
        bio: data.bio || '',
        completionPercentage: 0,
      };

      profileService.syncLocalProfile(profile);
      return profile;
    } catch (err) {
      console.warn('Network error fetching profile:', err);
      return null;
    }
  },

  // Save changes to Supabase public.profiles and update local cache
  saveProfile: async (userId: string, next: UserProfile): Promise<void> => {
    profileService.syncLocalProfile(next);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: next.name.trim(),
          avatar: next.avatar,
          phone: next.phone?.trim() || '',
          bio: next.bio?.trim() || '',
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile in Supabase:', error);
        throw new Error(error.message);
      }
    } catch (err) {
      console.error('saveProfile error:', err);
      throw err;
    }
  },

  // Upload user avatar image to Supabase Storage bucket 'avatars'
  uploadAvatar: async (
    userId: string,
    file: File
  ): Promise<{ success: boolean; url?: string; error?: string }> => {
    try {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        return {
          success: false,
          error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.',
        };
      }

      // Validate size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        return { success: false, error: 'Ukuran file foto maksimal 2 MB.' };
      }

      const fileExt = file.name.split('.').pop() || 'png';
      const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
      const filePath = `${userId}/${Date.now()}.${cleanExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError.message);
        return { success: false, error: uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uploadData.path);

      return { success: true, url: publicUrlData.publicUrl };
    } catch (err: any) {
      console.error('uploadAvatar error:', err);
      return {
        success: false,
        error: err.message || 'Gagal mengunggah foto profil ke Supabase Storage',
      };
    }
  },

  // Notification Preferences
  getNotificationPreferences: (): NotificationPreferences =>
    readStorage(PREFERENCES_KEY, defaultNotificationPreferences),

  saveNotificationPreferences: (preferences: NotificationPreferences): void => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  },

  clearAccountData: (): void => {
    localStorage.clear();
  },
};
