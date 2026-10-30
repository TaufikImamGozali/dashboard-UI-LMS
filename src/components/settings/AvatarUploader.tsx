import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { profileService } from '../../services/profileService';

interface AvatarUploaderProps {
  value: string;
  name: string;
  onChange: (url: string) => void;
}

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ value, name, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const select = async (file?: File) => {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      setError('Gunakan format gambar JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Ukuran gambar maksimal 2 MB.');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;

      if (userId) {
        const res = await profileService.uploadAvatar(userId, file);
        if (res.success && res.url) {
          onChange(res.url);
          setIsUploading(false);
          return;
        }
      }

      // Fallback to data URL if session unavailable or storage error
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
      setError('Gagal mengunggah foto profil.');
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={value}
            alt={`${name} profile preview`}
            width="80"
            height="80"
            className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-50"
          />
          {isUploading && (
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          )}
        </div>

        <div>
          <button
            type="button"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex min-h-touch items-center gap-2 rounded-full border border-outline px-4 text-xs font-bold text-content-primary hover:bg-surface-muted focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-brand-500" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" />
                <span>Ganti Foto</span>
              </>
            )}
          </button>
          <p className="mt-1.5 text-micro text-content-muted">
            JPG, PNG, atau WebP. Maksimal 2 MB.
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={(event) => select(event.target.files?.[0])}
      />
      {error && (
        <p role="alert" className="mt-2 text-xs font-semibold text-rose-500">
          {error}
        </p>
      )}
    </div>
  );
};
