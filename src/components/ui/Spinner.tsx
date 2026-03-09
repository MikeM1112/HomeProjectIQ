'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function Spinner({ size = 'md', color = 'border-brand' }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full border-2 border-t-transparent animate-spin',
        color,
        {
          'w-4 h-4': size === 'sm',
          'w-6 h-6': size === 'md',
          'w-8 h-8': size === 'lg',
        }
      )}
      role="status"
      aria-label="Loading"
    />
  );
}
