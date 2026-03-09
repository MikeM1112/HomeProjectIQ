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
          'inline-flex items-center justify-center gap-2 font-semibold transition-all font-[inherit]',
          {
            'bg-[image:var(--accent-gradient)] text-white rounded-[10px] shadow-[0_4px_16px_var(--accent-glow)] hover:shadow-[0_6px_24px_var(--accent-glow)] hover:-translate-y-px': variant === 'primary',
            'bg-[var(--glass)] backdrop-blur-[12px] border border-[var(--glass-border)] text-[var(--text)] rounded-[10px] hover:border-[var(--glass-border-hover)] hover:bg-[var(--card-hover)]': variant === 'secondary',
            'bg-transparent text-[var(--text-sub)] hover:text-[var(--text)]': variant === 'ghost',
            'bg-[var(--danger)] text-white rounded-[10px] hover:brightness-110': variant === 'destructive',
          },
          {
            'px-3 py-1.5 text-sm rounded-[10px]': size === 'sm',
            'px-4 py-2.5 text-sm rounded-[10px]': size === 'md',
            'px-6 py-3 text-base rounded-[10px]': size === 'lg',
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
