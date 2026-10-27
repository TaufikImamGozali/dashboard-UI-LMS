import type { TaskStatus } from '../../types/task';

export interface ColumnConfig {
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
