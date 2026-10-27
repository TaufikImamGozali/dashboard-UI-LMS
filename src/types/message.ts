export type ContactRole = 'Mentor' | 'Friend';
export type MessageSender = 'me' | 'contact';
export type MessageStatus = 'sent' | 'read';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface SharedLink {
  id: string;
  title: string;
  url: string;
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  role: ContactRole;
  isOnline: boolean;
  lastSeen?: string;
  sharedFiles: Attachment[];
  sharedLinks: SharedLink[];
}

export interface Message {
  id: string;
  sender: MessageSender;
  text?: string;
  sentAt: string;
  status: MessageStatus;
  attachment?: Attachment;
}

export interface Conversation {
  id: string;
  contact: Contact;
  messages: Message[];
  unreadCount: number;
  updatedAt: string;
}

export type ConversationFilter = 'all' | 'unread' | 'mentors' | 'friends';
