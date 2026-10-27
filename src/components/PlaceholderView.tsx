import React from 'react';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  description: string;
  onBackToDashboard: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
  title,
  description,
  onBackToDashboard,
}) => {
  return (
    <div className="bg-surface rounded-shell p-8 sm:p-12 border border-outline-subtle shadow-xs flex flex-col items-center justify-center text-center my-6 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center shadow-purple-glow">
        <Sparkles className="w-8 h-8 stroke-[2]" />
      </div>

      <div className="max-w-md space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slateText-primary tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-slateText-secondary leading-relaxed">
          {description}
        </p>
      </div>

      <button
        onClick={onBackToDashboard}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold text-xs transition-transform active:scale-95 shadow-purple-glow"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>
    </div>
  );
};
