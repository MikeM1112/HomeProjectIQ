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
          <label htmlFor={inputId} className="block text-sm font-medium text-[var(--text)]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-[14px] border px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-dim)]',
            'bg-[var(--input-bg)] backdrop-blur-[8px]',
            'transition-colors focus:outline-none',
            error
              ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_var(--danger-soft)]'
              : 'border-[var(--glass-border)] focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-soft)]',
            props.disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--danger)]">{error}</p>}
        {helper && !error && <p className="text-xs text-[var(--text-dim)]">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
