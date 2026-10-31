import React from 'react';

export const ContentAreaSkeleton: React.FC = () => {
  return (
    <div
      className="space-y-6 animate-pulse select-none motion-reduce:animate-none"
      role="status"
      aria-label="Memuat konten halaman..."
    >
      <span className="sr-only">Memuat konten halaman...</span>

      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-surface border border-outline shadow-2xs">
        <div className="space-y-2">
          <div className="w-48 h-6 rounded-lg bg-surface-muted" />
          <div className="w-72 h-4 rounded-md bg-surface-muted/80" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-9 rounded-full bg-surface-muted" />
          <div className="w-24 h-9 rounded-full bg-surface-muted" />
        </div>
      </div>

      {/* Grid Skeleton Cards (Matching 4 columns on large screens) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
          <div
            key={item}
            className="p-3.5 rounded-card bg-surface border border-outline shadow-xs space-y-3.5"
          >
            {/* Thumbnail skeleton */}
            <div className="aspect-[16/10] w-full rounded-2xl bg-surface-muted" />

            {/* Tag & Title skeleton */}
            <div className="space-y-2">
              <div className="w-24 h-4.5 rounded-full bg-surface-muted" />
              <div className="w-full h-4 rounded-md bg-surface-muted" />
              <div className="w-2/3 h-4 rounded-md bg-surface-muted/80" />
            </div>

            {/* Progress line */}
            <div className="w-full h-1.5 rounded-full bg-surface-muted" />

            {/* Mentor row */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-outline">
              <div className="w-7 h-7 rounded-full bg-surface-muted shrink-0" />
              <div className="space-y-1 flex-1">
                <div className="w-20 h-3 rounded-sm bg-surface-muted" />
                <div className="w-12 h-2.5 rounded-sm bg-surface-muted/70" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

