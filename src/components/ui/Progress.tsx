'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  label?: string;
  color?: string;
  animated?: boolean;
  gradient?: boolean;
}

export function Progress({ value, label, color = 'bg-brand', animated = true, gradient = false }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      {label && <p className="text-xs text-[var(--text-sub)]">{label}</p>}
      <div className="h-2 w-full rounded-full bg-[var(--xp-bar-bg)] overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full origin-left transition-[width] duration-[600ms] ease-in-out',
            gradient ? 'shadow-[0_0_12px_var(--accent-glow)]' : color,
            animated && 'animate-barGrow'
          )}
          style={{
            width: `${clamped}%`,
            ...(gradient ? { background: 'var(--xp-gradient)' } : {}),
          }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
