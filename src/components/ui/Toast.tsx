import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle2, Trash2, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'delete';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const icons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  error: <AlertCircle className="h-4 w-4 text-rose-500" />,
  delete: <Trash2 className="h-4 w-4 text-rose-500" />,
};

const tones: Record<ToastType, string> = {
  success: 'border-emerald-200 bg-emerald-50',
  error: 'border-rose-200 bg-rose-50',
  delete: 'border-rose-200 bg-rose-50',
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 3500);
    return () => window.clearTimeout(timer);
  }, [onDismiss, toast.id]);

  return (
    <div role="alert" className={`flex min-w-64 max-w-xs items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold text-content-primary shadow-card motion-safe:animate-slide-in ${tones[toast.type]}`}>
      {icons[toast.type]}
      <span className="flex-1">{toast.message}</span>
      <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification" className="flex h-touch w-touch items-center justify-center rounded-full text-content-muted hover:bg-overlay/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;
  return (
    <div aria-live="polite" className="fixed bottom-6 right-6 z-toast flex flex-col items-end gap-2.5">
      {toasts.map((toast) => <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />)}
    </div>
  );
};
