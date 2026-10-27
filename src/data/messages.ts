import type { Attachment, Contact, Conversation, Message } from '../types/message';

const MINUTE = 60_000;
const DAY = 86_400_000;
const now = Date.now();

const at = (daysAgo: number, minutesAgo: number) =>
  new Date(now - daysAgo * DAY - minutesAgo * MINUTE).toISOString();

const avatars = [
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80',
];

const file = (id: string, name: string, size: number, type = 'application/pdf'): Attachment => ({
  id,
  name,
  size,
  type,
});

const contact = (
  id: string,
  name: string,
  avatar: string,
  role: Contact['role'],
  isOnline: boolean,
  sharedFiles: Attachment[],
  sharedLinks: Contact['sharedLinks'],
): Contact => ({
  id,
  name,
  avatar,
  role,
  isOnline,
  lastSeen: isOnline ? undefined : 'Last seen 2h ago',
  sharedFiles,
  sharedLinks,
});

const message = (
  id: string,
  sender: Message['sender'],
  text: string,
  daysAgo: number,
  minutesAgo: number,
  status: Message['status'] = 'read',
  attachment?: Attachment,
): Message => ({ id, sender, text, sentAt: at(daysAgo, minutesAgo), status, attachment });

const portfolioFile = file('file-portfolio', 'Portfolio-review.pdf', 2_480_000);
const briefFile = file('file-brief', 'Course-brief.pdf', 840_000);
const wireframeFile = file('file-wireframe', 'Dashboard-wireframe.fig', 4_320_000, 'application/octet-stream');
const notesFile = file('file-notes', 'Study-notes.docx', 1_260_000, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

export const mockConversations: Conversation[] = [
  {
    id: 'conversation-1',
    contact: contact('contact-1', 'Leonardo Samsul', avatars[0], 'Mentor', true, [portfolioFile, briefFile], [
      { id: 'link-1', title: 'Frontend accessibility checklist', url: 'https://www.w3.org/WAI/' },
      { id: 'link-2', title: 'React documentation', url: 'https://react.dev/' },
    ]),
    unreadCount: 2,
    updatedAt: at(0, 8),
    messages: [
      message('m1-1', 'contact', 'Hi Jason, how is the dashboard assignment going?', 1, 190),
      message('m1-2', 'me', 'It is going well. I finished the responsive navigation.', 1, 175),
      message('m1-3', 'contact', 'Great progress. Remember to check keyboard navigation too.', 1, 160),
      message('m1-4', 'me', 'Good point. I will include it in the final pass.', 0, 45),
      message('m1-5', 'contact', 'I left a few notes on your portfolio review.', 0, 12),
      message('m1-6', 'contact', 'Send me the updated version whenever you are ready.', 0, 8),
    ],
  },
  {
    id: 'conversation-2',
    contact: contact('contact-2', 'Nadia Putri', avatars[1], 'Friend', true, [notesFile], [
      { id: 'link-3', title: 'Our study playlist', url: 'https://www.youtube.com/' },
    ]),
    unreadCount: 1,
    updatedAt: at(0, 27),
    messages: [
      message('m2-1', 'me', 'Are we still studying together this evening?', 1, 260),
      message('m2-2', 'contact', 'Yes! I just need to finish the typography lesson first.', 1, 240),
      message('m2-3', 'me', 'No rush. I will prepare the notes.', 1, 220),
      message('m2-4', 'contact', 'The notes from last week were really helpful.', 0, 55),
      message('m2-5', 'contact', 'Can we start at 7 PM?', 0, 27),
    ],
  },
  {
    id: 'conversation-3',
    contact: contact('contact-3', 'Bayu Salto', avatars[2], 'Mentor', false, [wireframeFile], [
      { id: 'link-4', title: 'Figma community resources', url: 'https://www.figma.com/community' },
    ]),
    unreadCount: 0,
    updatedAt: at(0, 95),
    messages: [
      message('m3-1', 'contact', 'Your wireframe has a clear visual hierarchy.', 2, 300),
      message('m3-2', 'me', 'Thank you! I was unsure about the right panel.', 2, 280),
      message('m3-3', 'contact', 'Try reducing the number of competing actions there.', 2, 265),
      message('m3-4', 'me', 'That makes sense. I have simplified it.', 0, 120),
      message('m3-5', 'contact', 'Nice, the latest version feels much calmer.', 0, 95),
    ],
  },
  {
    id: 'conversation-4',
    contact: contact('contact-4', 'Alya Rahman', avatars[3], 'Friend', false, [], [
      { id: 'link-5', title: 'Design inspiration board', url: 'https://dribbble.com/' },
    ]),
    unreadCount: 0,
    updatedAt: at(1, 80),
    messages: [
      message('m4-1', 'contact', 'Have you seen the new branding module?', 3, 410),
      message('m4-2', 'me', 'Not yet. Is it good?', 3, 390),
      message('m4-3', 'contact', 'The case studies are excellent.', 3, 370),
      message('m4-4', 'me', 'I will add it to my weekend plan.', 1, 95),
      message('m4-5', 'contact', 'Let me know what you think!', 1, 80),
    ],
  },
  {
    id: 'conversation-5',
    contact: contact('contact-5', 'Dimas Arif', avatars[4], 'Friend', true, [briefFile], []),
    unreadCount: 3,
    updatedAt: at(2, 40),
    messages: [
      message('m5-1', 'me', 'Did the group submit the brief?', 4, 500),
      message('m5-2', 'contact', 'Almost. We are waiting for the final illustration.', 4, 470),
      message('m5-3', 'me', 'I can help review it after class.', 3, 320),
      message('m5-4', 'contact', 'That would be amazing.', 2, 75),
      message('m5-5', 'contact', 'I uploaded the latest brief.', 2, 55),
      message('m5-6', 'contact', 'Please check section four when you have time.', 2, 40),
    ],
  },
  {
    id: 'conversation-6',
    contact: contact('contact-6', 'Sarah Wijaya', avatars[5], 'Mentor', false, [notesFile], [
      { id: 'link-6', title: 'Color contrast guide', url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html' },
    ]),
    unreadCount: 0,
    updatedAt: at(3, 130),
    messages: [
      message('m6-1', 'contact', 'Your research summary is very thorough.', 5, 420),
      message('m6-2', 'me', 'I tried to connect each insight to a design decision.', 5, 400),
      message('m6-3', 'contact', 'That is exactly the right approach.', 5, 380),
      message('m6-4', 'me', 'Should I include the raw interview notes?', 3, 150),
      message('m6-5', 'contact', 'Keep them in the appendix and link to the key findings.', 3, 130),
    ],
  },
  {
    id: 'conversation-7',
    contact: contact('contact-7', 'Raka Pratama', avatars[6], 'Friend', true, [], [
      { id: 'link-7', title: 'CSS animation examples', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations' },
    ]),
    unreadCount: 0,
    updatedAt: at(4, 210),
    messages: [
      message('m7-1', 'contact', 'That hover animation looks smooth!', 6, 540),
      message('m7-2', 'me', 'Thanks. I reduced the duration to 200ms.', 6, 520),
      message('m7-3', 'contact', 'It feels much more responsive now.', 6, 500),
      message('m7-4', 'me', 'Want me to share the utility classes?', 4, 230),
      message('m7-5', 'contact', 'Yes please, that would save me some time.', 4, 210),
    ],
  },
  {
    id: 'conversation-8',
    contact: contact('contact-8', 'Maya Lestari', avatars[7], 'Mentor', false, [portfolioFile], [
      { id: 'link-8', title: 'Portfolio presentation tips', url: 'https://www.behance.net/' },
    ]),
    unreadCount: 0,
    updatedAt: at(7, 180),
    messages: [
      message('m8-1', 'me', 'Could you review my case study introduction?', 9, 600),
      message('m8-2', 'contact', 'Of course. Send the latest draft.', 9, 580),
      message('m8-3', 'me', 'I have attached it to the project workspace.', 8, 440),
      message('m8-4', 'contact', 'The story is strong, but shorten the opening paragraph.', 7, 205),
      message('m8-5', 'me', 'Understood. I will make the outcome visible sooner.', 7, 180),
    ],
  },
];
