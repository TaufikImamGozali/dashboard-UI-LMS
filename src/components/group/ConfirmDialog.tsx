import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ title, message, confirmLabel, onConfirm, onCancel }) => {
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onCancel();
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slateText-primary/40 p-4 backdrop-blur-sm" onMouseDown={onCancel}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="group-confirm-title" className="relative w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={onCancel} aria-label="Close confirmation" className="absolute right-4 top-4 rounded-full p-2 text-slateText-muted hover:bg-brand-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"><X className="h-4 w-4" /></button>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><AlertTriangle className="h-7 w-7" /></span>
        <h2 id="group-confirm-title" className="mt-5 text-lg font-extrabold text-slateText-primary">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-slateText-secondary">{message}</p>
        <div className="mt-6 flex gap-3">
          <button ref={cancelRef} type="button" onClick={onCancel} className="flex-1 rounded-full border border-slate-200 py-2.5 text-sm font-bold text-slateText-secondary hover:bg-brand-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">Cancel</button>
          <button type="button" onClick={onConfirm} className="flex-1 rounded-full bg-rose-500 py-2.5 text-sm font-bold text-white hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};
