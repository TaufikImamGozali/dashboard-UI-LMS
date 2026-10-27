import React, { useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../../types/settings';
import { AvatarUploader } from './AvatarUploader';

interface ProfileFormProps { profile: UserProfile; onSave: (profile: UserProfile) => void; onDirtyChange: (dirty: boolean) => void }
const fieldClass = 'mt-1.5 min-h-touch w-full rounded-xl border border-outline bg-surface-muted px-4 text-sm text-content-primary outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100';
export const ProfileForm: React.FC<ProfileFormProps> = ({ profile, onSave, onDirtyChange }) => {
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(profile), [form, profile]);
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
  useEffect(() => {
    if (!dirty) return;
    const guardNavigation = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('[data-navigation]') : null;
      if (target && !window.confirm('Discard your unsaved profile changes?')) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    document.addEventListener('click', guardNavigation, true);
    return () => document.removeEventListener('click', guardNavigation, true);
  }, [dirty]);
  const set = (key: keyof UserProfile, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); const next: Record<string, string> = {}; if (form.name.trim().length < 2) next.name = 'Name must contain at least 2 characters.'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email address.'; if (form.bio.length > 160) next.bio = 'Bio cannot exceed 160 characters.'; setErrors(next); if (!Object.keys(next).length) onSave({ ...form, name: form.name.trim(), email: form.email.trim() }); };
  return <form onSubmit={submit} className="space-y-5"><AvatarUploader value={form.avatar} name={form.name} onChange={(value) => set('avatar', value)} /><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold text-content-secondary">Full name<input value={form.name} onChange={(e) => set('name', e.target.value)} className={fieldClass} />{errors.name && <span className="mt-1 block text-xs text-rose-500">{errors.name}</span>}</label><label className="text-xs font-bold text-content-secondary">Email<input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} className={fieldClass} />{errors.email && <span className="mt-1 block text-xs text-rose-500">{errors.email}</span>}</label></div><label className="block text-xs font-bold text-content-secondary">Phone number<input value={form.phone} onChange={(e) => set('phone', e.target.value)} className={fieldClass} /></label><label className="block text-xs font-bold text-content-secondary">Bio<textarea rows={4} maxLength={160} value={form.bio} onChange={(e) => set('bio', e.target.value)} className={`${fieldClass} py-3`} /><span className="mt-1 flex justify-between text-micro text-content-muted"><span>{errors.bio}</span><span>{form.bio.length}/160</span></span></label><div className="flex justify-end gap-3"><button type="button" disabled={!dirty} onClick={() => setForm(profile)} className="min-h-touch rounded-full border border-outline px-5 text-sm font-bold text-content-secondary disabled:opacity-50">Cancel</button><button type="submit" disabled={!dirty} className="min-h-touch rounded-full bg-brand-500 px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Save Changes</button></div></form>;
};
