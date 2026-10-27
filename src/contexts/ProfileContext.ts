import { createContext } from 'react';
import type { NotificationPreferences, UserProfile } from '../types/settings';

export interface ProfileContextValue { profile: UserProfile; preferences: NotificationPreferences; updateProfile: (profile: UserProfile) => void; updatePreferences: (preferences: NotificationPreferences) => void; resetProfile: () => void }
export const ProfileContext = createContext<ProfileContextValue | null>(null);
