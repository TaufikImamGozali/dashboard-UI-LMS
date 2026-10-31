import React from 'react';
import {
  Code2,
  Palette,
  Scissors,
  Sparkles,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Video,
  Users,
  Coins,
  Briefcase,
  Cloud,
  BookOpen,
} from 'lucide-react';
import type { CategoryType } from '../../types';

interface TagBadgeProps {
  category: CategoryType;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

const config: Record<
  string,
  { classes: string; label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  frontend: { classes: 'bg-category-frontend-bg text-category-frontend-text', label: 'FRONT END', icon: Code2 },
  design: { classes: 'bg-category-design-bg text-category-design-text', label: 'UI/UX DESIGN', icon: Scissors },
  branding: { classes: 'bg-category-branding-bg text-category-branding-text', label: 'BRANDING', icon: Palette },
  ai: { classes: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300', label: 'ARTIFICIAL INTELLIGENCE', icon: Sparkles },
  marketing: { classes: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300', label: 'DIGITAL MARKETING', icon: TrendingUp },
  data: { classes: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300', label: 'DATA ANALYTICS', icon: BarChart3 },
  security: { classes: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300', label: 'CYBERSECURITY', icon: ShieldCheck },
  creative: { classes: 'bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300', label: 'CREATIVE & VIDEO', icon: Video },
  softskills: { classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300', label: 'CAREER & SKILLS', icon: Users },
  finance: { classes: 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300', label: 'FINANCE', icon: Coins },
  business: { classes: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300', label: 'BUSINESS', icon: Briefcase },
  devops: { classes: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300', label: 'CLOUD & DEVOPS', icon: Cloud },
};

const defaultConfig = {
  classes: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  label: 'COURSE',
  icon: BookOpen,
};

export const TagBadge: React.FC<TagBadgeProps> = ({ category, label, showIcon = true, className = '' }) => {
  const item = config[category?.toLowerCase()] || defaultConfig;
  const Icon = item.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-meta font-bold uppercase tracking-wider ${item.classes} ${className}`}
    >
      {showIcon && <Icon className="h-3 w-3 stroke-[2.5]" />}
      <span>{label || item.label}</span>
    </span>
  );
};
