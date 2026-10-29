import React from 'react';
import {
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CreditCard,
} from 'lucide-react';
import type { CurriculumLesson } from '../../types';
import { Button } from '../ui/Button';

interface VideoPlayerProps {
  lesson: CurriculumLesson | null;
  thumbnail: string;
  isEnrolled: boolean;
  isPaid?: boolean;
  price?: number;
  isEnrolling?: boolean;
  onMarkAsComplete: (lessonId: string) => void;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  onEnrollFree?: () => void;
  onPaidClick?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  lesson,
  thumbnail,
  isEnrolled,
  isPaid = false,
  price = 0,
  isEnrolling = false,
  onMarkAsComplete,
  onPreviousLesson,
  onNextLesson,
  hasPrevious = false,
  hasNext = false,
  onEnrollFree,
  onPaidClick,
}) => {
  // Extract YouTube ID from videoUrl or check if it's already an embed URL
  const getEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    if (url.includes('youtube-nocookie.com/embed/')) return url;
    if (url.includes('youtube.com/embed/')) {
      return url.replace('youtube.com/embed/', 'youtube-nocookie.com/embed/');
    }
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      return `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
    return url;
  };

  const isLocked = !isEnrolled && lesson && !lesson.videoUrl && lesson.isLocked;
  const embedUrl = lesson ? getEmbedUrl(lesson.videoUrl) : null;

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative aspect-video w-full rounded-card overflow-hidden bg-slate-900 shadow-card select-none">
        {isLocked ? (
          /* Locked State Overlay */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-950/90 backdrop-blur-sm">
            <img height="160" width="160"
              src={thumbnail}
              alt="Locked lesson"
              className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              loading="lazy"
            />
            <div className="relative z-10 max-w-md space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-brand-300 flex items-center justify-center mx-auto shadow-inner ring-1 ring-white/20">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Materi Ini Terkunci
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isPaid
                    ? 'Kelas ini merupakan kelas berbayar. Selesaikan pendaftaran untuk membuka semua video materi.'
                    : 'Daftar ke kelas gratis ini untuk membuka seluruh kurikulum dan mencatat progres belajar Anda.'}
                </p>
              </div>

              <div className="pt-2">
                {isPaid ? (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={onPaidClick}
                    leftIcon={<CreditCard className="w-4 h-4" />}
                    className="rounded-full shadow-purple-glow"
                  >
                    Beli Kelas (${price})
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    isLoading={isEnrolling}
                    onClick={onEnrollFree}
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    className="rounded-full shadow-purple-glow"
                  >
                    Ikuti Kelas Gratis Ini
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : embedUrl ? (
          /* YouTube NoCookie iFrame Embed */
          <iframe
            src={embedUrl}
            title={lesson?.title || 'Course lesson'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          /* Fallback Thumbnail / Placeholder */
          <div className="relative w-full h-full flex items-center justify-center">
            <img height="160" width="160"
              src={thumbnail}
              alt={lesson?.title || 'Lesson thumbnail'}
              className="w-full h-full object-cover opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <p className="text-sm font-semibold text-white bg-black/60 px-4 py-2 rounded-full backdrop-blur-md">
                Pilih materi dari daftar kurikulum
              </p>
            </div>
          </div>
        )}

        {/* Floating Top Badge */}
        {lesson && !isLocked && (
          <div className="absolute top-3 left-3 pointer-events-none z-10">
            <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-white text-xs font-semibold tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate max-w-[220px] sm:max-w-md">{lesson.title}</span>
            </span>
          </div>
        )}
      </div>

      {/* Lesson Controls & Navigation Bar */}
      {lesson && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface border border-outline shadow-2xs">
          {/* Navigation: Previous Lesson */}
          <button
            type="button"
            disabled={!hasPrevious}
            onClick={onPreviousLesson}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              hasPrevious
                ? 'bg-surface-muted hover:bg-slate-200/70 text-slateText-primary active:scale-95'
                : 'opacity-40 cursor-not-allowed text-slateText-muted'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Materi Sebelumnya</span>
          </button>

          {/* Mark as Complete Button */}
          {isEnrolled && (
            <button
              type="button"
              onClick={() => onMarkAsComplete(lesson.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                lesson.isCompleted
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                  : 'bg-brand-500 text-white hover:bg-brand-600 shadow-purple-glow'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lesson.isCompleted ? 'Selesai ✓' : 'Tandai Selesai'}</span>
            </button>
          )}

          {/* Navigation: Next Lesson */}
          <button
            type="button"
            disabled={!hasNext}
            onClick={onNextLesson}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              hasNext
                ? 'bg-surface-muted hover:bg-slate-200/70 text-slateText-primary active:scale-95'
                : 'opacity-40 cursor-not-allowed text-slateText-muted'
            }`}
          >
            <span>Materi Berikutnya</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
