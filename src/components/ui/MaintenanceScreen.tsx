import React from 'react';
import { Wrench, Mail, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface MaintenanceScreenProps {
  supportEmail?: string;
  onRefresh?: () => void;
}

export const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({
  supportEmail = 'support@coursue.test',
  onRefresh,
}) => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-lg bg-surface rounded-3xl p-7 sm:p-10 border border-outline shadow-2xl text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
          <Wrench className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-meta font-extrabold bg-amber-100 text-amber-800 uppercase tracking-wider">
            System Maintenance
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-content-primary tracking-tight">
            Sedang Dalam Pemeliharaan
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-md mx-auto">
            Kami sedang melakukan peningkatan sistem dan infrastruktur agar Coursue berjalan lebih cepat dan andal. Mohon kunjungi kembali dalam beberapa saat.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-surface-muted border border-outline-subtle text-xs text-content-secondary space-y-2">
          <p className="font-semibold text-content-primary">Butuh bantuan mendesak?</p>
          <a
            href={`mailto:${supportEmail}`}
            className="inline-flex items-center gap-1.5 text-brand-600 hover:text-brand-700 font-bold hover:underline"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{supportEmail}</span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              if (onRefresh) onRefresh();
              else window.location.reload();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-purple-glow transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Muat Ulang Halaman</span>
          </button>
          <button
            type="button"
            onClick={() => logout()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-outline hover:bg-surface-muted text-content-secondary font-semibold text-xs transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
};

