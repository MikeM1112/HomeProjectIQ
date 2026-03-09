'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  label?: string;
  color?: string;
  animated?: boolean;
}

export function Progress({ value, label, color = 'bg-brand', animated = true }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className="space-y-1">
      {label && <p className="text-xs text-ink-sub">{label}</p>}
      <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full origin-left',
            color,
            animated && 'animate-barGrow'
          )}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}
