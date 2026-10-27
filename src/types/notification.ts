export type NotificationType = 'course' | 'task' | 'message' | 'group';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string;
  href: string;
  isRead: boolean;
  isDeleted?: boolean;
}
