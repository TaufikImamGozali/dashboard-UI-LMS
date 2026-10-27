import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import type { Task, NewTaskForm, TaskViewMode, TaskStatus } from '../types/task';
import { useTasks } from '../hooks/useTasks';
import { useToast } from '../hooks/useToast';
import { COURSE_OPTIONS } from '../components/task/TaskFormModal';

// Components
import { TaskSummaryCards } from '../components/task/TaskSummaryCards';
import { TaskToolbar } from '../components/task/TaskToolbar';
import { TaskBoard } from '../components/task/TaskBoard';
import { TaskTable } from '../components/task/TaskTable';
import { TaskFormModal } from '../components/task/TaskFormModal';
import { TaskDrawer } from '../components/task/TaskDrawer';
import { MiniCalendar } from '../components/task/MiniCalendar';
import { UpcomingDeadlines } from '../components/task/UpcomingDeadlines';
import { WeeklyProgressChart } from '../components/task/WeeklyProgressChart';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ToastContainer } from '../components/ui/Toast';

const MOBILE_TABS: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

export const TaskPage: React.FC = () => {
  const { tasks, counts, isOverdue, addTask, updateTask, deleteTask, moveTask, toggleSubtask, markDone } =
    useTasks();
  const { toasts, showToast, dismissToast } = useToast();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<TaskViewMode>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<TaskStatus>('todo');

  // Modal / drawer state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [drawerTask, setDrawerTask] = useState<Task | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // ── Filtered tasks ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCourse = selectedCourse === 'all' || t.courseId === selectedCourse;
      const matchDate = !selectedDate || t.deadline === selectedDate;
      return matchSearch && matchCourse && matchDate;
    });
  }, [tasks, searchQuery, selectedCourse, selectedDate]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleFormSubmit = (form: NewTaskForm) => {
    if (editingTask) {
      const course = COURSE_OPTIONS.find((c) => c.id === form.courseId);
      updateTask(editingTask.id, {
        ...form,
        courseLabel: course?.label ?? editingTask.courseLabel,
        courseCategory: course?.category ?? editingTask.courseCategory,
        mentorName: course?.mentorName ?? editingTask.mentorName,
        mentorAvatar: course?.mentorAvatar ?? editingTask.mentorAvatar,
      });
      showToast('Task updated successfully!', 'success');
    } else {
      addTask(form, COURSE_OPTIONS);
      showToast('New task created!', 'success');
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetId) return;
    deleteTask(deleteTargetId);
    showToast('Task deleted.', 'delete');
    setDeleteTargetId(null);
    if (drawerTask?.id === deleteTargetId) {
      setIsDrawerOpen(false);
      setDrawerTask(null);
    }
  };

  const handleOpenTask = (task: Task) => {
    setDrawerTask(task);
    setIsDrawerOpen(true);
  };

  const handleMarkDone = (id: string) => {
    markDone(id);
    showToast('Task marked as done! 🎉', 'success');
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    toggleSubtask(taskId, subtaskId);
    // Refresh drawer task reference
    setDrawerTask((prev) =>
      prev?.id === taskId
        ? {
            ...prev,
            subtasks: prev.subtasks.map((s) =>
              s.id === subtaskId ? { ...s, isCompleted: !s.isCompleted } : s
            ),
          }
        : prev
    );
  };

  return (
    <div className="space-y-5 pb-6">
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slateText-primary tracking-tight">
            My Tasks
          </h1>
          <p className="text-xs sm:text-sm text-slateText-muted mt-1">
            Track and manage all your course assignments in one place
          </p>
        </div>
        {/* Desktop New Task button */}
        <button
          type="button"
          onClick={() => { setEditingTask(null); setIsFormOpen(true); }}
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white text-sm font-bold transition-all shadow-purple-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 shrink-0"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </div>

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      <TaskSummaryCards counts={counts} />

      {/* ── Two-column layout ─────────────────────────────────────────────── */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">
        {/* ── Left: main content ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Toolbar */}
          <TaskToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCourse={selectedCourse}
            onCourseChange={setSelectedCourse}
            tasks={tasks}
          />

          {/* Mobile status tabs (board only) */}
          {viewMode === 'board' && (
            <div className="sm:hidden flex border-b border-slate-200">
              {MOBILE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveMobileTab(tab.id)}
                  className={`flex-1 pb-2.5 text-xs font-bold transition-colors relative ${
                    activeMobileTab === tab.id
                      ? 'text-brand-500'
                      : 'text-slateText-muted hover:text-slateText-primary'
                  }`}
                >
                  {tab.label}
                  {activeMobileTab === tab.id && (
                    <span className="absolute bottom-0 inset-x-2 h-0.5 bg-brand-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Board or List */}
          {viewMode === 'board' ? (
            <TaskBoard
              tasks={filtered}
              isOverdue={isOverdue}
              onMoveTask={moveTask}
              onOpenTask={handleOpenTask}
              onEditTask={handleOpenEdit}
              onDeleteTask={handleDeleteRequest}
              activeMobileTab={activeMobileTab}
            />
          ) : (
            <TaskTable
              tasks={filtered}
              isOverdue={isOverdue}
              onOpenTask={handleOpenTask}
              onEditTask={handleOpenEdit}
              onDeleteTask={handleDeleteRequest}
              onCreateTask={() => { setEditingTask(null); setIsFormOpen(true); }}
            />
          )}
        </div>

        {/* ── Right panel ────────────────────────────────────────────────── */}
        <div className="w-full xl:w-72 space-y-4 shrink-0">
          <MiniCalendar tasks={tasks} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
          <UpcomingDeadlines tasks={tasks} />
          <WeeklyProgressChart tasks={tasks} />
        </div>
      </div>

      {/* ── Modals / Drawers / Overlays ───────────────────────────────────── */}
      {isFormOpen && (
        <TaskFormModal
          isOpen
          editTask={editingTask}
          onClose={() => { setIsFormOpen(false); setEditingTask(null); }}
          onSubmit={handleFormSubmit}
        />
      )}

      <TaskDrawer
        task={drawerTask}
        isOpen={isDrawerOpen}
        isOverdue={drawerTask ? isOverdue(drawerTask) : false}
        onClose={() => setIsDrawerOpen(false)}
        onToggleSubtask={handleToggleSubtask}
        onMarkDone={handleMarkDone}
      />

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Task"
        message="This task will be permanently deleted. This action cannot be undone."
        confirmLabel="Delete Task"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Mobile FAB */}
      <button
        type="button"
        onClick={() => { setEditingTask(null); setIsFormOpen(true); }}
        aria-label="Create new task"
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-purple-glow flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 z-popover"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
