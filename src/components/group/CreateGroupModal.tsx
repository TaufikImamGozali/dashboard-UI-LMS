import React, { useRef, useState } from 'react';
import { LockKeyhole, Sparkles, X } from 'lucide-react';
import type { CategoryType } from '../../types';
import type { GroupPrivacy, NewGroupForm } from '../../types/group';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface CreateGroupModalProps {
  onClose: () => void;
  onSubmit: (form: NewGroupForm) => void;
}

const INITIAL_FORM: NewGroupForm = {
  name: '',
  description: '',
  category: 'design',
  privacy: 'Public',
};

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [nameError, setNameError] = useState('');
  const nameRef = useRef<HTMLInputElement>(null);
  const dialogRef = useFocusTrap<HTMLDivElement>(true, onClose, nameRef);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (form.name.trim().length < 3) {
      setNameError('Group name must be at least 3 characters.');
      nameRef.current?.focus();
      return;
    }
    onSubmit(form);
  };

  const fieldClass = 'w-full rounded-2xl border border-slate-200 bg-brand-surface px-4 py-3 text-sm text-slateText-primary outline-none placeholder:text-slateText-muted focus:border-brand-300 focus:bg-surface focus:ring-4 focus:ring-brand-100';

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-slateText-primary/40 p-0 backdrop-blur-sm md:p-5" onMouseDown={onClose}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="create-group-title" className="flex h-full w-full flex-col overflow-hidden bg-surface shadow-2xl md:h-auto md:max-h-[90vh] md:max-w-xl md:rounded-3xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-500"><Sparkles className="h-5 w-5" /></span>
            <div>
              <h2 id="create-group-title" className="text-lg font-extrabold text-slateText-primary">Create Group</h2>
              <p className="text-xs text-slateText-muted">Build a space for learning together.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close create group modal" className="rounded-full p-2 text-slateText-muted hover:bg-brand-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto p-6">
          <div>
            <label htmlFor="group-name" className="mb-2 block text-xs font-bold text-slateText-secondary">Group name <span className="text-rose-500">*</span></label>
            <input ref={nameRef} id="group-name" value={form.name} onChange={(event) => { setForm((current) => ({ ...current, name: event.target.value })); setNameError(''); }} placeholder="e.g. Product Design Circle" className={`${fieldClass} ${nameError ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100' : ''}`} aria-describedby={nameError ? 'group-name-error' : undefined} />
            {nameError && <p id="group-name-error" className="mt-1.5 text-xs font-semibold text-rose-500">{nameError}</p>}
          </div>
          <div>
            <label htmlFor="group-description" className="mb-2 block text-xs font-bold text-slateText-secondary">Description</label>
            <textarea id="group-description" rows={4} value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="What will members learn and discuss?" className={`${fieldClass} resize-none`} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="group-category" className="mb-2 block text-xs font-bold text-slateText-secondary">Category</label>
              <select id="group-category" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as CategoryType }))} className={fieldClass}>
                <option value="design">UI/UX Design</option><option value="branding">Branding</option><option value="frontend">Front End</option>
              </select>
            </div>
            <div>
              <label htmlFor="group-privacy" className="mb-2 block text-xs font-bold text-slateText-secondary">Privacy</label>
              <select id="group-privacy" value={form.privacy} onChange={(event) => setForm((current) => ({ ...current, privacy: event.target.value as GroupPrivacy }))} className={fieldClass}>
                <option value="Public">Public</option><option value="Private">Private</option>
              </select>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-brand-50 p-4 text-xs leading-relaxed text-brand-700">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Private groups are visible in Discover, but joining can be managed by the group admin.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-slate-200 py-3 text-sm font-bold text-slateText-secondary hover:bg-brand-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">Cancel</button>
            <button type="submit" className="flex-1 rounded-full bg-brand-500 py-3 text-sm font-bold text-white shadow-purple-glow hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2">Create Group</button>
          </div>
        </form>
      </div>
    </div>
  );
};
