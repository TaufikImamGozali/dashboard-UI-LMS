import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../types/task';
import { TaskCard } from './TaskCard';

interface ColumnConfig {
  id: TaskStatus;
  label: string;
  accentColor: string;
  headerBg: string;
}

export const COLUMNS: ColumnConfig[] = [
  { id: 'todo', label: 'To Do', accentColor: 'bg-slate-400', headerBg: 'bg-slate-50' },
  { id: 'in-progress', label: 'In Progress', accentColor: 'bg-amber-400', headerBg: 'bg-amber-50' },
  { id: 'done', label: 'Done', accentColor: 'bg-emerald-400', headerBg: 'bg-emerald-50' },
];

interface TaskColumnProps {
  column: ColumnConfig;
  tasks: Task[];
  isOverdue: (task: Task) => boolean;
  onOpenTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  tasks,
  isOverdue,
  onOpenTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div className="flex flex-col min-w-[260px] sm:min-w-0 flex-1">
      {/* Column Header */}
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-[20px] mb-3 ${column.headerBg}`}>
        <div className={`w-2.5 h-2.5 rounded-full ${column.accentColor}`} />
        <span className="text-sm font-extrabold text-slateText-primary tracking-tight">
          {column.label}
        </span>
        <span className="ml-auto bg-white rounded-full text-[11px] font-bold text-slateText-secondary px-2.5 py-0.5 shadow-2xs">
          {tasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 p-2 rounded-[20px] min-h-[200px] transition-colors duration-200 ${
          isOver ? 'bg-brand-50 ring-2 ring-brand-300 ring-inset' : 'bg-slate-50/60'
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isOverdue={isOverdue(task)}
              onOpen={onOpenTask}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-slateText-muted font-semibold text-center py-6">
              Drop tasks here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
