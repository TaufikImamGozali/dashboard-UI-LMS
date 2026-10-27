import React, { useState } from 'react';
import { CalendarDays, Flag, MoreVertical, CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Task, Priority, TaskStatus } from '../../types/task';
import { TagBadge } from '../ui/TagBadge';
import { EmptyState } from '../ui/EmptyState';

const priorityConfig: Record<Priority, { label: string; classes: string }> = {
  Low: { label: 'Low', classes: 'bg-emerald-50 text-emerald-600' },
  Medium: { label: 'Medium', classes: 'bg-amber-50 text-amber-600' },
  High: { label: 'High', classes: 'bg-red-50 text-red-600' },
};

const statusConfig: Record<TaskStatus, { label: string; icon: React.ReactNode; classes: string }> = {
  todo: { label: 'To Do', icon: <Circle className="w-3 h-3" />, classes: 'bg-slate-100 text-slateText-secondary' },
  'in-progress': { label: 'In Progress', icon: <Clock className="w-3 h-3" />, classes: 'bg-amber-50 text-amber-600' },
  done: { label: 'Done', icon: <CheckCircle2 className="w-3 h-3" />, classes: 'bg-emerald-50 text-emerald-600' },
};

interface TaskTableProps {
  tasks: Task[];
  isOverdue: (task: Task) => boolean;
  onOpenTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onCreateTask: () => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  isOverdue,
  onOpenTask,
  onEditTask,
  onDeleteTask,
  onCreateTask,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="bg-surface rounded-card border border-outline-subtle shadow-xs overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-task-table gap-4 px-5 py-3.5 bg-surface-muted border-b border-slate-100 text-meta font-bold text-slateText-muted uppercase tracking-wide">
        <span>Task</span>
        <span>Course</span>
        <span>Deadline</span>
        <span>Priority</span>
        <span>Status</span>
        <span />
      </div>

      {/* Rows */}
      {tasks.length === 0 ? (
        <EmptyState title="No tasks found" description="Adjust the filters or create a new task." actionLabel="Create task" onAction={onCreateTask} className="rounded-none border-0 shadow-none" />
      ) : (
        tasks.map((task, i) => {
          const overdue = isOverdue(task);
          const pConfig = priorityConfig[task.priority];
          const sConfig = statusConfig[task.status];

          return (
            <div
              key={task.id}
              onClick={() => onOpenTask(task)}
              onKeyDown={(event) => {
                if (event.currentTarget !== event.target) return;
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenTask(task);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open task: ${task.title}`}
              className={`grid grid-cols-task-table gap-4 px-5 py-4 cursor-pointer hover:bg-surface-muted transition-colors items-center ${
                i < tasks.length - 1 ? 'border-b border-slate-100/80' : ''
              }`}
            >
              {/* Task name */}
              <div className="min-w-0">
                <p className="text-sm font-bold text-slateText-primary line-clamp-1 hover:text-brand-500 transition-colors">
                  {task.title}
                </p>
                <p className="text-xs text-slateText-muted line-clamp-1 mt-0.5">
                  {task.description}
                </p>
              </div>

              {/* Course */}
              <div>
                <TagBadge category={task.courseCategory} label={task.courseLabel} />
              </div>

              {/* Deadline */}
              <div className={`flex items-center gap-1.5 text-xs font-semibold ${overdue ? 'text-red-500' : 'text-slateText-muted'}`}>
                <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  {overdue && ' · Overdue'}
                </span>
              </div>

              {/* Priority */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-meta font-bold w-fit ${pConfig.classes}`}>
                <Flag className="w-2.5 h-2.5" />
                {pConfig.label}
              </span>

              {/* Status */}
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-meta font-bold w-fit ${sConfig.classes}`}>
                {sConfig.icon}
                {sConfig.label}
              </span>

              {/* 3-dot action */}
              <div
                className="relative flex justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Task options"
                  aria-haspopup="true"
                  aria-expanded={openMenuId === task.id}
                  onClick={() => setOpenMenuId((id) => (id === task.id ? null : task.id))}
                  className="p-1.5 rounded-full text-slateText-muted hover:text-slateText-primary hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {openMenuId === task.id && (
                  <div className="absolute right-0 top-8 w-28 bg-surface rounded-2xl border border-slate-100 shadow-card z-popover overflow-hidden py-1">
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-slateText-primary hover:bg-brand-50 hover:text-brand-600 transition-colors"
                      onClick={() => { setOpenMenuId(null); onEditTask(task); }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                      onClick={() => { setOpenMenuId(null); onDeleteTask(task.id); }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
