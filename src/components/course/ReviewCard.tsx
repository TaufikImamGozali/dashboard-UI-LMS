import React from 'react';
import { Star } from 'lucide-react';
import type { CourseReview } from '../../types';

interface ReviewCardProps {
  review: CourseReview;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="p-4 sm:p-5 rounded-[20px] bg-white border border-slate-200/70 shadow-2xs space-y-3">
      {/* Header: User avatar, name, date, stars */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={review.userAvatar}
            alt={review.userName}
            className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
          />
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-slateText-primary truncate">
              {review.userName}
            </h2>
            <p className="text-[11px] text-slateText-muted">{review.date}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 shrink-0" aria-label={`Rating: ${review.rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < Math.floor(review.rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-200 text-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Review Comment */}
      <p className="text-xs sm:text-sm text-slateText-secondary leading-relaxed">
        {review.comment}
      </p>
    </div>
  );
};
