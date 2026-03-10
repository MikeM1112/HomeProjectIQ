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
            'bg-[image:var(--accent-gradient)] text-white rounded-full shadow-[0_4px_16px_var(--accent-glow)] hover:shadow-[0_8px_28px_var(--accent-glow)] hover:-translate-y-0.5 active:scale-[0.98]': variant === 'primary',
            'bg-[var(--glass)] backdrop-blur-[16px] border border-[var(--glass-border)] text-[var(--text)] rounded-full shadow-[var(--card-shadow,_0_2px_12px_rgba(0,0,0,0.06))] hover:border-[var(--glass-border-hover)] hover:bg-[var(--card-hover)]': variant === 'secondary',
            'bg-transparent text-[var(--text-sub)] hover:text-[var(--text)]': variant === 'ghost',
            'bg-[var(--danger)] text-white rounded-full hover:brightness-110': variant === 'destructive',
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
