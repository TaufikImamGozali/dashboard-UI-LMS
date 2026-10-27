import React, { useRef } from 'react';
import { X, CalendarDays, Flag, Paperclip, CheckSquare, CheckCircle2, FileText, FileImage, Archive } from 'lucide-react';
import type { Task, Priority, TaskAttachment } from '../../types/task';
import { TagBadge } from '../ui/TagBadge';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const priorityConfig: Record<Priority, { label: string; classes: string }> = {
  Low: { label: 'Low', classes: 'bg-emerald-50 text-emerald-600' },
  Medium: { label: 'Medium', classes: 'bg-amber-50 text-amber-600' },
  High: { label: 'High', classes: 'bg-red-50 text-red-600' },
};

const attachmentIcon = (type: TaskAttachment['type']) => {
  switch (type) {
    case 'pdf': return <FileText className="w-4 h-4 text-red-500" />;
    case 'figma': return <FileImage className="w-4 h-4 text-brand-500" />;
    case 'zip': return <Archive className="w-4 h-4 text-amber-500" />;
    case 'image': return <FileImage className="w-4 h-4 text-emerald-500" />;
    default: return <FileText className="w-4 h-4 text-slateText-muted" />;
  }
};

interface TaskDrawerProps {
  task: Task | null;
  isOpen: boolean;
  isOverdue: boolean;
  onClose: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onMarkDone: (id: string) => void;
}

export const TaskDrawer: React.FC<TaskDrawerProps> = ({
  task,
  isOpen,
  isOverdue,
  onClose,
  onToggleSubtask,
  onMarkDone,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useFocusTrap<HTMLDivElement>(isOpen, onClose, closeRef);

  if (!task) return null;

  const pct = task.subtasks.length
    ? Math.round(
        (task.subtasks.filter((s) => s.isCompleted).length / task.subtasks.length) * 100
      )
    : 0;
  const pConfig = priorityConfig[task.priority];

  return (
    <>
      {/* Backdrop (mobile) */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-overlay transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
        className={`fixed right-0 top-0 h-full w-full sm:w-chat-drawer bg-surface shadow-2xl z-drawer flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-6 pb-5 border-b border-slate-100 shrink-0">
          <div className="flex-1 min-w-0">
            <TagBadge category={task.courseCategory} label={task.courseLabel} />
            <h2
              id="task-drawer-title"
              className="mt-2 text-base font-extrabold text-slateText-primary leading-snug"
            >
              {task.title}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close task detail"
            className="p-2 rounded-full hover:bg-slate-100 text-slateText-muted hover:text-slateText-primary transition-colors mt-0.5 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Meta row */}
          <div className="flex flex-wrap gap-3">
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${isOverdue ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slateText-secondary'}`}>
              <CalendarDays className="w-3.5 h-3.5" />
              {new Date(task.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              {isOverdue && ' · Overdue'}
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${pConfig.classes}`}>
              <Flag className="w-3 h-3" />
              {pConfig.label} Priority
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slateText-muted uppercase tracking-wide mb-2">Description</h3>
            <p className="text-sm text-slateText-secondary leading-relaxed">
              {task.description || 'No description provided.'}
            </p>
          </div>

          {/* Mentor */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3">
            {task.mentorAvatar && (
              <img height="160" width="160" loading="lazy"
                src={task.mentorAvatar}
                alt={task.mentorName}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-surface shadow-sm"
              />
            )}
            <div>
              <p className="text-xs text-slateText-muted font-semibold">Assigned Mentor</p>
              <p className="text-sm font-bold text-slateText-primary">{task.mentorName}</p>
            </div>
          </div>

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slateText-muted uppercase tracking-wide">
                  Subtasks
                </h3>
                <span className="text-xs font-bold text-brand-500">{pct}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <ul className="space-y-2.5">
                {task.subtasks.map((st) => (
                  <li key={st.id}>
                    <button
                      type="button"
                      onClick={() => onToggleSubtask(task.id, st.id)}
                      className="flex items-center gap-3 w-full text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 rounded-xl p-1.5 hover:bg-slate-50 transition-colors"
                      aria-label={`${st.isCompleted ? 'Uncheck' : 'Check'} subtask: ${st.title}`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${st.isCompleted ? 'bg-brand-500 border-brand-500' : 'border-slate-300 group-hover:border-brand-400'}`}>
                        {st.isCompleted && <CheckSquare className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm transition-colors ${st.isCompleted ? 'line-through text-slateText-muted' : 'text-slateText-primary font-medium'}`}>
                        {st.title}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Attachments */}
          {task.attachments.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slateText-muted uppercase tracking-wide mb-3">
                <span className="flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5" />
                  Attachments ({task.attachments.length})
                </span>
              </h3>
              <ul className="space-y-2">
                {task.attachments.map((att) => (
                  <li
                    key={att.id}
                    className="flex items-center gap-3 bg-surface-muted rounded-2xl px-4 py-3 border border-slate-100"
                  >
                    <div className="w-8 h-8 bg-surface rounded-xl flex items-center justify-center shadow-2xs shrink-0">
                      {attachmentIcon(att.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slateText-primary truncate">{att.name}</p>
                      <p className="text-xs text-slateText-muted">{att.size}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        {task.status !== 'done' && (
          <div className="px-6 py-5 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={() => { onMarkDone(task.id); onClose(); }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark as Done
            </button>
          </div>
        )}
        {task.status === 'done' && (
          <div className="px-6 py-5 border-t border-slate-100 shrink-0">
            <div className="flex items-center justify-center gap-2 py-3 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Completed
            </div>
          </div>
        )}
      </div>
    </>
  );
};
