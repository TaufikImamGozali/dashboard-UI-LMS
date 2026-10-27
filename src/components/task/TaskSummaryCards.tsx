import React from 'react';
import { ListChecks, Loader2, CheckCircle2, AlertOctagon } from 'lucide-react';

interface Counts {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

interface TaskSummaryCardsProps {
  counts: Counts;
}

const cards = [
  {
    key: 'total' as keyof Counts,
    label: 'Total Tasks',
    icon: ListChecks,
    iconBg: 'bg-brand-50',
    iconColor: 'text-brand-500',
  },
  {
    key: 'inProgress' as keyof Counts,
    label: 'In Progress',
    icon: Loader2,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
  },
  {
    key: 'completed' as keyof Counts,
    label: 'Completed',
    icon: CheckCircle2,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
  },
  {
    key: 'overdue' as keyof Counts,
    label: 'Overdue',
    icon: AlertOctagon,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
];

export const TaskSummaryCards: React.FC<TaskSummaryCardsProps> = ({ counts }) => (
  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3.5">
    {cards.map(({ key, label, icon: Icon, iconBg, iconColor }) => (
      <div
        key={key}
        className="bg-surface rounded-card p-4 border border-outline-subtle shadow-xs flex items-center gap-4"
      >
        <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0">
          <p className="text-meta font-semibold text-slateText-muted uppercase tracking-wide truncate">
            {label}
          </p>
          <p className="text-2xl font-extrabold text-slateText-primary leading-none mt-0.5">
            {counts[key]}
          </p>
        </div>
      </div>
    ))}
  </div>
);
