'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helper, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--ink)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-xl border px-3.5 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-dim)]',
            'bg-[var(--glass-bg)] backdrop-blur-sm',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[var(--bg)]',
            error
              ? 'border-[var(--red)] focus:ring-[var(--red)]/30'
              : 'border-[var(--border)] focus:border-[var(--border-focus)] focus:ring-[var(--accent)]/20',
            props.disabled && 'opacity-50 cursor-not-allowed bg-[var(--muted)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--red)]">{error}</p>}
        {helper && !error && <p className="text-xs text-[var(--ink-dim)]">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
