import type { Task } from '../types/task';

// Dates relative to today for realism
const today = new Date();
const d = (offsetDays: number): string => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offsetDays);
  return dt.toISOString().split('T')[0];
};

export const mockTasks: Task[] = [
  // ── TO DO ─────────────────────────────────────────────────────────────────
  {
    id: 't1',
    title: 'Build Responsive Navigation Component',
    description:
      'Create a fully responsive navbar with mobile hamburger menu, active link highlighting, and smooth scroll behavior.',
    courseId: 'c1',
    courseLabel: 'FRONT END',
    courseCategory: 'frontend',
    deadline: d(4),
    priority: 'High',
    status: 'todo',
    mentorName: 'Leonardo Samsul',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st1a', title: 'Design mobile breakpoints', isCompleted: false },
      { id: 'st1b', title: 'Implement hamburger toggle', isCompleted: false },
      { id: 'st1c', title: 'Add active link state', isCompleted: false },
    ],
    attachments: [
      { id: 'a1a', name: 'nav-specs.pdf', size: '1.2 MB', type: 'pdf' },
    ],
    createdAt: d(-7),
  },
  {
    id: 't2',
    title: 'Create Wireframes for Onboarding Flow',
    description:
      'Design low-fidelity wireframes covering all 5 steps of the user onboarding experience. Export as Figma frames.',
    courseId: 'c2',
    courseLabel: 'UI/UX DESIGN',
    courseCategory: 'design',
    deadline: d(6),
    priority: 'Medium',
    status: 'todo',
    mentorName: 'Bayu Salto',
    mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st2a', title: 'Define user flow diagram', isCompleted: false },
      { id: 'st2b', title: 'Sketch screen layouts', isCompleted: false },
      { id: 'st2c', title: 'Peer review wireframes', isCompleted: false },
      { id: 'st2d', title: 'Export to Figma', isCompleted: false },
    ],
    attachments: [
      { id: 'a2a', name: 'onboarding-research.figma', size: '3.4 MB', type: 'figma' },
    ],
    createdAt: d(-5),
  },
  {
    id: 't3',
    title: 'Brand Color Palette Proposal',
    description:
      'Research and propose a primary + secondary color palette for the client brand refresh. Include accessibility contrast ratios.',
    courseId: 'c3',
    courseLabel: 'BRANDING',
    courseCategory: 'branding',
    deadline: d(9),
    priority: 'Low',
    status: 'todo',
    mentorName: 'Padhang Satrio',
    mentorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st3a', title: 'Competitive audit', isCompleted: false },
      { id: 'st3b', title: 'Generate palette options', isCompleted: false },
    ],
    attachments: [],
    createdAt: d(-3),
  },
  {
    id: 't4',
    title: 'TypeScript Generic Utilities Exercise',
    description:
      'Complete the coding exercise set on advanced TypeScript generics, conditional types, and mapped types.',
    courseId: 'c6',
    courseLabel: 'FRONT END',
    courseCategory: 'frontend',
    deadline: d(2),
    priority: 'High',
    status: 'todo',
    mentorName: 'Zakir Horizontal',
    mentorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st4a', title: 'Read generics chapter', isCompleted: true },
      { id: 'st4b', title: 'Solve exercises 1-5', isCompleted: false },
      { id: 'st4c', title: 'Submit via GitHub', isCompleted: false },
    ],
    attachments: [
      { id: 'a4a', name: 'ts-exercises.zip', size: '856 KB', type: 'zip' },
    ],
    createdAt: d(-4),
  },
  // ── IN PROGRESS ───────────────────────────────────────────────────────────
  {
    id: 't5',
    title: 'Design System Component Documentation',
    description:
      'Document all design tokens, component variants, and usage examples in a shared Notion page.',
    courseId: 'c4',
    courseLabel: 'UI/UX DESIGN',
    courseCategory: 'design',
    deadline: d(1),
    priority: 'High',
    status: 'in-progress',
    mentorName: 'Bayu Salto',
    mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st5a', title: 'Audit existing components', isCompleted: true },
      { id: 'st5b', title: 'Write token documentation', isCompleted: true },
      { id: 'st5c', title: 'Document button variants', isCompleted: false },
      { id: 'st5d', title: 'Document form inputs', isCompleted: false },
    ],
    attachments: [
      { id: 'a5a', name: 'design-tokens.pdf', size: '2.1 MB', type: 'pdf' },
      { id: 'a5b', name: 'component-library.figma', size: '12.8 MB', type: 'figma' },
    ],
    createdAt: d(-10),
  },
  {
    id: 't6',
    title: 'Implement CSS Grid Dashboard Layout',
    description:
      'Build the multi-column dashboard layout using CSS Grid. Match the Figma spec precisely including gap sizes and breakpoints.',
    courseId: 'c5',
    courseLabel: 'FRONT END',
    courseCategory: 'frontend',
    deadline: d(3),
    priority: 'Medium',
    status: 'in-progress',
    mentorName: 'Leonardo Samsul',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st6a', title: 'Set up grid container', isCompleted: true },
      { id: 'st6b', title: 'Define column areas', isCompleted: false },
      { id: 'st6c', title: 'Responsive adjustments', isCompleted: false },
    ],
    attachments: [
      { id: 'a6a', name: 'layout-spec.pdf', size: '945 KB', type: 'pdf' },
    ],
    createdAt: d(-8),
  },
  {
    id: 't7',
    title: 'Competitor Brand Analysis Report',
    description:
      'Analyze 5 top competitors brand identities. Summarize visual language, tone of voice, and positioning in a slide deck.',
    courseId: 'c10',
    courseLabel: 'BRANDING',
    courseCategory: 'branding',
    deadline: d(5),
    priority: 'Medium',
    status: 'in-progress',
    mentorName: 'Zakir Horizontal',
    mentorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st7a', title: 'Select 5 competitors', isCompleted: true },
      { id: 'st7b', title: 'Visual identity audit', isCompleted: true },
      { id: 'st7c', title: 'Tone of voice analysis', isCompleted: false },
      { id: 'st7d', title: 'Create slide deck', isCompleted: false },
    ],
    attachments: [
      { id: 'a7a', name: 'analysis-template.doc', size: '244 KB', type: 'doc' },
    ],
    createdAt: d(-12),
  },
  {
    id: 't8',
    title: 'Figma Auto-Layout Responsive Mockup',
    description:
      'Use Figma Auto Layout and Variables to build a fully responsive mobile-to-desktop mockup for the new settings screen.',
    courseId: 'c8',
    courseLabel: 'UI/UX DESIGN',
    courseCategory: 'design',
    deadline: d(7),
    priority: 'Low',
    status: 'in-progress',
    mentorName: 'Bayu Salto',
    mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st8a', title: 'Set up Figma variables', isCompleted: true },
      { id: 'st8b', title: 'Mobile frame layout', isCompleted: false },
      { id: 'st8c', title: 'Desktop frame layout', isCompleted: false },
    ],
    attachments: [
      { id: 'a8a', name: 'settings-mockup.figma', size: '7.2 MB', type: 'figma' },
    ],
    createdAt: d(-6),
  },
  // ── DONE (completed, some overdue by deadline) ────────────────────────────
  {
    id: 't9',
    title: 'React 18 Concurrent Mode Quiz',
    description:
      'Complete the end-of-module quiz covering useTransition, Suspense boundaries, and concurrent rendering patterns.',
    courseId: 'c9',
    courseLabel: 'FRONT END',
    courseCategory: 'frontend',
    deadline: d(-3),
    priority: 'Medium',
    status: 'done',
    mentorName: 'Leonardo Samsul',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st9a', title: 'Review lecture notes', isCompleted: true },
      { id: 'st9b', title: 'Complete quiz', isCompleted: true },
    ],
    attachments: [],
    createdAt: d(-14),
  },
  {
    id: 't10',
    title: 'Mood Board & Inspiration Collection',
    description:
      'Collect 30+ visual references for the rebrand project and organize them into a cohesive mood board in Figma.',
    courseId: 'c7',
    courseLabel: 'BRANDING',
    courseCategory: 'branding',
    deadline: d(-5),
    priority: 'Low',
    status: 'done',
    mentorName: 'Padhang Satrio',
    mentorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st10a', title: 'Collect visual references', isCompleted: true },
      { id: 'st10b', title: 'Organize in Figma', isCompleted: true },
      { id: 'st10c', title: 'Present to mentor', isCompleted: true },
    ],
    attachments: [
      { id: 'a10a', name: 'moodboard.figma', size: '5.8 MB', type: 'figma' },
    ],
    createdAt: d(-20),
  },
  {
    id: 't11',
    title: 'Heuristic Evaluation Report',
    description:
      'Apply Nielsen\'s 10 usability heuristics to evaluate the existing app and write a structured report with severity ratings.',
    courseId: 'c2',
    courseLabel: 'UI/UX DESIGN',
    courseCategory: 'design',
    deadline: d(-2),
    priority: 'High',
    status: 'done',
    mentorName: 'Bayu Salto',
    mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st11a', title: 'Review heuristics framework', isCompleted: true },
      { id: 'st11b', title: 'Evaluate app screens', isCompleted: true },
      { id: 'st11c', title: 'Write severity ratings', isCompleted: true },
      { id: 'st11d', title: 'Submit report', isCompleted: true },
    ],
    attachments: [
      { id: 'a11a', name: 'heuristic-report.pdf', size: '1.8 MB', type: 'pdf' },
    ],
    createdAt: d(-18),
  },
  {
    id: 't12',
    title: 'REST API Integration with React Query',
    description:
      'Integrate the provided backend API endpoints using React Query. Implement loading, error, and success states.',
    courseId: 'c12',
    courseLabel: 'FRONT END',
    courseCategory: 'frontend',
    deadline: d(-1),
    priority: 'High',
    status: 'done',
    mentorName: 'Zakir Horizontal',
    mentorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    subtasks: [
      { id: 'st12a', title: 'Set up React Query client', isCompleted: true },
      { id: 'st12b', title: 'Create query hooks', isCompleted: true },
      { id: 'st12c', title: 'Handle loading/error states', isCompleted: true },
    ],
    attachments: [
      { id: 'a12a', name: 'api-docs.pdf', size: '2.6 MB', type: 'pdf' },
    ],
    createdAt: d(-15),
  },
];
