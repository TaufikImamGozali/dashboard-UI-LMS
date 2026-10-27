import React from 'react';
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp } from 'lucide-react';

interface AdminStatsCardsProps {
  totalStudents: number;
  totalCourses: number;
  totalMentors: number;
  totalRevenue?: number;
}

export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  totalStudents,
  totalCourses,
  totalMentors,
  totalRevenue = 28450,
}) => {
  const cards = [
    {
      label: 'Total Students',
      value: totalStudents.toLocaleString(),
      change: '+14.2%',
      trend: 'up',
      icon: Users,
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      label: 'Active Courses',
      value: totalCourses.toString(),
      change: '+2 this month',
      trend: 'up',
      icon: BookOpen,
      bg: 'bg-brand-50 dark:bg-brand-950/30',
      iconColor: 'text-brand-500',
    },
    {
      label: 'Registered Mentors',
      value: totalMentors.toString(),
      change: '100% verified',
      trend: 'neutral',
      icon: GraduationCap,
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Monthly Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+18.5%',
      trend: 'up',
      icon: DollarSign,
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-surface border border-outline shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-content-muted uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.iconColor} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <h3 className="text-2xl font-extrabold text-content-primary tracking-tight">
                {card.value}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {card.change}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
