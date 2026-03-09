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
        'animate-pulse bg-surface-muted',
        {
          'h-4 rounded': variant === 'text',
          'h-32 rounded-xl': variant === 'card',
          'rounded-full': variant === 'circle',
          'rounded-lg': variant === 'rect',
        },
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
