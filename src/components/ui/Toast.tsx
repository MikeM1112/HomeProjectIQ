'use client';

import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function Toast() {
  const { toast, hideToast } = useUIStore();

  // Auto-dismiss is handled by the store's showToast timer.
  // No duplicate timer needed here.

  if (!toast.show) return null;

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-[100] max-w-sm px-4 py-3 rounded-lg shadow-md animate-rise',
        'text-sm font-medium',
        'max-sm:left-4 max-sm:right-4 max-sm:text-center',
        {
          'bg-success-light text-success border border-success/20': toast.type === 'success',
          'bg-danger-light text-danger border border-danger/20': toast.type === 'error',
          'bg-warning-light text-warning border border-warning/20': toast.type === 'warning',
          'bg-info-light text-info border border-info/20': toast.type === 'info',
        }
      )}
      role="alert"
    >
      {toast.message}
    </div>
  );
}
