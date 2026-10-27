import React from 'react';

interface DateDividerProps {
  label: string;
}

export const DateDivider: React.FC<DateDividerProps> = ({ label }) => (
  <div className="flex items-center gap-3 py-3" role="separator" aria-label={label}>
    <div className="h-px flex-1 bg-slate-100" />
    <span className="rounded-full bg-brand-surface px-3 py-1 text-[10px] font-bold text-slateText-muted">
      {label}
    </span>
    <div className="h-px flex-1 bg-slate-100" />
  </div>
);
