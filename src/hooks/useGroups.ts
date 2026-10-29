import { useCallback, useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import { mockGroups } from '../data/groups';
import type { Comment, Group, Member, NewGroupForm, Post } from '../types/group';

const STORAGE_KEY = 'coursue_groups_v1';

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const currentMember = (role: Member['role'] = 'Member'): Member => {
  const localProfile = profileService.getLocalProfile();
  return {
    id: 'current-user',
    name: localProfile.name || 'Student User',
    avatar: localProfile.avatar,
    role,
    contributions: 0,
  };
};

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Group[]) : mockGroups;
    } catch {
      return mockGroups;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch {
      // Keep the feature usable if browser storage is unavailable.
    }
  }, [groups]);

  const joinGroup = useCallback((groupId: string) => {
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId && !group.isJoined
          ? {
              ...group,
              isJoined: true,
              totalMembers: group.totalMembers + 1,
              members: [...group.members, currentMember()],
            }
          : group,
      ),
    );
  }, []);

  const leaveGroup = useCallback((groupId: string) => {
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              isJoined: false,
              totalMembers: Math.max(0, group.totalMembers - 1),
              members: group.members.filter((member) => member.id !== 'current-user'),
            }
          : group,
      ),
    );
  }, []);

  const createGroup = useCallback((form: NewGroupForm) => {
    const id = createId('group');
    const admin = currentMember('Admin');
    const created: Group = {
      id,
      name: form.name.trim(),
      description: form.description.trim() || 'A new learning community ready for its first discussion.',
      about: form.description.trim() || 'This group was created to learn, share resources, and grow together.',
      category: form.category,
      categoryLabel:
        form.category === 'design' ? 'UI/UX DESIGN' : form.category === 'branding' ? 'BRANDING' : 'FRONT END',
      privacy: form.privacy,
      coverClass:
        form.category === 'design'
          ? 'from-brand-500 via-violet-500 to-fuchsia-500'
          : form.category === 'branding'
            ? 'from-rose-400 via-pink-500 to-orange-400'
            : 'from-sky-500 via-cyan-500 to-emerald-400',
      icon: form.category === 'design' ? '✦' : form.category === 'branding' ? 'Aa' : '</>',
      isJoined: true,
      totalMembers: 1,
      newPosts: 0,
      createdAt: new Date().toISOString(),
      rules: ['Be respectful and constructive.', 'Keep discussions relevant.', 'Share resources responsibly.'],
      members: [admin],
      posts: [],
      resources: [],
      upcomingSession: {
        id: createId('session'),
        title: 'First community meetup',
        startsAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
        mentor: admin,
        reminderSet: false,
      },
    };
    setGroups((current) => [created, ...current]);
    return created;
  }, []);

  const addPost = useCallback((groupId: string, content: string) => {
    const post: Post = {
      id: createId('post'),
      author: currentMember(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      comments: [],
    };
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? { ...group, posts: [post, ...group.posts], newPosts: group.newPosts + 1 }
          : group,
      ),
    );
  }, []);

  const toggleLike = useCallback((groupId: string, postId: string) => {
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              posts: group.posts.map((post) =>
                post.id === postId
                  ? { ...post, isLiked: !post.isLiked, likes: Math.max(0, post.likes + (post.isLiked ? -1 : 1)) }
                  : post,
              ),
            }
          : group,
      ),
    );
  }, []);

  const addComment = useCallback((groupId: string, postId: string, content: string) => {
    const comment: Comment = {
      id: createId('comment'),
      author: currentMember(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              posts: group.posts.map((post) =>
                post.id === postId ? { ...post, comments: [...post.comments, comment] } : post,
              ),
            }
          : group,
      ),
    );
  }, []);

  const setReminder = useCallback((groupId: string) => {
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              upcomingSession: {
                ...group.upcomingSession,
                reminderSet: !group.upcomingSession.reminderSet,
              },
            }
          : group,
      ),
    );
  }, []);

  return {
    groups,
    joinGroup,
    leaveGroup,
    createGroup,
    addPost,
    toggleLike,
    addComment,
    setReminder,
  };
}
