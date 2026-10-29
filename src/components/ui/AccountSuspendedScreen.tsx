import React from 'react';
import { UserX, Mail, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const AccountSuspendedScreen: React.FC<{ supportEmail?: string }> = ({
  supportEmail = 'support@coursue.test',
}) => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-surface rounded-3xl p-7 sm:p-10 border border-outline shadow-2xl text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
          <UserX className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-meta font-extrabold bg-rose-100 text-rose-800 uppercase tracking-wider">
            Account Suspended
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
            Akun Anda Dinonaktifkan
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-md mx-auto">
            Akses ke akun Anda telah dinonaktifkan sementara oleh administrator platform. Silakan hubungi tim dukungan kami untuk informasi pengaktifan kembali.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-muted border border-outline-subtle text-xs text-content-secondary space-y-2">
          <p className="font-semibold text-content-primary">Hubungi Tim Dukungan</p>
          <a
            href={`mailto:${supportEmail}`}
            className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-bold hover:underline"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{supportEmail}</span>
          </a>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-surface border border-outline hover:bg-surface-muted text-content-secondary font-bold text-xs transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
};

