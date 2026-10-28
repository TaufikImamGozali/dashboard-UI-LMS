import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, switchRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-surface rounded-3xl p-8 border border-outline shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-5 ring-8 ring-rose-50/50">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-content-primary mb-2">
            Admin Access Required
          </h2>
          <p className="text-sm text-content-secondary mb-6 leading-relaxed">
            Your current account does not have administrator privileges to view this section.
          </p>
          <div className="space-y-3">
            {import.meta.env.DEV && (
              <button
                type="button"
                onClick={() => {
                  switchRole('admin');
                  navigate('/admin');
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-purple-glow transition-all"
              >
                <KeyRound className="w-4 h-4" />
                Switch to Demo Admin Role (Dev Only)
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-full border border-outline hover:bg-surface-muted text-content-primary font-semibold text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Student Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
