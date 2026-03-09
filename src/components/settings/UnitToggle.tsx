'use client';

import { cn } from '@/lib/utils';
import type { UnitSystem } from '@/lib/global';

interface UnitToggleProps {
  value: UnitSystem;
  onChange: (units: UnitSystem) => void;
}

export function UnitToggle({ value, onChange }: UnitToggleProps) {
  return (
    <div className="flex rounded-lg border border-[var(--border)] overflow-hidden">
      <button
        type="button"
        onClick={() => onChange('imperial')}
        className={cn(
          'flex-1 px-4 py-2 text-sm font-medium transition-colors',
          value === 'imperial'
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--surface)] text-[var(--ink-sub)] hover:bg-[var(--muted)]'
        )}
      >
        Imperial (ft, °F)
      </button>
      <button
        type="button"
        onClick={() => onChange('metric')}
        className={cn(
          'flex-1 px-4 py-2 text-sm font-medium transition-colors',
          value === 'metric'
            ? 'bg-[var(--accent)] text-white'
            : 'bg-[var(--surface)] text-[var(--ink-sub)] hover:bg-[var(--muted)]'
        )}
      >
        Metric (m, °C)
      </button>
    </div>
  );
}
