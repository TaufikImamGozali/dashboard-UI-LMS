import React, { useState } from 'react';
import { Heart, Share2, Check, ArrowRight, Sparkles, CreditCard } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { Button } from '../ui/Button';

interface CourseProgressPanelProps {
  completedLessons: number;
  totalLessons: number;
  isFavorite: boolean;
  isEnrolled: boolean;
  price?: number;
  isEnrolling?: boolean;
  onToggleFavorite: () => void;
  onContinueLearning: () => void;
  onEnrollFree?: () => void;
  onPaidClick?: () => void;
}

export const CourseProgressPanel: React.FC<CourseProgressPanelProps> = ({
  completedLessons,
  totalLessons,
  isFavorite,
  isEnrolled,
  price = 0,
  isEnrolling = false,
  onToggleFavorite,
  onContinueLearning,
  onEnrollFree,
  onPaidClick,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isPaid = price > 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {isEnrolled ? (
        /* Enrolled User: Progress Ring & Continue */
        <div className="bg-surface rounded-card p-6 border border-outline-subtle shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slateText-primary tracking-tight">
            Progres Belajar Anda
          </h2>

          <div className="flex items-center gap-4">
            <ProgressRing progress={percentage} size={76} strokeWidth={6} />

            <div className="space-y-1">
              <p className="text-sm font-bold text-slateText-primary">
                {completedLessons} dari {totalLessons} materi selesai
              </p>
              <p className="text-xs text-slateText-muted">
                {percentage === 100
                  ? '🎉 Selamat! Kursus telah Anda selesaikan'
                  : 'Lanjutkan untuk menyelesaikan seluruh kurikulum!'}
              </p>
            </div>
          </div>

          <div>
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={onContinueLearning}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="rounded-full shadow-purple-glow"
            >
              Lanjutkan Belajar
            </Button>
          </div>
        </div>
      ) : isPaid ? (
        /* Unenrolled: Paid Class Card */
        <div className="bg-surface rounded-card p-6 border border-purple-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-meta font-extrabold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-purple-200">
              Kelas Berbayar
            </span>
            <span className="text-2xl font-extrabold text-slateText-primary tracking-tight">
              ${price}
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slateText-primary">
              Akses Penuh Seumur Hidup
            </h3>
            <p className="text-xs text-slateText-secondary leading-relaxed">
              Buka seluruh materi video eksklusif, unduhan modul, dan sertifikat kelulusan.
            </p>
          </div>

          <div>
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={onPaidClick}
              leftIcon={<CreditCard className="w-4 h-4" />}
              className="rounded-full shadow-purple-glow bg-purple-600 hover:bg-purple-700"
            >
              Beli Kelas (${price})
            </Button>
          </div>

          <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-100 text-center">
            <p className="text-micro font-medium text-purple-800">
              ℹ️ Integrasi pembayaran sedang dalam pengembangan
            </p>
          </div>
        </div>
      ) : (
        /* Unenrolled: Free Class Card */
        <div className="bg-surface rounded-card p-6 border border-emerald-200/90 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-meta font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
              100% Gratis
            </span>
            <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">
              GRATIS
            </span>
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slateText-primary">
              Mulai Belajar Sekarang
            </h3>
            <p className="text-xs text-slateText-secondary leading-relaxed">
              Daftar 1-klik untuk membuka seluruh materi dan menyimpan riwayat progres belajarmu.
            </p>
          </div>

          <div>
            <Button
              variant="primary"
              fullWidth
              size="md"
              isLoading={isEnrolling}
              onClick={onEnrollFree}
              leftIcon={<Sparkles className="w-4 h-4" />}
              className="rounded-full shadow-purple-glow"
            >
              Daftar Kelas Gratis
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons: Favorite and Share */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-full border text-xs font-bold transition-all active:scale-95 shadow-2xs ${
            isFavorite
              ? 'border-rose-200 bg-rose-50 text-rose-600'
              : 'border-outline hover:border-slate-300 bg-surface hover:bg-slate-50 text-slateText-secondary'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          <span>{isFavorite ? 'Favorit' : 'Simpan'}</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-outline hover:border-slate-300 bg-surface hover:bg-slate-50 text-slateText-secondary text-xs font-bold transition-all active:scale-95 shadow-2xs"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600">Disalin!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Bagikan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
