import type { UserRole } from '../types/admin';

const AUTH_KEY = 'coursue_auth';
const REMEMBER_KEY = 'coursue_remember';
const ROLE_KEY = 'coursue_role';

export const authService = {
  isAuthenticated: () => localStorage.getItem(AUTH_KEY) === 'true',
  getRole: (): UserRole => (localStorage.getItem(ROLE_KEY) as UserRole) || 'student',
  login: (remember = false, role: UserRole = 'student') => {
    localStorage.setItem(AUTH_KEY, 'true');
    localStorage.setItem(ROLE_KEY, role);
    if (remember) localStorage.setItem(REMEMBER_KEY, 'true');
  },
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
  setRole: (role: UserRole) => {
    localStorage.setItem(ROLE_KEY, role);
  },
};
