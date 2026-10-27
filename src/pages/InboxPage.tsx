import React, { useEffect, useRef, useState } from 'react';
import { MessageCircleMore } from 'lucide-react';
import { ConversationList } from '../components/inbox/ConversationList';
import { ChatHeader } from '../components/inbox/ChatHeader';
import { ContactInfoPanel } from '../components/inbox/ContactInfoPanel';
import { DateDivider } from '../components/inbox/DateDivider';
import { MessageBubble } from '../components/inbox/MessageBubble';
import { MessageInput } from '../components/inbox/MessageInput';
import { TypingIndicator } from '../components/inbox/TypingIndicator';
import { useChat } from '../hooks/useChat';
import type { Attachment } from '../types/message';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { EmptyState } from '../components/ui/EmptyState';

const dateKey = (timestamp: string) => new Date(timestamp).toDateString();

const formatDateLabel = (timestamp: string, referenceTime: string) => {
  const date = new Date(timestamp);
  const reference = new Date(referenceTime);
  if (date.toDateString() === reference.toDateString()) return 'Today';

  const yesterday = new Date(reference);
  yesterday.setDate(reference.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const InboxPage: React.FC = () => {
  const { conversations, typingConversationIds, markAsRead, sendMessage } = useChat();
  const [referenceTime] = useState(() => new Date().toISOString());
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(() =>
    window.matchMedia('(min-width: 768px)').matches ? conversations[0]?.id ?? null : null,
  );
  const [desktopInfoOpen, setDesktopInfoOpen] = useState(true);
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    window.matchMedia('(min-width: 1280px)').matches,
  );
  const messageEndRef = useRef<HTMLDivElement>(null);
  const closeInfoDrawer = () => setInfoDrawerOpen(false);
  const infoDrawerRef = useFocusTrap<HTMLDivElement>(infoDrawerOpen, closeInfoDrawer);

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ?? null;
  const isTyping = selectedConversationId
    ? typingConversationIds.includes(selectedConversationId)
    : false;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1280px)');
    const handleChange = (event: MediaQueryListEvent) => setIsDesktopViewport(event.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [selectedConversation?.messages.length, isTyping]);

  const handleSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    markAsRead(conversationId);
  };

  const handleSend = (text: string, attachment?: Attachment) => {
    if (!selectedConversationId) return;
    sendMessage(selectedConversationId, text, attachment);
  };

  const handleToggleInfo = () => {
    if (isDesktopViewport) {
      setDesktopInfoOpen((current) => !current);
    } else {
      setInfoDrawerOpen((current) => !current);
    }
  };

  return (
    <div className="h-[calc(100dvh-11rem)] min-h-empty max-h-inbox overflow-hidden rounded-3xl border border-slate-100 bg-surface shadow-card md:min-h-chat">
      <div className="flex h-full min-w-0">
        <ConversationList
          conversations={conversations}
          selectedConversationId={selectedConversationId}
          referenceTime={referenceTime}
          onSelect={handleSelect}
          className={selectedConversationId ? 'hidden md:flex' : 'flex'}
        />

        <section className={`${selectedConversationId ? 'flex' : 'hidden md:flex'} min-w-0 flex-1 flex-col border-l border-slate-100 bg-surface`}>
          {selectedConversation ? (
            <>
              <ChatHeader
                contact={selectedConversation.contact}
                isInfoOpen={isDesktopViewport ? desktopInfoOpen : infoDrawerOpen}
                onBack={() => setSelectedConversationId(null)}
                onToggleInfo={handleToggleInfo}
              />
              <div
                className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-surface px-4 py-5 sm:px-6"
                role="log"
                aria-live="polite"
                aria-label={`Messages with ${selectedConversation.contact.name}`}
              >
                {selectedConversation.messages.map((item, index) => {
                  const previous = selectedConversation.messages[index - 1];
                  const showDate = !previous || dateKey(previous.sentAt) !== dateKey(item.sentAt);
                  return (
                    <React.Fragment key={item.id}>
                      {showDate && (
                        <DateDivider label={formatDateLabel(item.sentAt, referenceTime)} />
                      )}
                      <MessageBubble message={item} />
                    </React.Fragment>
                  );
                })}
                {isTyping && <TypingIndicator />}
                <div ref={messageEndRef} />
              </div>
              <MessageInput onSend={handleSend} />
            </>
          ) : (
            <EmptyState
              title="Select a conversation"
              description="Select a conversation to start chatting with your mentors and friends."
              actionLabel={conversations.length ? 'Open first conversation' : undefined}
              onAction={conversations.length ? () => handleSelect(conversations[0].id) : undefined}
              icon={<MessageCircleMore className="h-7 w-7" />}
              className="h-full rounded-none border-0 shadow-none"
            />
          )}
        </section>

        {selectedConversation && desktopInfoOpen && (
          <ContactInfoPanel
            contact={selectedConversation.contact}
            onClose={() => setDesktopInfoOpen(false)}
            className="hidden xl:flex"
          />
        )}
      </div>

      {selectedConversation && infoDrawerOpen && (
        <div className="fixed inset-0 z-drawer flex justify-end bg-slateText-primary/35 backdrop-blur-xs xl:hidden" onClick={() => setInfoDrawerOpen(false)}>
          <div ref={infoDrawerRef} role="dialog" aria-modal="true" aria-label="Contact information" className="h-full max-w-[88vw] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <ContactInfoPanel contact={selectedConversation.contact} onClose={() => setInfoDrawerOpen(false)} className="h-full" />
          </div>
        </div>
      )}
    </div>
  );
};
