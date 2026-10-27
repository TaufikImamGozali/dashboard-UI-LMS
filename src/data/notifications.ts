import type { AppNotification, NotificationType } from '../types/notification';

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

const item = (id: string, type: NotificationType, title: string, description: string, minutes: number, href: string, isRead = false): AppNotification => ({
  id, type, title, description, createdAt: ago(minutes), href, isRead,
});

export const createMockNotifications = (): AppNotification[] => [
  item('n1', 'message', 'New message from Nadia', 'Can we review the wireframe together?', 5, '/inbox'),
  item('n2', 'task', 'Task deadline tomorrow', 'Finish the mobile navigation prototype.', 32, '/task'),
  item('n3', 'course', 'New lesson available', 'Responsive Layout Systems is ready to watch.', 80, '/course/c1'),
  item('n4', 'group', 'New group discussion', 'Alya posted in UI/UX Design Circle.', 150, '/group/g1'),
  item('n5', 'message', 'Message from Sir Dandy', 'Great progress on your latest assignment.', 260, '/inbox', true),
  item('n6', 'task', 'Task marked complete', 'Your mentor approved Brand Moodboard.', 520, '/task', true),
  item('n7', 'course', 'Course progress updated', 'You reached 60% in Front End Fundamentals.', 900, '/course/c1'),
  item('n8', 'group', 'Upcoming study session', 'Brand Builders meets tomorrow at 7 PM.', 1_420, '/group/g3'),
  item('n9', 'course', 'Weekly learning summary', 'You completed four lessons this week.', 2_880, '/'),
  item('n10', 'group', 'You were mentioned', 'Leonardo mentioned you in a comment.', 4_320, '/group/g2', true),
];
