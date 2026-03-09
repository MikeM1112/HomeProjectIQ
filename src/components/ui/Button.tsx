'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'btn pressable inline-flex items-center justify-center gap-2 font-semibold transition-all',
          {
            'gradient-accent text-white shadow-md hover:shadow-lg hover:brightness-110': variant === 'primary',
            'glass text-[var(--ink)] hover:border-[var(--accent)]': variant === 'secondary',
            'bg-transparent text-[var(--ink)] hover:bg-[var(--muted)]': variant === 'ghost',
            'bg-[var(--red)] text-white hover:brightness-110': variant === 'destructive',
          },
          {
            'px-3 py-1.5 text-sm rounded-full': size === 'sm',
            'px-4 py-2.5 text-sm rounded-full': size === 'md',
            'px-6 py-3 text-base rounded-full': size === 'lg',
          },
          (disabled || loading) && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
