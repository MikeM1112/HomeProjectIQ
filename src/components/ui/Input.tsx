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
          <label htmlFor={inputId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-dim',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1',
            error
              ? 'border-danger focus:ring-danger/30'
              : 'border-border focus:border-border-focus focus:ring-brand/20',
            props.disabled && 'opacity-50 cursor-not-allowed bg-surface-muted',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
        {helper && !error && <p className="text-xs text-ink-dim">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
