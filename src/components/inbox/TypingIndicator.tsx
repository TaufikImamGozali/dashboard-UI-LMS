import React from 'react';

export const TypingIndicator: React.FC = () => (
  <div className="flex justify-start" aria-label="Contact is typing">
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-100 bg-brand-surface px-4 py-3">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slateText-muted motion-reduce:animate-none"
          style={{ animationDelay: `${index * 120}ms` }}
        />
      ))}
      <span className="sr-only">Typing...</span>
    </div>
  </div>
);
