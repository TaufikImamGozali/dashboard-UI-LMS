import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import type { CurriculumLesson } from '../../types';

interface VideoPlayerProps {
  lesson: CurriculumLesson | null;
  thumbnail: string;
  onMarkAsComplete: (lessonId: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  lesson,
  thumbnail,
  onMarkAsComplete,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(35);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // autoplay / playback fallback
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* Video Container */}
      <div
        ref={containerRef}
        className="relative aspect-video w-full rounded-[24px] overflow-hidden bg-slate-900 shadow-card group select-none"
      >
        {lesson?.videoUrl ? (
          <video
            ref={videoRef}
            src={lesson.videoUrl}
            poster={thumbnail}
            className="w-full h-full object-cover"
            onTimeUpdate={() => {
              if (videoRef.current) {
                const current = videoRef.current.currentTime;
                const duration = videoRef.current.duration || 1;
                setProgress((current / duration) * 100);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              if (lesson) onMarkAsComplete(lesson.id);
            }}
            onClick={togglePlay}
          />
        ) : (
          <img
            src={thumbnail}
            alt={lesson?.title || 'Course video thumbnail'}
            className="w-full h-full object-cover opacity-90"
          />
        )}

        {/* Center Circular Play Button */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <button
            type="button"
            onClick={togglePlay}
            className={`pointer-events-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-500/90 hover:bg-brand-500 text-white flex items-center justify-center shadow-purple-glow backdrop-blur-md transform transition-all duration-300 hover:scale-110 active:scale-95 ${
              isPlaying ? 'opacity-0 group-hover:opacity-90' : 'opacity-100'
            }`}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-current stroke-none" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current stroke-none ml-1" />
            )}
          </button>
        </div>

        {/* Top Floating Badge */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Now Playing</span>
          </span>

          {lesson?.isCompleted && (
            <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed</span>
            </span>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-5 pt-8 flex flex-col gap-2 transition-opacity duration-300">
          {/* Progress scrubber bar */}
          <div
            className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer relative group/bar"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              setProgress(clickPos * 100);
              if (videoRef.current && videoRef.current.duration) {
                videoRef.current.currentTime = clickPos * videoRef.current.duration;
              }
            }}
          >
            <div
              className="h-full bg-brand-500 rounded-full relative transition-all"
              style={{ width: `${progress}%` }}
            >
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md scale-0 group-hover/bar:scale-100 transition-transform" />
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between text-white text-xs font-medium pt-1">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="hover:text-brand-300 transition-colors p-1"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current stroke-none" />
                ) : (
                  <Play className="w-4 h-4 fill-current stroke-none" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime = 0;
                  setProgress(0);
                }}
                className="hover:text-brand-300 transition-colors p-1"
                aria-label="Replay video"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                className="hover:text-brand-300 transition-colors p-1"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <span className="text-white/80 select-none">
                {lesson?.duration || '15:00'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleFullscreen}
              className="hover:text-brand-300 transition-colors p-1"
              aria-label="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Title & Mark As Complete Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider">
            Current Lesson
          </p>
          <h2 className="text-base sm:text-lg font-bold text-slateText-primary">
            {lesson?.title || 'Select a lesson to begin learning'}
          </h2>
        </div>

        {lesson && (
          <button
            type="button"
            onClick={() => onMarkAsComplete(lesson.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 shrink-0 ${
              lesson.isCompleted
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                : 'bg-brand-50 hover:bg-brand-100 text-brand-500 border border-brand-200 shadow-2xs'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{lesson.isCompleted ? 'Completed' : 'Mark as Complete'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
