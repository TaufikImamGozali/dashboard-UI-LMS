import { useCallback, useEffect, useRef, useState } from 'react';
import { mockConversations } from '../data/messages';
import type { Attachment, Conversation, Message } from '../types/message';

const STORAGE_KEY = 'coursue_conversations_v1';
const AUTO_REPLIES = [
  'Thanks for the update! I will take a look.',
  'That sounds good. Let me know if you need any help.',
  'Nice work! Keep me posted on your progress.',
  'Got it. We can discuss it in more detail later.',
];

const createId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Conversation[]) : mockConversations;
    } catch {
      return mockConversations;
    }
  });
  const [typingCounts, setTypingCounts] = useState<Record<string, number>>({});
  const replyTimersRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      // The inbox remains usable when storage is unavailable or full.
    }
  }, [conversations]);

  useEffect(
    () => () => {
      replyTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              unreadCount: 0,
              messages: conversation.messages.map((item) =>
                item.sender === 'contact' ? { ...item, status: 'read' as const } : item,
              ),
            }
          : conversation,
      ),
    );
  }, []);

  const sendMessage = useCallback((conversationId: string, text: string, attachment?: Attachment) => {
    const sentAt = new Date().toISOString();
    const outgoing: Message = {
      id: createId('message'),
      sender: 'me',
      text: text.trim() || undefined,
      sentAt,
      status: 'sent',
      attachment,
    };

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...conversation.messages, outgoing],
              updatedAt: sentAt,
            }
          : conversation,
      ),
    );
    setTypingCounts((current) => ({
      ...current,
      [conversationId]: (current[conversationId] ?? 0) + 1,
    }));

    const replyTimer = window.setTimeout(() => {
      const replyTime = new Date().toISOString();
      setConversations((current) =>
        current.map((conversation) => {
          if (conversation.id !== conversationId) return conversation;
          const reply: Message = {
            id: createId('reply'),
            sender: 'contact',
            text: AUTO_REPLIES[conversation.messages.length % AUTO_REPLIES.length],
            sentAt: replyTime,
            status: 'read',
          };
          return {
            ...conversation,
            messages: [
              ...conversation.messages.map((item) =>
                item.sender === 'me' ? { ...item, status: 'read' as const } : item,
              ),
              reply,
            ],
            updatedAt: replyTime,
          };
        }),
      );
      setTypingCounts((current) => {
        const nextCount = (current[conversationId] ?? 1) - 1;
        const next = { ...current };
        if (nextCount > 0) next[conversationId] = nextCount;
        else delete next[conversationId];
        return next;
      });
      replyTimersRef.current.delete(replyTimer);
    }, 1500);
    replyTimersRef.current.add(replyTimer);
  }, []);

  return {
    conversations,
    typingConversationIds: Object.keys(typingCounts),
    markAsRead,
    sendMessage,
  };
}
