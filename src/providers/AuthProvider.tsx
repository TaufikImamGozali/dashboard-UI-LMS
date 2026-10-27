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
    () => ({ isAuthenticated, role, isAdmin, login, logout, switchRole }),
    [isAuthenticated, role, isAdmin, login, logout, switchRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
