import React, { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface TriggerProps {
  ref: React.RefObject<HTMLButtonElement>;
  onClick: () => void;
  'aria-haspopup': 'menu' | 'dialog';
  'aria-expanded': boolean;
  'aria-controls': string;
}

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  role?: 'menu' | 'dialog';
  widthClass?: string;
  trigger: (props: TriggerProps) => React.ReactNode;
  children: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({ open, onOpenChange, label, role = 'dialog', widthClass = 'md:w-96', trigger, children }) => {
  const id = useId();
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useFocusTrap<HTMLDivElement>(open, () => onOpenChange(false));
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) onOpenChange(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const items = Array.from(wrapperRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []);
      if (!items.length) return;
      event.preventDefault();
      const index = items.indexOf(document.activeElement as HTMLElement);
      const next = event.key === 'ArrowDown' ? (index + 1) % items.length : (index <= 0 ? items.length - 1 : index - 1);
      items[next]?.focus();
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('mousedown', handlePointer); document.removeEventListener('keydown', handleKey); };
  }, [onOpenChange, open, role]);

  useEffect(() => {
    if (previousPathRef.current !== location.pathname && open) onOpenChange(false);
    previousPathRef.current = location.pathname;
  }, [location.pathname, onOpenChange, open]);

  return (
    <div ref={wrapperRef} className="relative">
      {trigger({ ref: triggerRef, onClick: () => onOpenChange(!open), 'aria-haspopup': role, 'aria-expanded': open, 'aria-controls': id })}
      {open && (
        <div id={id} ref={panelRef} role={role} aria-label={label} aria-modal={role === 'dialog' ? true : undefined} className={`fixed inset-x-0 bottom-0 z-modal max-h-[85dvh] overflow-y-auto rounded-t-card border border-outline bg-surface shadow-2xl motion-safe:animate-scale-in md:absolute md:inset-auto md:right-0 md:top-[calc(100%+0.75rem)] md:max-h-[min(75dvh,42rem)] md:rounded-card ${widthClass}`}>
          <div className="flex items-center justify-between border-b border-outline-subtle px-5 py-3 md:hidden"><span className="text-sm font-extrabold text-content-primary">{label}</span><button type="button" onClick={() => { onOpenChange(false); triggerRef.current?.focus(); }} aria-label={`Close ${label}`} className="flex h-touch w-touch items-center justify-center rounded-full hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand-400"><X className="h-5 w-5" /></button></div>
          {children}
        </div>
      )}
    </div>
  );
};
