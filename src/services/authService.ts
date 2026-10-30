import { supabase } from '../lib/supabase';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { UserRole } from '../types/admin';
import { profileService } from './profileService';

const AUTH_KEY = 'coursue_auth';
const REMEMBER_KEY = 'coursue_remember';
const REMEMBERED_EMAIL_KEY = 'coursue_remembered_email';
const ROLE_KEY = 'coursue_role';

export const authService = {
  isAuthenticated: () => localStorage.getItem(AUTH_KEY) === 'true',
  getRole: (): UserRole => (localStorage.getItem(ROLE_KEY) as UserRole) || 'student',

  getRememberedEmail: (): string => {
    return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
  },

  // Real Supabase Sign In with credentials verification
  signIn: async (email: string, password: string, remember = false) => {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const profileStatus = await authService.fetchUserProfileStatus(data.user.id, cleanEmail);

    if (!profileStatus.isActive) {
      // Inactive/suspended user is immediately blocked and logged out
      await supabase.auth.signOut();
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(ROLE_KEY);
      profileService.clearProfile();
      return {
        success: false,
        error: 'Akun Anda telah dinonaktifkan oleh administrator. Silakan hubungi dukungan platform.',
      };
    }

    const role = profileStatus.role;

    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(ROLE_KEY, role);
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, 'true');
      localStorage.setItem(REMEMBERED_EMAIL_KEY, cleanEmail);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    // Cache user profile for immediate UI readiness
    const dbProfile = await profileService.fetchProfile(data.user.id);
    if (!dbProfile) {
      const displayName =
        data.user.user_metadata?.name ||
        data.user.user_metadata?.full_name ||
        cleanEmail.split('@')[0];
      profileService.syncLocalProfile({
        name: displayName,
        email: cleanEmail,
        avatar:
          data.user.user_metadata?.avatar_url ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`,
        phone: '',
        bio: '',
        completionPercentage: 0,
      });
    }

    return { success: true, role, user: data.user };
  },

  // Real Supabase Sign Up
  signUp: async (name: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // 1. Sign out any existing session first to prevent session contamination
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore sign-out errors on fresh sessions
    }
    profileService.clearProfile();
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ROLE_KEY);

    // 2. Perform sign up with user metadata
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: cleanName,
          full_name: cleanName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const registeredAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`;

    // Immediately cache newly registered user's profile
    profileService.syncLocalProfile({
      name: cleanName,
      email: cleanEmail,
      avatar: registeredAvatar,
      phone: '',
      bio: '',
      completionPercentage: 0,
    });

    // 3. Check if session was granted automatically (e.g. if email confirmation is disabled)
    let activeSession = data.session;

    if (!activeSession) {
      // Try to sign in with password to see if email confirmation is required or if we can establish a session
      const signInRes = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (signInRes.data?.session) {
        activeSession = signInRes.data.session;
      }
    }

    // If an active session is established:
    if (activeSession) {
      if (activeSession.user?.id) {
        // Ensure profile row in public.profiles has the registered name immediately
        try {
          await supabase.from('profiles').upsert({
            id: activeSession.user.id,
            name: cleanName,
            email: cleanEmail,
            role: 'student',
            avatar: registeredAvatar,
          });
        } catch (profileErr) {
          console.warn('Profile upsert notice:', profileErr);
        }
      }

      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(ROLE_KEY, 'student');
      return {
        success: true,
        user: activeSession.user,
        emailConfirmationRequired: false,
      };
    }

    // If confirmation is required, do not set auth key so protected routes don't treat as logged in
    return {
      success: true,
      user: data.user,
      emailConfirmationRequired: true,
      email: cleanEmail,
    };
  },

  // Resend Sign-Up Confirmation Email
  resendConfirmationEmail: async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: cleanEmail,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  },

  // Real Supabase OAuth Sign In (Google)
  signInWithGoogle: async () => {
    const redirectTo = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  // Supabase Password Reset Email
  resetPasswordForEmail: async (email: string) => {
    const redirectTo = `${window.location.origin}/reset-password`;
    const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  },

  // Supabase Update User Password (used on recovery)
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, user: data.user };
  },

  // Fetch verified user profile role and active status from database
  fetchUserProfileStatus: async (
    userId: string,
    email?: string
  ): Promise<{ role: UserRole; isActive: boolean }> => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, is_active')
        .eq('id', userId)
        .maybeSingle();

      const isActive = profile?.is_active !== false;

      if (profile?.role) {
        return { role: profile.role as UserRole, isActive };
      }
      if (email && email.toLowerCase().includes('admin@')) {
        return { role: 'admin', isActive };
      }
      return { role: 'student', isActive };
    } catch (err) {
      console.warn('Error fetching profile status:', err);
      return {
        role: email && email.toLowerCase().includes('admin@') ? 'admin' : 'student',
        isActive: true,
      };
    }
  },

  // Fetch verified user profile role from database
  fetchProfileRole: async (userId: string, email?: string): Promise<UserRole> => {
    const res = await authService.fetchUserProfileStatus(userId, email);
    return res.role;
  },

  syncSession: (authenticated: boolean, role: UserRole = 'student') => {
    if (authenticated) {
      localStorage.setItem(AUTH_KEY, 'true');
      localStorage.setItem(ROLE_KEY, role);
    } else {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(ROLE_KEY);
    }
  },

  clearSession: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ROLE_KEY);
    profileService.clearProfile();
  },

  onAuthStateChange: (
    callback: (event: AuthChangeEvent, session: Session | null) => void | Promise<void>
  ) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  getSession: async () => {
    return await supabase.auth.getSession();
  },

  // Legacy synchronous helper for backward compatibility
  login: (remember = false, role: UserRole = 'student') => {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(ROLE_KEY, role);
    if (remember) localStorage.setItem(REMEMBER_KEY, 'true');
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Sign out error:', err);
    }
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(ROLE_KEY);
    profileService.clearProfile();
  },

  setRole: (role: UserRole) => {
    localStorage.setItem(ROLE_KEY, role);
  },
};
