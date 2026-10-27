import React, { useRef, useState } from 'react';
import { Camera } from 'lucide-react';

interface AvatarUploaderProps { value: string; name: string; onChange: (dataUrl: string) => void }
export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ value, name, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const select = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) { setError('Use a JPG, PNG, or WebP image.'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('Image must be 2 MB or smaller.'); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') { onChange(reader.result); setError(''); } };
    reader.readAsDataURL(file);
  };
  return <div><div className="flex items-center gap-4"><img src={value} alt={`${name} profile preview`} width="80" height="80" className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-50" /><div><button type="button" onClick={() => inputRef.current?.click()} className="inline-flex min-h-touch items-center gap-2 rounded-full border border-outline px-4 text-xs font-bold text-content-primary hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand-400"><Camera className="h-4 w-4" /> Change photo</button><p className="mt-1.5 text-micro text-content-muted">JPG, PNG, or WebP. Maximum 2 MB.</p></div></div><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => select(event.target.files?.[0])} />{error && <p role="alert" className="mt-2 text-xs font-semibold text-rose-500">{error}</p>}</div>;
};
