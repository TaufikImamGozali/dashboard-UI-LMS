import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { MaintenanceScreen } from '../ui/MaintenanceScreen';
import { AccountSuspendedScreen } from '../ui/AccountSuspendedScreen';
import { FullPageLoader } from '../ui/FullPageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, isAdmin, logout } = useAuth();

  const [checking, setChecking] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [supportEmail, setSupportEmail] = useState('support@coursue.test');

  useEffect(() => {
    let isCancelled = false;

    const checkAccess = async () => {
      if (!isAuthenticated) {
        setChecking(false);
        return;
      }

      try {
        // 1. Fetch platform settings for maintenance check
        const { data: settings } = await supabase
          .from('platform_settings')
          .select('maintenance_mode, support_email')
          .eq('id', true)
          .maybeSingle();

        if (settings) {
          if (!isCancelled) {
            setMaintenanceMode(!!settings.maintenance_mode);
            if (settings.support_email) setSupportEmail(settings.support_email);
          }
        }

        // 2. Fetch current user active status from profiles
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;

        if (userId) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_active, role')
            .eq('id', userId)
            .maybeSingle();

          if (profile && profile.is_active === false) {
            if (!isCancelled) {
              setIsSuspended(true);
            }
            // Sign out the suspended user from supabase session
            await supabase.auth.signOut();
            logout();
          }
        }
      } catch (err) {
        console.warn('Access verification check error:', err);
      } finally {
        if (!isCancelled) {
          setChecking(false);
        }
      }
    };

    checkAccess();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, logout]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (checking) {
    return <FullPageLoader message="Memverifikasi sesi akun..." />;
  }

  // Account suspended guard
  if (isSuspended) {
    return <AccountSuspendedScreen supportEmail={supportEmail} />;
  }

  // Maintenance mode guard: Admins can bypass, non-admins (students) are shown the maintenance screen
  if (maintenanceMode && !isAdmin) {
    return (
      <MaintenanceScreen
        supportEmail={supportEmail}
        onRefresh={() => window.location.reload()}
      />
    );
  }

  return <>{children}</>;
};
