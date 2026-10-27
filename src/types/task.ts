export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskViewMode = 'board' | 'list';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'figma' | 'zip' | 'image' | 'doc';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseLabel: string;
  courseCategory: 'frontend' | 'design' | 'branding';
  deadline: string; // ISO date string YYYY-MM-DD
  priority: Priority;
  status: TaskStatus;
  mentorName: string;
  mentorAvatar: string;
  subtasks: Subtask[];
  attachments: TaskAttachment[];
  createdAt: string;
}

export interface NewTaskForm {
  title: string;
  description: string;
  courseId: string;
  deadline: string;
  priority: Priority;
  status: TaskStatus;
}
