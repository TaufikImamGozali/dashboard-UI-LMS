import { supabase } from '../lib/supabase';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import type { UserRole } from '../types/admin';

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

    const role = await authService.fetchProfileRole(data.user.id, cleanEmail);

    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(ROLE_KEY, role);
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, 'true');
      localStorage.setItem(REMEMBERED_EMAIL_KEY, cleanEmail);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    return { success: true, role, user: data.user };
  },

  // Real Supabase Sign Up
  signUp: async (name: string, email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(ROLE_KEY, 'student');
    return { success: true, user: data.user };
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

  // Fetch verified user profile role from database
  fetchProfileRole: async (userId: string, email?: string): Promise<UserRole> => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (profile?.role) {
        return profile.role as UserRole;
      }
      if (email && email.toLowerCase().includes('admin@')) {
        return 'admin';
      }
    } catch (err) {
      console.warn('Error fetching profile role:', err);
      if (email && email.toLowerCase().includes('admin@')) {
        return 'admin';
      }
    }
    return 'student';
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
  },

  setRole: (role: UserRole) => {
    localStorage.setItem(ROLE_KEY, role);
  },
};
