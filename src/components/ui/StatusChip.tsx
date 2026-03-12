'use client';

import { cn } from '@/lib/utils';

type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

interface StatusChipProps {
  status: string;
  variant?: StatusVariant;
  className?: string;
}

const variantConfig: Record<StatusVariant, { dot: string; text: string; bg: string }> = {
  success: {
    dot: 'bg-[var(--emerald)]',
    text: 'text-[var(--emerald)]',
    bg: 'bg-[var(--emerald-soft)]',
  },
  warning: {
    dot: 'bg-[var(--gold)]',
    text: 'text-[var(--gold)]',
    bg: 'bg-[var(--gold-soft)]',
  },
  danger: {
    dot: 'bg-[var(--danger)]',
    text: 'text-[var(--danger)]',
    bg: 'bg-[var(--danger-soft)]',
  },
  info: {
    dot: 'bg-[var(--info)]',
    text: 'text-[var(--info)]',
    bg: 'bg-[var(--info-soft)]',
  },
  default: {
    dot: 'bg-[var(--text-dim)]',
    text: 'text-[var(--text-sub)]',
    bg: 'bg-[var(--chip-bg)]',
  },
};

export function StatusChip({ status, variant = 'default', className }: StatusChipProps) {
  const config = variantConfig[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border border-[var(--glass-border)]',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {status}
    </span>
  );
}
