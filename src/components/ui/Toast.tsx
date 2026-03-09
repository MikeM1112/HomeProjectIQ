'use client';

import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function Toast() {
  const { toast, hideToast } = useUIStore();

  if (!toast.show) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[100] max-w-sm px-4 py-3 rounded-2xl animate-rise',
        'bg-[var(--glass)] backdrop-blur-[12px] border border-[var(--glass-border)] shadow-[var(--shadow)] text-sm font-medium',
        'max-sm:left-4 max-sm:right-4 max-sm:text-center',
        {
          'border-[var(--emerald)]/20 text-[var(--emerald)]': toast.type === 'success',
          'border-[var(--danger)]/20 text-[var(--danger)]': toast.type === 'error',
          'border-[var(--gold)]/20 text-[var(--gold)]': toast.type === 'warning',
          'border-[var(--info)]/20 text-[var(--info)]': toast.type === 'info',
        }
      )}
      role="alert"
    >
      {toast.message}
    </div>
  );
}
