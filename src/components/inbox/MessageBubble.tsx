import React from 'react';
import { Check, CheckCheck, FileText } from 'lucide-react';
import type { Message } from '../../types/message';

interface MessageBubbleProps {
  message: Message;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isMine = message.sender === 'me';
  const time = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(
    new Date(message.sentAt),
  );

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[82%] sm:max-w-[72%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
            isMine
              ? 'rounded-br-md bg-brand-500 text-white'
              : 'rounded-bl-md border border-slate-100 bg-brand-surface text-slateText-primary'
          }`}
        >
          {message.attachment && (
            <div className={`mb-1 flex items-center gap-3 rounded-xl p-2.5 ${isMine ? 'bg-white/15' : 'bg-surface'}`}>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isMine ? 'bg-white/20' : 'bg-brand-50 text-brand-500'}`}>
                <FileText className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-bold">{message.attachment.name}</span>
                <span className={`block text-micro ${isMine ? 'text-white/70' : 'text-slateText-muted'}`}>
                  {formatSize(message.attachment.size)}
                </span>
              </span>
            </div>
          )}
          {message.text && <p className="whitespace-pre-wrap break-words">{message.text}</p>}
        </div>
        <div className="mt-1 flex items-center gap-1 px-1 text-micro text-slateText-muted">
          <time dateTime={message.sentAt}>{time}</time>
          {isMine && (
            message.status === 'read'
              ? <CheckCheck className="h-3.5 w-3.5 text-brand-500" aria-label="Read" />
              : <Check className="h-3.5 w-3.5" aria-label="Sent" />
          )}
        </div>
      </div>
    </div>
  );
};
