import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
  headingLevel?: 'h1' | 'h2';
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction, icon, className = '', headingLevel = 'h2' }) => {
  const Heading = headingLevel;
  return (
    <div className={`flex flex-col items-center justify-center rounded-card border border-dashed border-outline bg-surface px-6 py-12 text-center shadow-xs ${className}`}>
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">{icon ?? <Inbox className="h-7 w-7" />}</span>
      <Heading className="mt-4 text-xl font-extrabold text-content-primary">{title}</Heading>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-content-secondary">{description}</p>
      {actionLabel && onAction && <Button className="mt-5" onClick={onAction}>{actionLabel}</Button>}
    </div>
  );
};
