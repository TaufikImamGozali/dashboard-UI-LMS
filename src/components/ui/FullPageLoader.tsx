import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface FullPageLoaderProps {
  title?: string;
  message?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  title = 'Coursue',
  message = 'Memuat platform pembelajaran...',
}) => {
  return (
    <div
      className="min-h-screen w-full bg-brand-bg flex flex-col items-center justify-center p-6 select-none animate-fade-in font-sans"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center max-w-sm text-center space-y-4">
        {/* Glowing Brand Icon */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 shadow-purple-glow flex items-center justify-center text-white ring-4 ring-brand-500/20 animate-pulse">
            <Sparkles className="w-8 h-8 stroke-[2.2]" />
          </div>
          {/* Subtle spinning glow accent */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-brand-500 to-purple-400 opacity-20 blur-md -z-10 animate-pulse" />
        </div>

        {/* Brand Title */}
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-600 via-purple-500 to-indigo-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">
            {title}
          </h1>
        </div>

        {/* Spinner & Informative Message */}
        <div className="flex flex-col items-center space-y-2.5 pt-2">
          <Loader2 className="w-6 h-6 text-brand-500 animate-spin stroke-[2.2]" />
          <p className="text-xs font-semibold text-slateText-muted tracking-wide animate-pulse">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};

