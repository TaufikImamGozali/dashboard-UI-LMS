import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import type { UserRole } from '../types/admin';

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(authService.isAuthenticated);
  const [role, setRoleState] = useState<UserRole>(authService.getRole);

  useEffect(() => {
    // Listen for Supabase auth state changes (OAuth redirects, token refresh, sign-in, sign-out)
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      // Don't treat a password recovery session as a normal authenticated dashboard session
      if (event === 'PASSWORD_RECOVERY') {
        return;
      }

      if (session?.user) {
        const profileStatus = await authService.fetchUserProfileStatus(
          session.user.id,
          session.user.email
        );

        if (!profileStatus.isActive) {
          await authService.logout();
          setAuthenticated(false);
          setRoleState('student');
          return;
        }

        authService.syncSession(true, profileStatus.role);
        setAuthenticated(true);
        setRoleState(profileStatus.role);
      } else if (event === 'SIGNED_OUT') {
        authService.clearSession();
        setAuthenticated(false);
        setRoleState('student');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
    if (res.success && !res.emailConfirmationRequired) {
      setAuthenticated(true);
      setRoleState('student');
    }
    return res;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const res = await authService.signInWithGoogle();
    return res;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthenticated(false);
    setRoleState('student');
  }, []);

  const isAdmin = role === 'admin';

  const value = useMemo(
    () => ({
      isAuthenticated,
      role,
      isAdmin,
      login,
      signIn,
      signUp,
      signInWithGoogle,
      logout,
    }),
    [isAuthenticated, role, isAdmin, login, signIn, signUp, signInWithGoogle, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
