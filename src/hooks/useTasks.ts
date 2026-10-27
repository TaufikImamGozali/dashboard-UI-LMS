import { useState, useEffect, useCallback } from 'react';
import type { Task, NewTaskForm, TaskStatus, Subtask } from '../types/task';
import { mockTasks } from '../data/tasks';

const STORAGE_KEY = 'coursue_tasks_v1';

const isOverdue = (task: Task): boolean => {
  if (task.status === 'done') return false;
  const deadline = new Date(task.deadline);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return deadline < now;
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Task[];
    } catch {
      // ignore
    }
    return mockTasks;
  });

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      // ignore quota errors
    }
  }, [tasks]);

  // ── Computed counts ────────────────────────────────────────────────────────
  const counts = {
    total: tasks.length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'done').length,
    overdue: tasks.filter(isOverdue).length,
  };

  // ── CRUD operations ────────────────────────────────────────────────────────
  const addTask = useCallback(
    (form: NewTaskForm, courses: { id: string; label: string; category: 'frontend' | 'design' | 'branding'; mentorName: string; mentorAvatar: string }[]) => {
      const course = courses.find((c) => c.id === form.courseId) ?? {
        id: form.courseId,
        label: 'FRONT END',
        category: 'frontend' as const,
        mentorName: 'Mentor',
        mentorAvatar: '',
      };

      const newTask: Task = {
        id: `t${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        courseId: form.courseId,
        courseLabel: course.label,
        courseCategory: course.category,
        deadline: form.deadline,
        priority: form.priority,
        status: form.status,
        mentorName: course.mentorName,
        mentorAvatar: course.mentorAvatar,
        subtasks: [],
        attachments: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      setTasks((prev) => [newTask, ...prev]);
      return newTask;
    },
    []
  );

  const updateTask = useCallback((id: string, changes: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...changes } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTask = useCallback((id: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st: Subtask) =>
            st.id === subtaskId ? { ...st, isCompleted: !st.isCompleted } : st
          ),
        };
      })
    );
  }, []);

  const markDone = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'done' } : t))
    );
  }, []);

  return {
    tasks,
    counts,
    isOverdue,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    toggleSubtask,
    markDone,
  };
}
