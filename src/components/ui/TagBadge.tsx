import React from 'react';
import { Code2, Palette, Scissors } from 'lucide-react';
import type { CategoryType } from '../../types';

interface TagBadgeProps {
  category: CategoryType;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

const config = {
  frontend: { classes: 'bg-category-frontend-bg text-category-frontend-text', label: 'FRONT END', icon: Code2 },
  design: { classes: 'bg-category-design-bg text-category-design-text', label: 'UI/UX DESIGN', icon: Scissors },
  branding: { classes: 'bg-category-branding-bg text-category-branding-text', label: 'BRANDING', icon: Palette },
};

export const TagBadge: React.FC<TagBadgeProps> = ({ category, label, showIcon = true, className = '' }) => {
  const item = config[category];
  const Icon = item.icon;
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-meta font-bold uppercase tracking-wider ${item.classes} ${className}`}>{showIcon && <Icon className="h-3 w-3 stroke-[2.5]" />}<span>{label || item.label}</span></span>;
};
