'use client';

import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return (parts[0]?.[0] ?? '?').toUpperCase();
}

export function Avatar({ src, name = '', size = 'md' }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover ring-2 ring-[var(--glass-border)]', sizes[size])}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full text-white font-semibold flex items-center justify-center ring-2 ring-[var(--glass-border)]',
        sizes[size]
      )}
      style={{ background: 'var(--accent-gradient)' }}
      aria-label={name || 'Avatar'}
    >
      {getInitials(name || 'U')}
    </div>
  );
}
