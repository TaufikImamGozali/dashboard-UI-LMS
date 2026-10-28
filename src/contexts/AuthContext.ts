import { createContext } from 'react';
import type { UserRole } from '../types/admin';

export interface AuthContextValue {
  isAuthenticated: boolean;
  role: UserRole;
  isAdmin: boolean;
  login: (remember?: boolean, role?: UserRole) => void;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
