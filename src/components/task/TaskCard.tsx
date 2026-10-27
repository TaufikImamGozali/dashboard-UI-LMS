import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarDays, MoreVertical, Flag, CheckSquare } from 'lucide-react';
import type { Task, Priority } from '../../types/task';
import { CategoryBadge } from '../CategoryBadge';

const priorityConfig: Record<Priority, { label: string; classes: string }> = {
  Low: { label: 'Low', classes: 'bg-emerald-50 text-emerald-600' },
  Medium: { label: 'Medium', classes: 'bg-amber-50 text-amber-600' },
  High: { label: 'High', classes: 'bg-red-50 text-red-600' },
};

interface TaskCardProps {
  task: Task;
  isOverdue: boolean;
  onOpen: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, isOverdue, onOpen, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
  };

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const pct = task.subtasks.length
    ? Math.round((task.subtasks.filter((s) => s.isCompleted).length / task.subtasks.length) * 100)
    : null;

  // Close menu on outside click
  React.useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const pConfig = priorityConfig[task.priority];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-[20px] p-4 border shadow-xs hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group select-none ${
        isDragging ? 'shadow-purple-glow border-brand-300' : 'border-[#EEF0F6] hover:border-[#DFE2EC]'
      }`}
      onClick={() => onOpen(task)}
    >
      {/* Drag handle + menu */}
      <div className="flex items-start justify-between mb-2.5">
        {/* Drag handle (touch-friendly) */}
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col gap-0.5 p-1.5 -m-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-grab active:cursor-grabbing"
          aria-label={`Drag task: ${task.title}`}
          role="button"
          tabIndex={0}
        >
          {[0, 1, 2].map((r) => (
            <div key={r} className="flex gap-0.5">
              {[0, 1].map((c) => (
                <div key={c} className="w-1 h-1 rounded-full bg-slateText-muted/40 group-hover:bg-slateText-muted/60 transition-colors" />
              ))}
            </div>
          ))}
        </div>

        {/* 3-dot menu */}
        <div ref={menuRef} className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            aria-label="Task options"
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="p-1.5 rounded-full text-slateText-muted hover:text-slateText-primary hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 w-32 bg-white rounded-2xl border border-slate-100 shadow-card z-50 overflow-hidden py-1">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-xs font-semibold text-slateText-primary hover:bg-brand-50 hover:text-brand-600 transition-colors"
                onClick={() => { setMenuOpen(false); onEdit(task); }}
              >
                Edit
              </button>
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                onClick={() => { setMenuOpen(false); onDelete(task.id); }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category badge */}
      <div className="mb-2">
        <CategoryBadge category={task.courseCategory} label={task.courseLabel} />
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-slateText-primary leading-snug line-clamp-2 mb-1.5 group-hover:text-brand-500 transition-colors">
        {task.title}
      </h3>

      {/* Subtask progress */}
      {pct !== null && (
        <div className="mb-2.5 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slateText-muted font-semibold">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              {task.subtasks.filter((s) => s.isCompleted).length}/{task.subtasks.length}
            </span>
            <span>{pct}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer: deadline + priority + mentor */}
      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
        <div className={`flex items-center gap-1 text-[11px] font-semibold ${isOverdue ? 'text-red-500' : 'text-slateText-muted'}`}>
          <CalendarDays className="w-3.5 h-3.5" />
          <span>
            {isOverdue ? 'Overdue · ' : ''}
            {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${pConfig.classes}`}>
            <Flag className="w-2.5 h-2.5" />
            {pConfig.label}
          </span>
          {task.mentorAvatar && (
            <img
              src={task.mentorAvatar}
              alt={task.mentorName}
              title={task.mentorName}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
            />
          )}
        </div>
      </div>
    </div>
  );
};
