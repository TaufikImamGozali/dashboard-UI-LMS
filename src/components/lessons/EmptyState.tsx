import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  onResetFilters: () => void;
  searchQuery?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onResetFilters,
  searchQuery,
}) => {
  return (
    <div className="bg-white rounded-[28px] p-8 sm:p-14 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center space-y-4 my-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center shadow-purple-glow">
        <SearchX className="w-8 h-8 stroke-[1.8]" />
      </div>

      <div className="max-w-md space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-bold text-slateText-primary tracking-tight">
          No Lessons Found
        </h2>
        <p className="text-xs sm:text-sm text-slateText-secondary leading-relaxed">
          {searchQuery
            ? `We couldn't find any lessons matching "${searchQuery}". Try different keywords or reset your filters.`
            : 'No courses match your selected filter criteria. Try expanding your search.'}
        </p>
      </div>

      <div className="pt-2">
        <Button
          variant="primary"
          size="sm"
          onClick={onResetFilters}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          className="rounded-full shadow-purple-glow"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
