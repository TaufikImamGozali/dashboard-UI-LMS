import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ProfileContext } from '../contexts/ProfileContext';
import { profileService, emptyProfile } from '../services/profileService';
import { supabase } from '../lib/supabase';
import type { NotificationPreferences, UserProfile } from '../types/settings';

export const ProfileProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(profileService.getLocalProfile);
  const [preferences, setPreferences] = useState<NotificationPreferences>(
    profileService.getNotificationPreferences
  );

  const syncUserFromSupabase = useCallback(async (userId?: string, userEmail?: string, userMeta?: any) => {
    try {
      let uid = userId;
      let email = userEmail;
      let meta = userMeta;

      if (!uid) {
        const { data } = await supabase.auth.getSession();
        if (!data.session?.user) {
          setProfile(emptyProfile);
          profileService.clearProfile();
          return;
        }
        uid = data.session.user.id;
        email = data.session.user.email;
        meta = data.session.user.user_metadata;
      }

      // Fetch from Supabase profiles table
      const dbProfile = await profileService.fetchProfile(uid);

      // Compute actual completion percentage from user course progress
      let completionPercentage = 0;
      try {
        const { data: progressData } = await supabase
          .from('user_course_progress')
          .select('progress_percentage')
          .eq('user_id', uid);

        if (progressData && progressData.length > 0) {
          const sum = progressData.reduce((acc, row) => acc + (Number(row.progress_percentage) || 0), 0);
          completionPercentage = Math.round(sum / progressData.length);
        }
      } catch {
        completionPercentage = 0;
      }

      if (dbProfile) {
        const resolvedName =
          dbProfile.name && dbProfile.name !== 'user' && dbProfile.name !== 'Student User'
            ? dbProfile.name
            : meta?.full_name || meta?.name || dbProfile.name || email?.split('@')[0] || 'Student User';

        const resolved: UserProfile = {
          ...dbProfile,
          name: resolvedName,
          email: dbProfile.email || email || '',
          completionPercentage,
        };
        setProfile(resolved);
        profileService.syncLocalProfile(resolved);
      } else {
        // Fallback using auth user metadata if database row is still synchronizing
        const resolvedName =
          meta?.full_name || meta?.name || email?.split('@')[0] || 'Student User';
        const fallback: UserProfile = {
          name: resolvedName,
          email: email || '',
          avatar:
            meta?.avatar_url ||
            meta?.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(resolvedName)}`,
          phone: '',
          bio: '',
          completionPercentage,
        };
        setProfile(fallback);
        profileService.syncLocalProfile(fallback);
      }
    } catch (err) {
      console.warn('ProfileProvider sync error:', err);
    }
  }, []);

  useEffect(() => {
    // Initial fetch on mount
    void (async () => {
      await syncUserFromSupabase();
    })();

    // Listen to Supabase auth events (sign in, sign up, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await syncUserFromSupabase(
          session.user.id,
          session.user.email,
          session.user.user_metadata
        );
      } else if (event === 'SIGNED_OUT') {
        setProfile(emptyProfile);
        profileService.clearProfile();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [syncUserFromSupabase]);

  const updateProfile = useCallback(
    async (next: UserProfile) => {
      setProfile(next);
      profileService.syncLocalProfile(next);

      try {
        const { data } = await supabase.auth.getSession();
        const userId = data.session?.user?.id;
        if (userId) {
          await profileService.saveProfile(userId, next);
        }
      } catch (err) {
        console.error('Failed to save profile updates to Supabase:', err);
      }
    },
    []
  );

  const updatePreferences = useCallback((next: NotificationPreferences) => {
    profileService.saveNotificationPreferences(next);
    setPreferences(next);
  }, []);

  const resetProfile = useCallback(() => {
    setProfile(profileService.getLocalProfile());
    setPreferences(profileService.getNotificationPreferences());
  }, []);

  const value = useMemo(
    () => ({
      profile,
      preferences,
      updateProfile,
      updatePreferences,
      resetProfile,
    }),
    [preferences, profile, resetProfile, updatePreferences, updateProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
