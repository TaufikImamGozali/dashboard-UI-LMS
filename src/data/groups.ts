import { currentUser } from './mockData';
import type { CategoryType } from '../types';
import type { Group, Member } from '../types/group';

const DAY = 86_400_000;
const HOUR = 3_600_000;
const now = Date.now();
const ago = (days: number, hours = 0) => new Date(now - days * DAY - hours * HOUR).toISOString();
const ahead = (days: number, hours = 0) => new Date(now + days * DAY + hours * HOUR).toISOString();

const avatarUrls = [
  currentUser.avatar,
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=80',
];

const names = ['Jason Ranti', 'Nadia Putri', 'Leonardo Samsul', 'Alya Rahman', 'Dimas Arif'];

const buildMembers = (seed: number): Member[] =>
  names.map((name, index) => ({
    id: `member-${seed}-${index}`,
    name,
    avatar: avatarUrls[(seed + index) % avatarUrls.length],
    role: index === 0 ? 'Admin' : index === 2 ? 'Mentor' : 'Member',
    contributions: 34 - index * 5 + seed,
  }));

interface GroupSeed {
  id: string;
  name: string;
  category: CategoryType;
  categoryLabel: string;
  description: string;
  about: string;
  coverClass: string;
  icon: string;
  isJoined: boolean;
  totalMembers: number;
  newPosts: number;
  createdDaysAgo: number;
  sessionTitle: string;
}

const buildGroup = (seed: GroupSeed, index: number): Group => {
  const members = buildMembers(index);
  return {
    ...seed,
    privacy: index % 4 === 0 ? 'Private' : 'Public',
    createdAt: ago(seed.createdDaysAgo),
    rules: [
      'Be respectful and keep feedback constructive.',
      'Keep discussions relevant to the group topic.',
      'Credit creators when sharing external resources.',
    ],
    members,
    posts: [
      {
        id: `post-${seed.id}-1`,
        author: members[1],
        content: `I collected a few practical references for ${seed.name}. Which topic should we review in our next session?`,
        createdAt: ago(index % 3, 2 + index),
        likes: 8 + index,
        isLiked: index % 3 === 0,
        comments: [
          {
            id: `comment-${seed.id}-1`,
            author: members[3],
            content: 'I would love to review the real-world examples together.',
            createdAt: ago(index % 3, 1 + index),
          },
        ],
      },
      {
        id: `post-${seed.id}-2`,
        author: members[2],
        content: 'Quick reminder: bring one work-in-progress example so everyone can exchange focused feedback.',
        createdAt: ago(2 + (index % 4), 3),
        likes: 4 + index,
        isLiked: false,
        comments: [
          {
            id: `comment-${seed.id}-2`,
            author: members[4],
            content: 'Great idea. I will bring my latest draft.',
            createdAt: ago(1 + (index % 4), 2),
          },
        ],
      },
    ],
    resources: [
      {
        id: `resource-${seed.id}-1`,
        type: 'file',
        name: `${seed.name.replaceAll(' ', '-')}-starter.pdf`,
        url: '#',
        size: 1_240_000 + index * 180_000,
        uploadedBy: members[2].name,
        uploadedAt: ago(3 + index),
      },
      {
        id: `resource-${seed.id}-2`,
        type: 'link',
        name: 'Curated learning references',
        url: 'https://developer.mozilla.org/',
        uploadedBy: members[1].name,
        uploadedAt: ago(2 + index),
      },
    ],
    upcomingSession: {
      id: `session-${seed.id}`,
      title: seed.sessionTitle,
      startsAt: ahead(2 + index, index % 5),
      mentor: members[2],
      reminderSet: false,
    },
  };
};

const seeds: GroupSeed[] = [
  {
    id: 'ui-review-circle', name: 'UI Review Circle', category: 'design', categoryLabel: 'UI/UX DESIGN',
    description: 'Weekly interface critiques, practical exercises, and thoughtful peer feedback.',
    about: 'A supportive space for designers who want to sharpen visual hierarchy, interaction patterns, and presentation skills through regular critique.',
    coverClass: 'from-brand-500 via-violet-500 to-fuchsia-500', icon: '✦', isJoined: true, totalMembers: 184, newPosts: 12, createdDaysAgo: 210,
    sessionTitle: 'Dashboard critique workshop',
  },
  {
    id: 'frontend-lab', name: 'Front End Lab', category: 'frontend', categoryLabel: 'FRONT END',
    description: 'Build accessible interfaces and solve modern React challenges together.',
    about: 'A hands-on community focused on React, TypeScript, accessibility, performance, and the craft of maintainable front-end systems.',
    coverClass: 'from-sky-500 via-cyan-500 to-emerald-400', icon: '</>', isJoined: true, totalMembers: 326, newPosts: 18, createdDaysAgo: 330,
    sessionTitle: 'Accessible React patterns',
  },
  {
    id: 'brand-storytellers', name: 'Brand Storytellers', category: 'branding', categoryLabel: 'BRANDING',
    description: 'Explore identity systems, strategy, voice, and memorable brand narratives.',
    about: 'For creatives who want to connect brand strategy with compelling visual and verbal storytelling across every touchpoint.',
    coverClass: 'from-rose-400 via-pink-500 to-orange-400', icon: 'Aa', isJoined: false, totalMembers: 142, newPosts: 9, createdDaysAgo: 120,
    sessionTitle: 'Finding a distinctive brand voice',
  },
  {
    id: 'figma-mastery', name: 'Figma Mastery', category: 'design', categoryLabel: 'UI/UX DESIGN',
    description: 'Components, variables, prototyping, and scalable design system practice.',
    about: 'Learn advanced Figma workflows with other designers by rebuilding products and documenting reusable design systems.',
    coverClass: 'from-violet-500 via-purple-500 to-indigo-500', icon: 'F', isJoined: false, totalMembers: 271, newPosts: 15, createdDaysAgo: 95,
    sessionTitle: 'Variables and component properties',
  },
  {
    id: 'typescript-club', name: 'TypeScript Club', category: 'frontend', categoryLabel: 'FRONT END',
    description: 'Friendly discussions about types, architecture, tooling, and clean code.',
    about: 'A study group for developers moving from JavaScript to robust TypeScript applications through small, focused coding sessions.',
    coverClass: 'from-blue-600 via-sky-500 to-cyan-400', icon: 'TS', isJoined: true, totalMembers: 213, newPosts: 7, createdDaysAgo: 260,
    sessionTitle: 'Practical generics clinic',
  },
  {
    id: 'logo-craft', name: 'Logo Craft Studio', category: 'branding', categoryLabel: 'BRANDING',
    description: 'Practice concept development, logo construction, and identity presentation.',
    about: 'An active workshop for improving logo concepts from first sketch through polished identity guidelines and client presentation.',
    coverClass: 'from-amber-400 via-orange-500 to-rose-500', icon: '◇', isJoined: false, totalMembers: 118, newPosts: 5, createdDaysAgo: 65,
    sessionTitle: 'From sketch to scalable mark',
  },
  {
    id: 'ux-research-room', name: 'UX Research Room', category: 'design', categoryLabel: 'UI/UX DESIGN',
    description: 'Plan interviews, synthesize findings, and turn insight into product decisions.',
    about: 'A practical research community for sharing study plans, interview techniques, synthesis frameworks, and research readouts.',
    coverClass: 'from-indigo-500 via-brand-500 to-pink-400', icon: '◎', isJoined: false, totalMembers: 196, newPosts: 11, createdDaysAgo: 140,
    sessionTitle: 'Interview synthesis practice',
  },
  {
    id: 'web-animation', name: 'Web Animation Guild', category: 'frontend', categoryLabel: 'FRONT END',
    description: 'Create meaningful motion with CSS, SVG, and performant browser APIs.',
    about: 'A creative coding space for learning how motion can clarify state, guide attention, and add character without hurting performance.',
    coverClass: 'from-emerald-400 via-teal-500 to-sky-500', icon: '↝', isJoined: false, totalMembers: 154, newPosts: 14, createdDaysAgo: 48,
    sessionTitle: 'Motion principles for interfaces',
  },
  {
    id: 'portfolio-sprint', name: 'Portfolio Sprint', category: 'branding', categoryLabel: 'BRANDING',
    description: 'Turn project work into clear case studies with a strong personal voice.',
    about: 'A focused accountability group for drafting, reviewing, and shipping a portfolio that communicates both process and outcomes.',
    coverClass: 'from-fuchsia-500 via-rose-500 to-amber-400', icon: 'P', isJoined: true, totalMembers: 89, newPosts: 20, createdDaysAgo: 34,
    sessionTitle: 'Case study storytelling review',
  },
];

export const mockGroups: Group[] = seeds.map(buildGroup);
