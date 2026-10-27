import type { CategoryType } from './index';

export type GroupPrivacy = 'Public' | 'Private';
export type MemberRole = 'Admin' | 'Mentor' | 'Member';
export type ResourceType = 'file' | 'link';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  role: MemberRole;
  contributions: number;
}

export interface Comment {
  id: string;
  author: Member;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: Member;
  content: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

export interface Resource {
  id: string;
  type: ResourceType;
  name: string;
  url: string;
  size?: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Session {
  id: string;
  title: string;
  startsAt: string;
  mentor: Member;
  reminderSet: boolean;
}

export interface Group {
  id: string;
  name: string;
  category: CategoryType;
  categoryLabel: string;
  description: string;
  about: string;
  privacy: GroupPrivacy;
  coverClass: string;
  icon: string;
  isJoined: boolean;
  totalMembers: number;
  newPosts: number;
  createdAt: string;
  rules: string[];
  members: Member[];
  posts: Post[];
  resources: Resource[];
  upcomingSession: Session;
}

export interface NewGroupForm {
  name: string;
  description: string;
  category: CategoryType;
  privacy: GroupPrivacy;
}

export type GroupListTab = 'my-groups' | 'discover';
export type GroupSort = 'active' | 'newest' | 'members';
export type GroupDetailTab = 'discussion' | 'members' | 'resources';
