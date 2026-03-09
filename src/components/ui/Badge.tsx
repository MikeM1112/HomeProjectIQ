'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  icon?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', icon, children }: BadgeProps) {
  return (
    <span
      className={cn('tag', {
        'bg-success-light text-success': variant === 'success',
        'bg-warning-light text-warning': variant === 'warning',
        'bg-danger-light text-danger': variant === 'error',
        'bg-info-light text-info': variant === 'info',
        'bg-surface-muted text-ink-sub': variant === 'default',
      })}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
