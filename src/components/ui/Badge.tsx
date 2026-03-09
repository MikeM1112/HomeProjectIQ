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
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold', {
        'bg-[var(--emerald-soft)] text-[var(--emerald)]': variant === 'success',
        'bg-[var(--gold-soft)] text-[var(--gold)]': variant === 'warning',
        'bg-[var(--danger-soft)] text-[var(--danger)]': variant === 'error',
        'bg-[var(--info-soft)] text-[var(--info)]': variant === 'info',
        'bg-[var(--chip-bg)] border border-[var(--chip-border)] text-[var(--chip-text)]': variant === 'default',
        'bg-[image:var(--accent-gradient)] text-white': variant === 'gradient',
      })}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  );
}
