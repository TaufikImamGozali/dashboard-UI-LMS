import React, { useRef, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import type { Task, NewTaskForm, Priority, TaskStatus } from '../../types/task';
import { mockCourses } from '../../data/mockData';
import { useFocusTrap } from '../../hooks/useFocusTrap';

const COURSE_OPTIONS = mockCourses.map((c) => ({
  id: c.id,
  label: c.categoryLabel,
  title: c.title.length > 42 ? c.title.slice(0, 42) + '…' : c.title,
  category: c.category as 'frontend' | 'design' | 'branding',
  mentorName: c.mentor.name,
  mentorAvatar: c.mentor.avatar,
}));

const INITIAL_FORM: NewTaskForm = {
  title: '',
  description: '',
  courseId: 'c1',
  deadline: '',
  priority: 'Medium',
  status: 'todo',
};

const getInitialForm = (editTask?: Task | null): NewTaskForm =>
  editTask
    ? {
        title: editTask.title,
        description: editTask.description,
        courseId: editTask.courseId,
        deadline: editTask.deadline,
        priority: editTask.priority,
        status: editTask.status,
      }
    : INITIAL_FORM;

interface TaskFormModalProps {
  isOpen: boolean;
  editTask?: Task | null;
  onClose: () => void;
  onSubmit: (form: NewTaskForm) => void;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  editTask,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<NewTaskForm>(() => getInitialForm(editTask));
  const [errors, setErrors] = useState<Partial<Record<keyof NewTaskForm, string>>>({});
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useFocusTrap<HTMLDivElement>(isOpen, onClose, firstInputRef);

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    else if (form.title.trim().length < 3) errs.title = 'Title must be at least 3 characters';
    if (!form.deadline) errs.deadline = 'Deadline is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  if (!isOpen) return null;

  const labelClass = 'block text-xs font-bold text-slateText-secondary mb-1.5';
  const inputClass =
    'w-full px-4 py-2.5 rounded-2xl border text-sm font-medium text-slateText-primary placeholder:text-slateText-muted bg-surface-muted focus:outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-300 focus:bg-surface transition-all';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
      className="fixed inset-0 z-modal flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div ref={dialogRef} className="relative bg-surface rounded-shell shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
              <Sparkles className="w-4.5 h-4.5 text-brand-500" />
            </div>
            <div>
              <h2 id="task-form-title" className="text-base font-extrabold text-slateText-primary leading-tight">
                {editTask ? 'Edit Task' : 'New Task'}
              </h2>
              <p className="text-xs text-slateText-muted">{editTask ? 'Update task details' : 'Fill in the details below'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-full hover:bg-slate-100 text-slateText-muted hover:text-slateText-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="overflow-y-auto px-7 py-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="task-title" className={labelClass}>
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="task-title"
              type="text"
              placeholder="e.g. Build login page component"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={`${inputClass} ${errors.title ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'}`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className={labelClass}>Description</label>
            <textarea
              id="task-desc"
              rows={3}
              placeholder="Describe what needs to be done…"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className={`${inputClass} resize-none border-slate-200`}
            />
          </div>

          {/* Course */}
          <div>
            <label htmlFor="task-course" className={labelClass}>Course</label>
            <select
              id="task-course"
              value={form.courseId}
              onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
              className={`${inputClass} appearance-none border-slate-200 cursor-pointer`}
            >
              {COURSE_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.label}] {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* Deadline + Priority row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-deadline" className={labelClass}>
                Deadline <span className="text-red-500">*</span>
              </label>
              <input
                id="task-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
                className={`${inputClass} ${errors.deadline ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200'} cursor-pointer`}
              />
              {errors.deadline && <p className="mt-1 text-xs text-red-500 font-semibold">{errors.deadline}</p>}
            </div>
            <div>
              <label htmlFor="task-priority" className={labelClass}>Priority</label>
              <select
                id="task-priority"
                value={form.priority}
                onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
                className={`${inputClass} appearance-none border-slate-200 cursor-pointer`}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="task-status" className={labelClass}>Initial Status</label>
            <select
              id="task-status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as TaskStatus }))}
              className={`${inputClass} appearance-none border-slate-200 cursor-pointer`}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-2 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-slate-200 text-sm font-bold text-slateText-secondary hover:bg-slate-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 shadow-purple-glow"
            >
              {editTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { COURSE_OPTIONS };
