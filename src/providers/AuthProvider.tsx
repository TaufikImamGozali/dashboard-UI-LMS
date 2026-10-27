import React, { useCallback, useMemo, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import type { UserRole } from '../types/admin';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(authService.isAuthenticated);
  const [role, setRoleState] = useState<UserRole>(authService.getRole);

  const login = useCallback((remember = false, userRole: UserRole = 'student') => {
    authService.login(remember, userRole);
    setAuthenticated(true);
    setRoleState(userRole);
  }, []);

  const signIn = useCallback(async (email: string, password: string, remember = false) => {
    const res = await authService.signIn(email, password, remember);
    if (res.success && res.role) {
      setAuthenticated(true);
      setRoleState(res.role);
    }
    return res;
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const res = await authService.signUp(name, email, password);
    if (res.success) {
      setAuthenticated(true);
      setRoleState('student');
    }
    return res;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthenticated(false);
    setRoleState('student');
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    authService.setRole(newRole);
    setRoleState(newRole);
  }, []);

  const isAdmin = role === 'admin';

  const value = useMemo(
    () => ({ isAuthenticated, role, isAdmin, login, signIn, signUp, logout, switchRole }),
    [isAuthenticated, role, isAdmin, login, signIn, signUp, logout, switchRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
