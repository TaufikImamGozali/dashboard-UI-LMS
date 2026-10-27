import React, { useState } from 'react';
import { Heart, Share2, Check, ArrowRight } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { Button } from '../ui/Button';

interface CourseProgressPanelProps {
  completedLessons: number;
  totalLessons: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onContinueLearning: () => void;
}

export const CourseProgressPanel: React.FC<CourseProgressPanelProps> = ({
  completedLessons,
  totalLessons,
  isFavorite,
  onToggleFavorite,
  onContinueLearning,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Main Progress Card */}
      <div className="bg-white rounded-[26px] p-6 border border-[#EEF0F6] shadow-xs space-y-5">
        <h2 className="text-base font-bold text-slateText-primary tracking-tight">
          Your Progress
        </h2>

        {/* Ring & Details */}
        <div className="flex items-center gap-4">
          <ProgressRing progress={percentage} size={76} strokeWidth={6} />

          <div className="space-y-1">
            <p className="text-sm font-bold text-slateText-primary">
              {completedLessons} of {totalLessons} completed
            </p>
            <p className="text-xs text-slateText-muted">
              {percentage === 100
                ? '🎉 Congratulations! Course completed'
                : 'Keep going to achieve your certificate!'}
            </p>
          </div>
        </div>

        {/* Continue Learning CTA Button */}
        <div>
          <Button
            variant="primary"
            fullWidth
            size="md"
            onClick={onContinueLearning}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="rounded-full shadow-purple-glow"
          >
            Continue Learning
          </Button>
        </div>
      </div>

      {/* Action Buttons: Favorite and Share */}
      <div className="grid grid-cols-2 gap-3">
        {/* Favorite Button */}
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-full border text-xs font-bold transition-all active:scale-95 shadow-2xs ${
            isFavorite
              ? 'bg-rose-50 border-rose-200 text-rose-500'
              : 'bg-white hover:bg-slate-50 border-slate-200 text-slateText-secondary hover:text-slateText-primary'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`}
          />
          <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
        </button>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slateText-secondary hover:text-slateText-primary text-xs font-bold transition-all active:scale-95 shadow-2xs"
          aria-label="Share course link"
        >
          {isCopied ? (
            <>
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
