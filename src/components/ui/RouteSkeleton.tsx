import React from 'react';

export const RouteSkeleton: React.FC = () => (
  <div className="min-h-empty animate-pulse space-y-5 motion-reduce:animate-none" aria-label="Loading page" role="status">
    <span className="sr-only">Loading page...</span>
    <div className="h-24 rounded-card bg-surface-muted" />
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((item) => <div key={item} className="h-56 rounded-card bg-surface-muted" />)}
    </div>
  </div>
);
