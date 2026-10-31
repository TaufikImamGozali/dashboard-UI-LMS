import React, { useEffect, useRef, useCallback } from 'react';
import {
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
  playTrigger?: number;
  onVideoEnded: (lessonId: string) => void;
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
  playTrigger = 0,
  onVideoEnded,
  onPreviousLesson,
  onNextLesson,
  hasPrevious = false,
  hasNext = false,
  onEnrollFree,
  onPaidClick,
}) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<any>(null);
  const hasTriggeredRef = useRef(false);

  // Reset trigger lock on lesson change
  useEffect(() => {
    hasTriggeredRef.current = false;
  }, [lesson?.id]);

  // Handle play trigger from "Lanjutkan Belajar" button
  useEffect(() => {
    if (playTrigger > 0 && iframeRef.current?.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
      } catch {
        // Ignore iframe communication errors
      }
    }
  }, [playTrigger]);

  // Load YouTube IFrame API script dynamically once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!(window as any).YT) {
      const existingScript = document.getElementById('youtube-iframe-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.body.appendChild(tag);
      }
    }
  }, []);

  const triggerCompletion = useCallback(() => {
    if (!lesson || !isEnrolled || hasTriggeredRef.current || lesson.isCompleted) return;
    hasTriggeredRef.current = true;
    onVideoEnded(lesson.id);
  }, [lesson, isEnrolled, onVideoEnded]);

  // Extract YouTube ID & construct embed URL with enablejsapi=1
  const getEmbedUrl = (url?: string): string | null => {
    if (!url) return null;
    const origin = typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : '';
    let videoId = '';
    const match = url.match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
    );
    if (match && match[1]) {
      videoId = match[1];
    } else if (url.includes('/embed/')) {
      const parts = url.split('/embed/');
      videoId = parts[1]?.split('?')[0] || '';
    }

    if (videoId) {
      return `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&origin=${origin}`;
    }
    return url;
  };

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;

    // Send listening handshake to YouTube IFrame
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'listening', id: 'coursue-yt-player' }),
        '*'
      );
    } catch {
      // Ignore
    }

    // Try binding official YT.Player if available
    try {
      const YT = (window as any).YT;
      if (YT && YT.Player && !playerRef.current) {
        playerRef.current = new YT.Player('coursue-yt-player', {
          events: {
            onStateChange: (event: any) => {
              if (event.data === 0) {
                triggerCompletion();
              }
            },
          },
        });
      }
    } catch {
      // Fallback to postMessage
    }
  };

  // YouTube postMessage listener & double-guard interval polling
  useEffect(() => {
    if (!lesson || !isEnrolled || lesson.isCompleted) return;

    const handleMessage = (e: MessageEvent) => {
      try {
        let payload = e.data;
        if (typeof payload === 'string') {
          try {
            payload = JSON.parse(payload);
          } catch {
            return;
          }
        }
        if (!payload || typeof payload !== 'object') return;

        // 1. Detect state change: 0 = ENDED
        if (
          (payload.event === 'onStateChange' && payload.info === 0) ||
          (payload.event === 'infoDelivery' && payload.info?.playerState === 0)
        ) {
          triggerCompletion();
          return;
        }

        // 2. Detect progress time near end (currentTime >= duration - 2s)
        if (payload.event === 'infoDelivery' && payload.info) {
          const { currentTime, duration } = payload.info;
          if (
            typeof currentTime === 'number' &&
            typeof duration === 'number' &&
            duration > 0 &&
            (currentTime >= duration - 2 || currentTime >= duration)
          ) {
            triggerCompletion();
          }
        }
      } catch {
        // Ignore non-YouTube messages
      }
    };

    window.addEventListener('message', handleMessage);

    // Polling interval (every 500ms): queries time & checks player instance
    const pollInterval = setInterval(() => {
      // Check YT.Player instance if initialized
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          if (duration > 0 && (currentTime >= duration - 2 || currentTime >= duration)) {
            triggerCompletion();
            return;
          }
        } catch {
          // Ignore
        }
      }

      // Send postMessage polling command into iframe
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'getCurrentTime', args: [] }),
            '*'
          );
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'getDuration', args: [] }),
            '*'
          );
        } catch {
          // Ignore
        }
      }
    }, 500);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(pollInterval);
    };
  }, [lesson, isEnrolled, triggerCompletion]);

  const isLocked = !isEnrolled && lesson && !lesson.videoUrl && lesson.isLocked;
  const embedUrl = lesson ? getEmbedUrl(lesson.videoUrl) : null;

  return (
    <div className="space-y-4" id="course-video-player-container">
      {/* Video Container */}
      <div className="relative aspect-video w-full rounded-card overflow-hidden bg-slate-900 shadow-card select-none">
        {isLocked ? (
          /* Locked State Overlay */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-950/90 backdrop-blur-sm">
            <img
              height="160"
              width="160"
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
          /* YouTube NoCookie iFrame Embed with JS API */
          <iframe
            ref={iframeRef}
            id="coursue-yt-player"
            src={embedUrl}
            title={lesson?.title || 'Course lesson'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleIframeLoad}
          />
        ) : (
          /* Fallback Thumbnail / Placeholder */
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              height="160"
              width="160"
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
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface border border-outline shadow-2xs">
          {/* Navigation: Previous Lesson */}
          <button
            type="button"
            disabled={!hasPrevious}
            onClick={onPreviousLesson}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              hasPrevious
                ? 'bg-surface-muted hover:bg-slate-200/70 dark:hover:bg-darkBorder text-slateText-primary active:scale-95 cursor-pointer'
                : 'opacity-40 cursor-not-allowed text-slateText-muted'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Materi Sebelumnya</span>
          </button>

          {/* Navigation: Next Lesson */}
          <button
            type="button"
            disabled={!hasNext}
            onClick={onNextLesson}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              hasNext
                ? 'bg-surface-muted hover:bg-slate-200/70 dark:hover:bg-darkBorder text-slateText-primary active:scale-95 cursor-pointer'
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
