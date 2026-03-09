'use client';

import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function Toast() {
  const { toast, hideToast } = useUIStore();

  if (!toast.show) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[100] max-w-sm px-4 py-3 rounded-2xl shadow-md animate-rise',
        'glass text-sm font-medium',
        'max-sm:left-4 max-sm:right-4 max-sm:text-center',
        {
          'border-[var(--green)]/20 text-[var(--green)]': toast.type === 'success',
          'border-[var(--red)]/20 text-[var(--red)]': toast.type === 'error',
          'border-[var(--yellow)]/20 text-[var(--yellow)]': toast.type === 'warning',
          'border-[var(--blue)]/20 text-[var(--blue)]': toast.type === 'info',
        }
      )}
      role="alert"
    >
      {toast.message}
    </div>
  );
}
