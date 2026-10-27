import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { Conversation, ConversationFilter } from '../../types/message';
import { ConversationItem } from './ConversationItem';
import { EmptyState } from '../ui/EmptyState';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  referenceTime: string;
  onSelect: (conversationId: string) => void;
  className?: string;
}

const FILTERS: { value: ConversationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'mentors', label: 'Mentors' },
  { value: 'friends', label: 'Friends' },
];

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  referenceTime,
  onSelect,
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<ConversationFilter>('all');
  const unreadTotal = conversations.reduce((total, item) => total + item.unreadCount, 0);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return [...conversations]
      .filter((conversation) => {
        const matchesQuery =
          !normalizedQuery ||
          conversation.contact.name.toLowerCase().includes(normalizedQuery) ||
          conversation.messages.at(-1)?.text?.toLowerCase().includes(normalizedQuery);
        const matchesFilter =
          filter === 'all' ||
          (filter === 'unread' && conversation.unreadCount > 0) ||
          (filter === 'mentors' && conversation.contact.role === 'Mentor') ||
          (filter === 'friends' && conversation.contact.role === 'Friend');
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [conversations, filter, query]);

  return (
    <section className={`flex min-h-0 w-full flex-col bg-surface md:w-80 md:shrink-0 ${className}`}>
      <div className="border-b border-slate-100 p-5 pb-4">
        <div className="mb-4 flex items-center gap-2">
          <h1 className="text-xl font-extrabold tracking-tight text-slateText-primary">Messages</h1>
          {unreadTotal > 0 && (
            <span className="rounded-full bg-brand-100 px-2.5 py-1 text-meta font-bold text-brand-600">
              {unreadTotal}
            </span>
          )}
        </div>

        <label className="relative block">
          <span className="sr-only">Search conversations</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slateText-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="w-full rounded-full border border-transparent bg-brand-surface py-2.5 pl-10 pr-4 text-sm text-slateText-primary outline-none placeholder:text-slateText-muted focus:border-brand-300 focus:bg-surface focus:ring-4 focus:ring-brand-100"
          />
        </label>

        <div className="mt-4 flex gap-1 overflow-x-auto no-scrollbar" role="tablist" aria-label="Conversation filters">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              role="tab"
              aria-selected={filter === item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-3 py-1.5 text-meta font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                filter === item.value
                  ? 'bg-brand-500 text-white'
                  : 'bg-brand-surface text-slateText-secondary hover:bg-brand-50 hover:text-brand-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-2.5" role="list">
        {filteredConversations.map((conversation) => (
          <div role="listitem" key={conversation.id}>
            <ConversationItem
              conversation={conversation}
              isActive={selectedConversationId === conversation.id}
              referenceTime={referenceTime}
              onSelect={onSelect}
            />
          </div>
        ))}
        {filteredConversations.length === 0 && (
          <EmptyState
            title="No conversations found"
            description="Try another search or filter."
            actionLabel="Clear filters"
            onAction={() => { setQuery(''); setFilter('all'); }}
            icon={<Search className="h-6 w-6" />}
            className="h-52 border-0 py-6 shadow-none"
          />
        )}
      </div>
    </section>
  );
};
