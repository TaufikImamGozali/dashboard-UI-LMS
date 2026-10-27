import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../types/task';
import { TaskColumn, COLUMNS } from './TaskColumn';
import { TaskCard } from './TaskCard';

interface TaskBoardProps {
  tasks: Task[];
  isOverdue: (task: Task) => boolean;
  onMoveTask: (id: string, newStatus: TaskStatus) => void;
  onOpenTask: (task: Task) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  activeMobileTab?: TaskStatus;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  isOverdue,
  onMoveTask,
  onOpenTask,
  onEditTask,
  onDeleteTask,
  activeMobileTab,
}) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragOver = (_event: DragOverEvent) => {
    // Visual feedback is handled by useDroppable isOver
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const overId = over.id as string;

    // Dropped onto a column header (droppable id = column.id)
    const targetColumn = COLUMNS.find((c) => c.id === overId);
    if (targetColumn && active.id !== overId) {
      onMoveTask(active.id as string, targetColumn.id);
      return;
    }

    // Dropped onto another card — find which column that card lives in
    const targetTask = tasks.find((t) => t.id === overId);
    if (targetTask && targetTask.id !== active.id) {
      onMoveTask(active.id as string, targetTask.status);
    }
  };

  // Group tasks by status
  const tasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Desktop: 3 columns side by side */}
      <div className="hidden sm:flex gap-4 overflow-x-auto pb-2 no-scrollbar">
        {COLUMNS.map((col) => (
          <TaskColumn
            key={col.id}
            column={col}
            tasks={tasksByStatus(col.id)}
            isOverdue={isOverdue}
            onOpenTask={onOpenTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      {/* Mobile: single tab view */}
      {activeMobileTab !== undefined && (
        <div className="sm:hidden">
          {COLUMNS.filter((c) => c.id === activeMobileTab).map((col) => (
            <TaskColumn
              key={col.id}
              column={col}
              tasks={tasksByStatus(col.id)}
              isOverdue={isOverdue}
              onOpenTask={onOpenTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Drag overlay ghost card */}
      <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeTask && (
          <TaskCard
            task={activeTask}
            isOverdue={isOverdue(activeTask)}
            onOpen={() => {}}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};
