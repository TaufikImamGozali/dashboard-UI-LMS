import React from 'react';
import { CalendarDays, AlarmClock } from 'lucide-react';
import type { Task } from '../../types/task';
import { TagBadge } from '../ui/TagBadge';

interface UpcomingDeadlinesProps {
  tasks: Task[];
}

function daysLeft(deadline: string): number {
  const d = new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ tasks }) => {
  const upcoming = [...tasks]
    .filter((t) => t.status !== 'done')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 4);

  return (
    <div className="bg-surface rounded-card border border-outline-subtle shadow-xs p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlarmClock className="w-4 h-4 text-brand-500" />
        <h3 className="text-sm font-extrabold text-slateText-primary">Upcoming Deadlines</h3>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-xs text-slateText-muted text-center py-4">No upcoming deadlines 🎉</p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((task) => {
            const left = daysLeft(task.deadline);
            const isUrgent = left <= 2;
            const label =
              left < 0
                ? 'Overdue!'
                : left === 0
                ? 'Due today!'
                : `${left} day${left === 1 ? '' : 's'} left`;

            return (
              <li
                key={task.id}
                className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-b-0 last:pb-0"
              >
                <div className="shrink-0 mt-0.5">
                  <TagBadge category={task.courseCategory} label={task.courseLabel} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slateText-primary line-clamp-1">{task.title}</p>
                  <div className={`flex items-center gap-1 mt-0.5 text-meta font-semibold ${isUrgent ? 'text-red-500' : 'text-slateText-muted'}`}>
                    <CalendarDays className="w-3 h-3" />
                    <span>{label}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
