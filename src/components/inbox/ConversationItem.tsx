import React from 'react';
import { FileText } from 'lucide-react';
import type { Conversation } from '../../types/message';

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  referenceTime: string;
  onSelect: (conversationId: string) => void;
}

const formatListTime = (timestamp: string, referenceTime: string) => {
  const date = new Date(timestamp);
  const reference = new Date(referenceTime);
  if (date.toDateString() === reference.toDateString()) {
    return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(date);
  }
  const yesterday = new Date(reference);
  yesterday.setDate(reference.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(date);
};

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive,
  referenceTime,
  onSelect,
}) => {
  const latestMessage = conversation.messages.at(-1);
  const preview = latestMessage?.attachment
    ? latestMessage.attachment.name
    : latestMessage?.text || 'Start a conversation';

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation.id)}
      aria-current={isActive ? 'true' : undefined}
      className={`w-full rounded-2xl p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
        isActive ? 'bg-brand-50' : 'hover:bg-brand-surface'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <img
            src={conversation.contact.avatar}
            alt={conversation.contact.name}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-white shadow-xs"
          />
          {conversation.contact.isOnline && (
            <span
              className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white"
              aria-label="Online"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-sm font-bold text-slateText-primary">
              {conversation.contact.name}
            </p>
            <time className="shrink-0 text-[10px] font-medium text-slateText-muted">
              {formatListTime(conversation.updatedAt, referenceTime)}
            </time>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <p
              className={`flex min-w-0 flex-1 items-center gap-1 truncate text-xs ${
                conversation.unreadCount > 0
                  ? 'font-semibold text-slateText-secondary'
                  : 'text-slateText-muted'
              }`}
            >
              {latestMessage?.attachment && <FileText className="h-3 w-3 shrink-0" />}
              <span className="truncate">{preview}</span>
            </p>
            {conversation.unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1.5 text-[10px] font-bold text-white">
                {conversation.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
