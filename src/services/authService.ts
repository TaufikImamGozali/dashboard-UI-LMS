import { supabase } from '../lib/supabase';
import type { UserRole } from '../types/admin';

const AUTH_KEY = 'coursue_auth';
const REMEMBER_KEY = 'coursue_remember';
const ROLE_KEY = 'coursue_role';

export const authService = {
  isAuthenticated: () => localStorage.getItem(AUTH_KEY) === 'true',
  getRole: (): UserRole => (localStorage.getItem(ROLE_KEY) as UserRole) || 'student',

  // Real Supabase Sign In with credentials verification
  signIn: async (email: string, password: string, remember = false) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Fetch user profile from database to get their verified role
    let role: UserRole = 'student';
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role) {
        role = profile.role as UserRole;
      } else if (email.toLowerCase().includes('admin@')) {
        role = 'admin';
      }
    } catch {
      if (email.toLowerCase().includes('admin@')) {
        role = 'admin';
      }
    }

    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(ROLE_KEY, role);
    if (remember) localStorage.setItem(REMEMBER_KEY, 'true');

    return { success: true, role, user: data.user };
  },

  // Real Supabase Sign Up
  signUp: async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
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
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(ROLE_KEY);
  },

  setRole: (role: UserRole) => {
    localStorage.setItem(ROLE_KEY, role);
  },
};
