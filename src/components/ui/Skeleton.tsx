'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  variant?: 'text' | 'card' | 'circle' | 'rect';
  width?: string;
  height?: string;
  className?: string;
}

export function Skeleton({ variant = 'text', width, height, className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-[var(--muted)]',
        {
          'h-4 rounded': variant === 'text',
          'h-32 rounded-2xl': variant === 'card',
          'rounded-full': variant === 'circle',
          'rounded-xl': variant === 'rect',
        },
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
