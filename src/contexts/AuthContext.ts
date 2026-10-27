import { createContext } from 'react';
import type { UserRole } from '../types/admin';

export interface AuthContextValue {
  isAuthenticated: boolean;
  role: UserRole;
  isAdmin: boolean;
  login: (remember?: boolean, role?: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
