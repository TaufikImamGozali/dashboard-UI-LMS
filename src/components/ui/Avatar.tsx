import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
  loading?: 'eager' | 'lazy';
}

const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12', xl: 'h-20 w-20' };
const pixels = { sm: 32, md: 40, lg: 48, xl: 80 };

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', isOnline = false, className = '', loading = 'lazy' }) => (
  <span className="relative inline-flex shrink-0">
    <img src={src} alt={alt} width={pixels[size]} height={pixels[size]} loading={loading} className={`${sizes[size]} rounded-full object-cover ${className}`} />
    {isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-surface" aria-label="Online" />}
  </span>
);
