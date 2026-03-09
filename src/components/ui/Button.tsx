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
            'bg-brand text-white hover:bg-brand-medium': variant === 'primary',
            'bg-surface-muted text-ink border border-border hover:bg-border': variant === 'secondary',
            'bg-transparent text-ink hover:bg-surface-muted': variant === 'ghost',
            'bg-danger text-white hover:bg-red-700': variant === 'destructive',
          },
          {
            'px-3 py-1.5 text-sm rounded-md': size === 'sm',
            'px-4 py-2.5 text-sm rounded-lg': size === 'md',
            'px-6 py-3 text-base rounded-lg': size === 'lg',
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
