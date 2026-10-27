import type { Friend, ProgressSummary, Course, Lesson, Mentor, StatisticDataPoint } from '../types';

export const currentUser = {
  name: 'Jason Ranti',
  role: 'Student',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  completionPercentage: 32,
};

export const mockFriends: Friend[] = [
  {
    id: 'f1',
    name: 'Bagas Mahpie',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    status: 'Friend',
    isOnline: true,
  },
  {
    id: 'f2',
    name: 'Sir Dandy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'Old Friend',
    isOnline: false,
  },
  {
    id: 'f3',
    name: 'Jhon Tosan',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    status: 'Friend',
    isOnline: true,
  },
];

export const mockProgressSummaries: ProgressSummary[] = [
  {
    id: 'p1',
    category: 'design',
    title: 'UI/UX Design',
    watched: 2,
    total: 8,
    icon: 'scissors',
  },
  {
    id: 'p2',
    category: 'branding',
    title: 'Branding',
    watched: 3,
    total: 6,
    icon: 'paint',
  },
  {
    id: 'p3',
    category: 'frontend',
    title: 'Front End',
    watched: 6,
    total: 12,
    icon: 'code',
  },
];

export const mockCourses: Course[] = [
  {
    id: 'c1',
    title: "Beginner's Guide to Becoming a Professional Front-End Developer",
    category: 'frontend',
    categoryLabel: 'FRONT END',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80',
    progress: 58,
    mentor: {
      name: 'Leonardo samsul',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'Mentor',
    },
    isFavorite: false,
  },
  {
    id: 'c2',
    title: 'Optimizing User Experience with the Best UI/UX Design',
    category: 'design',
    categoryLabel: 'UI/UX DESIGN',
    thumbnail: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    progress: 72,
    mentor: {
      name: 'Bayu Salto',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      role: 'Mentor',
    },
    isFavorite: true,
  },
  {
    id: 'c3',
    title: 'Reviving and Refresh Company Image',
    category: 'branding',
    categoryLabel: 'BRANDING',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=600&q=80',
    progress: 45,
    mentor: {
      name: 'Padhang Satrio',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
      role: 'Mentor',
    },
    isFavorite: false,
  },
  {
    id: 'c4',
    title: 'Design System Architecture & Component Libraries',
    category: 'design',
    categoryLabel: 'UI/UX DESIGN',
    thumbnail: 'https://images.unsplash.com/photo-1581291518655-9523c932694b?auto=format&fit=crop&w=600&q=80',
    progress: 84,
    mentor: {
      name: 'Bayu Salto',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      role: 'Mentor',
    },
    isFavorite: false,
  },
  {
    id: 'c5',
    title: 'Modern CSS Frameworks, Tailwind & Animations',
    category: 'frontend',
    categoryLabel: 'FRONT END',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
    progress: 30,
    mentor: {
      name: 'Leonardo samsul',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      role: 'Mentor',
    },
    isFavorite: false,
  },
];

export const mockLessons: Lesson[] = [
  {
    id: 'l1',
    mentorName: 'Padhang Satrio',
    mentorAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    date: '2/16/2004',
    type: 'design',
    typeLabel: 'UI/UX DESIGN',
    description: 'Understand Of UI/UX Design',
  },
  {
    id: 'l2',
    mentorName: 'Leonardo Samsul',
    mentorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    date: '2/18/2004',
    type: 'frontend',
    typeLabel: 'FRONT END',
    description: 'Advanced React 18 Patterns & Hooks',
  },
  {
    id: 'l3',
    mentorName: 'Bayu Salto',
    mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    date: '2/20/2004',
    type: 'design',
    typeLabel: 'UI/UX DESIGN',
    description: 'Wireframing & High-Fidelity Prototyping',
  },
  {
    id: 'l4',
    mentorName: 'Zakir Horizontal',
    mentorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    date: '2/22/2004',
    type: 'branding',
    typeLabel: 'BRANDING',
    description: 'Brand Guidelines & Vector Identity Systems',
  },
];

export const mockMentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Padhang Satrio',
    role: 'Mentor',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=150&q=80',
    isOnline: true,
    isFollowing: false,
  },
  {
    id: 'm2',
    name: 'Zakir Horizontal',
    role: 'Mentor',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
    isOnline: true,
    isFollowing: false,
  },
  {
    id: 'm3',
    name: 'Leonardo Samsul',
    role: 'Mentor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    isOnline: true,
    isFollowing: false,
  },
];

export const mockStatistics: StatisticDataPoint[] = [
  { range: '1-10 Aug', hours: 26, highlighted: false },
  { range: '11-20 Aug', hours: 44, highlighted: false },
  { range: '21-30 Aug', hours: 58, highlighted: true },
];
