import React, { useRef, useState } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react';
import type { Attachment } from '../../types/message';

interface MessageInputProps {
  onSend: (text: string, attachment?: Attachment) => void;
}

const createAttachment = (selectedFile: File): Attachment => ({
  id: `attachment-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: selectedFile.name,
  size: selectedFile.size,
  type: selectedFile.type || 'application/octet-stream',
});

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [value, setValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    onSend('', createAttachment(selectedFile));
    event.target.value = '';
  };

  return (
    <div className="shrink-0 border-t border-slate-100 bg-surface p-3 sm:p-4">
      <div className="flex items-end gap-2">
        <input ref={fileInputRef} type="file" className="sr-only" onChange={handleFile} aria-label="Choose attachment" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Attach a file"
          className="mb-0.5 rounded-full p-2.5 text-slateText-muted transition-colors hover:bg-brand-50 hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <label className="relative flex min-w-0 flex-1 items-end rounded-3xl bg-brand-surface focus-within:ring-2 focus-within:ring-brand-300">
          <span className="sr-only">Message</span>
          <textarea
            rows={1}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a message..."
            className="max-h-28 min-h-11 flex-1 resize-none bg-transparent py-3 pl-4 pr-11 text-sm leading-5 text-slateText-primary outline-none placeholder:text-slateText-muted"
          />
          <button
            type="button"
            aria-label="Add emoji"
            className="absolute bottom-1.5 right-1.5 rounded-full p-2 text-slateText-muted transition-colors hover:text-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <Smile className="h-4.5 w-4.5" />
          </button>
        </label>
        <button
          type="button"
          onClick={submit}
          disabled={!value.trim()}
          aria-label="Send message"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white shadow-purple-glow transition-colors hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-brand-200 disabled:shadow-none"
        >
          <Send className="h-4.5 w-4.5" />
        </button>
      </div>
      <p className="mt-1.5 hidden pl-14 text-micro text-slateText-muted sm:block">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
};
