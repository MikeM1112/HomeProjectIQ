'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'gradient';
  icon?: string;
  children: React.ReactNode;
}

export function Badge({ variant = 'default', icon, children }: BadgeProps) {
  return (
    <span
      className={cn('tag', {
        'bg-[var(--green-lt)] text-[var(--green)]': variant === 'success',
        'bg-[var(--yellow-lt)] text-[var(--yellow)]': variant === 'warning',
        'bg-[var(--red-lt)] text-[var(--red)]': variant === 'error',
        'bg-[var(--blue-lt)] text-[var(--blue)]': variant === 'info',
        'bg-[var(--muted)] text-[var(--ink-sub)]': variant === 'default',
        'gradient-accent text-white': variant === 'gradient',
      })}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
