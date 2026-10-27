import React, { useEffect, useId, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen?: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  requiredConfirmationText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen = true,
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
  requiredConfirmationText,
}) => {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [confirmationText, setConfirmationText] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setConfirmationText(''); onCancel(); }
      if (event.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'));
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      trigger?.focus();
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;
  const canConfirm = !requiredConfirmationText || confirmationText === requiredConfirmationText;
  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-overlay/40 p-4 backdrop-blur-sm" onMouseDown={() => { setConfirmationText(''); onCancel(); }}>
      <div ref={panelRef} role="alertdialog" aria-modal="true" aria-labelledby={titleId} className="relative flex w-full max-w-sm flex-col gap-5 rounded-card bg-surface p-7 shadow-2xl motion-safe:animate-scale-in" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={() => { setConfirmationText(''); onCancel(); }} aria-label="Close confirmation" className="absolute right-3 top-3 flex h-touch w-touch items-center justify-center rounded-full text-content-muted hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"><X className="h-4 w-4" /></button>
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500"><AlertTriangle className="h-7 w-7" /></span>
        <div><h2 id={titleId} className="text-lg font-extrabold text-content-primary">{title}</h2><p className="mt-2 text-sm leading-relaxed text-content-secondary">{message}</p></div>
        {requiredConfirmationText && <label className="text-xs font-bold text-content-secondary">Type <span className="text-rose-500">{requiredConfirmationText}</span> to continue<input value={confirmationText} onChange={(event) => setConfirmationText(event.target.value)} autoComplete="off" className="mt-2 min-h-touch w-full rounded-xl border border-outline bg-surface-muted px-4 text-sm text-content-primary outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100" /></label>}
        <div className="flex gap-3">
          <button ref={cancelRef} type="button" onClick={() => { setConfirmationText(''); onCancel(); }} className="min-h-touch flex-1 rounded-full border border-outline px-4 text-sm font-bold text-content-secondary hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">Cancel</button>
          <button type="button" disabled={!canConfirm} onClick={() => { setConfirmationText(''); onConfirm(); }} className="min-h-touch flex-1 rounded-full bg-rose-500 px-4 text-sm font-bold text-white hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-50">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};
