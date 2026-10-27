import React from 'react';
import type { CategoryType } from '../types';
import { Code2, Scissors, Palette } from 'lucide-react';

interface CategoryBadgeProps {
  category: CategoryType;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  label,
  showIcon = true,
  className = '',
}) => {
  const getBadgeConfig = () => {
    switch (category) {
      case 'frontend':
        return {
          bg: 'bg-category-frontend-bg text-category-frontend-text',
          defaultLabel: 'FRONT END',
          icon: <Code2 className="w-3 h-3 stroke-[2.5]" />,
        };
      case 'design':
        return {
          bg: 'bg-category-design-bg text-category-design-text',
          defaultLabel: 'UI/UX DESIGN',
          icon: <Scissors className="w-3 h-3 stroke-[2.5]" />,
        };
      case 'branding':
        return {
          bg: 'bg-category-branding-bg text-category-branding-text',
          defaultLabel: 'BRANDING',
          icon: <Palette className="w-3 h-3 stroke-[2.5]" />,
        };
    }
  };

  const config = getBadgeConfig();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-200 select-none ${config.bg} ${className}`}
    >
      {showIcon && config.icon}
      <span>{label || config.defaultLabel}</span>
    </span>
  );
};
