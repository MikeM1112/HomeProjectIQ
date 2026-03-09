'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'default' | 'interactive' | 'selected';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ variant = 'default', padding = 'md', children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'rounded-xl bg-surface-card border',
        {
          'border-border shadow-sm': variant === 'default',
          'border-border shadow-sm pressable cursor-pointer hover:shadow-md': variant === 'interactive',
          'border-brand shadow-md ring-1 ring-brand/20': variant === 'selected',
        },
        {
          'p-3': padding === 'sm',
          'p-4': padding === 'md',
          'p-6': padding === 'lg',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
