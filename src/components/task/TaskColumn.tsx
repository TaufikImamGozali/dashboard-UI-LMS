import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task } from '../../types/task';
import { TaskCard } from './TaskCard';
import type { ColumnConfig } from './taskColumns';

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
    <div className="flex flex-col min-w-64 sm:min-w-0 flex-1">
      {/* Column Header */}
      <div className={`flex items-center gap-2.5 px-4 py-3 rounded-card mb-3 ${column.headerBg}`}>
        <div className={`w-2.5 h-2.5 rounded-full ${column.accentColor}`} />
        <span className="text-sm font-extrabold text-slateText-primary tracking-tight">
          {column.label}
        </span>
        <span className="ml-auto bg-surface rounded-full text-meta font-bold text-slateText-secondary px-2.5 py-0.5 shadow-2xs">
          {tasks.length}
        </span>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className={`flex-1 flex flex-col gap-3 p-2 rounded-card min-h-dropzone transition-colors duration-200 ${
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
