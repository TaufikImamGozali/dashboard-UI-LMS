import React, { useCallback, useMemo, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(authService.isAuthenticated);
  const login = useCallback((remember = false) => { authService.login(remember); setAuthenticated(true); }, []);
  const logout = useCallback(() => { authService.logout(); setAuthenticated(false); }, []);
  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
