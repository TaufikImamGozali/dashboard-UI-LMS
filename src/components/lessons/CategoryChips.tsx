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
    { id: 'ai', label: 'AI & Machine Learning' },
    { id: 'frontend', label: 'Web & Tech' },
    { id: 'design', label: 'UI/UX Design' },
    { id: 'branding', label: 'Graphic & Branding' },
    { id: 'data', label: 'Data Analytics' },
    { id: 'security', label: 'Cybersecurity' },
    { id: 'creative', label: 'Creative & Video' },
    { id: 'marketing', label: 'Digital Marketing' },
    { id: 'business', label: 'Business & Finance' },
    { id: 'softskills', label: 'Career & Skills' },
    { id: 'devops', label: 'Cloud & DevOps' },
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
                : 'bg-surface hover:bg-slate-50 text-slateText-secondary hover:text-slateText-primary border border-slate-200/80'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
};
