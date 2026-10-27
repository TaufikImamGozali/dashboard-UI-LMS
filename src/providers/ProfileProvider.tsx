import React, { useCallback, useMemo, useState } from 'react';
import { ProfileContext } from '../contexts/ProfileContext';
import { profileService } from '../services/profileService';
import type { NotificationPreferences, UserProfile } from '../types/settings';

export const ProfileProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [profile, setProfile] = useState(profileService.getProfile);
  const [preferences, setPreferences] = useState(profileService.getNotificationPreferences);
  const updateProfile = useCallback((next: UserProfile) => { profileService.saveProfile(next); setProfile(next); }, []);
  const updatePreferences = useCallback((next: NotificationPreferences) => { profileService.saveNotificationPreferences(next); setPreferences(next); }, []);
  const resetProfile = useCallback(() => { setProfile(profileService.getProfile()); setPreferences(profileService.getNotificationPreferences()); }, []);
  const value = useMemo(() => ({ profile, preferences, updateProfile, updatePreferences, resetProfile }), [preferences, profile, resetProfile, updatePreferences, updateProfile]);
  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};
