'use client';

import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'default' | 'interactive' | 'selected';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Card({ variant = 'default', padding = 'md', children, className, onClick, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={style}
      className={cn(
        'rounded-2xl bg-[var(--glass)] backdrop-blur-[12px] border border-[var(--glass-border)] transition-all duration-300 hover:border-[var(--glass-border-hover)]',
        {
          '': variant === 'default',
          'pressable cursor-pointer hover:bg-[var(--card-hover)]': variant === 'interactive',
          'border-[var(--accent)] shadow-md ring-1 ring-[var(--accent)]/20': variant === 'selected',
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
