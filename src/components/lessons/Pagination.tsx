import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  onPageChange,
}) => {
  if (totalCount === 0) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  // Generate page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
      {/* Result Count Announced to Screen Readers */}
      <p
        aria-live="polite"
        className="text-xs font-semibold text-slateText-secondary"
      >
        Showing <span className="text-slateText-primary font-bold">{startItem}-{endItem}</span> of{' '}
        <span className="text-slateText-primary font-bold">{totalCount}</span> lessons
      </p>

      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <nav
          role="navigation"
          aria-label="Pagination"
          className="flex items-center gap-1.5"
        >
          {/* Prev Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
            className="w-9 h-9 rounded-full bg-surface hover:bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slateText-secondary hover:text-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.2]" />
          </button>

          {/* Page Number Buttons */}
          <div className="flex items-center gap-1">
            {pages.map((p) => {
              const isCurrent = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onPageChange(p)}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={`Go to page ${p}`}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                    isCurrent
                      ? 'bg-brand-500 text-white shadow-purple-glow'
                      : 'bg-surface hover:bg-slate-50 text-slateText-secondary hover:text-slateText-primary border border-slate-200/80'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
            className="w-9 h-9 rounded-full bg-surface hover:bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slateText-secondary hover:text-brand-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-2xs"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.2]" />
          </button>
        </nav>
      )}
    </div>
  );
};
