import React from 'react';
import type { ViewMode } from '../../types';

interface CourseSkeletonProps {
  viewMode: ViewMode;
  count?: number;
}

export const CourseSkeleton: React.FC<CourseSkeletonProps> = ({
  viewMode,
  count = 6,
}) => {
  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 animate-pulse">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[24px] p-3.5 border border-slate-100 shadow-xs space-y-3.5"
            >
              {/* Thumbnail Skeleton */}
              <div className="aspect-[16/10] w-full rounded-[18px] bg-slate-200" />

              {/* Tag & Title Skeleton */}
              <div className="space-y-2">
                <div className="w-20 h-5 bg-slate-200 rounded-full" />
                <div className="w-full h-4 bg-slate-200 rounded-md" />
                <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
              </div>

              {/* Progress Bar Skeleton */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full" />

              {/* Mentor Row Skeleton */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                <div className="w-7 h-7 rounded-full bg-slate-200 shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="w-24 h-3 bg-slate-200 rounded-sm" />
                  <div className="w-14 h-2.5 bg-slate-200 rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3.5 animate-pulse">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-[22px] p-4 border border-slate-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-28 sm:w-36 h-20 sm:h-24 rounded-2xl bg-slate-200 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="w-20 h-4 bg-slate-200 rounded-full" />
                  <div className="w-3/4 h-4 bg-slate-200 rounded-md" />
                  <div className="w-1/2 h-3 bg-slate-200 rounded-sm" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-32 h-3 bg-slate-200 rounded-full" />
                <div className="w-24 h-8 bg-slate-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
