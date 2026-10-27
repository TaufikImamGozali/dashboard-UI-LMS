import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, label, description }) => (
  <label className="flex min-h-touch cursor-pointer items-center justify-between gap-4 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-brand-400">
    <span><span className="block text-sm font-bold text-content-primary">{label}</span>{description && <span className="mt-0.5 block text-xs text-content-muted">{description}</span>}</span>
    <input type="checkbox" className="peer sr-only" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span aria-hidden="true" className="relative h-6 w-11 shrink-0 rounded-full bg-outline-strong transition-colors peer-checked:bg-brand-500 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-surface after:shadow-xs after:transition-transform peer-checked:after:translate-x-5" />
  </label>
);
