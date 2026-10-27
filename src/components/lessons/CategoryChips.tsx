import React from 'react';
import type { CategoryType } from '../../types';

interface CategoryChipsProps {
  selectedCategory: CategoryType | 'all';
  onSelectCategory: (category: CategoryType | 'all') => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const categories: Array<{ id: CategoryType | 'all'; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'design', label: 'UI/UX Design' },
    { id: 'branding', label: 'Branding' },
    { id: 'frontend', label: 'Front End' },
  ];

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1"
    >
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            aria-pressed={isActive}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 select-none ${
              isActive
                ? 'bg-brand-500 text-white shadow-purple-glow'
                : 'bg-white hover:bg-slate-50 text-slateText-secondary hover:text-slateText-primary border border-slate-200/80'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
