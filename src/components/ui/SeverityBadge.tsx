'use client';

import { Info, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Severity = 'low' | 'medium' | 'high' | 'critical';

interface SeverityBadgeProps {
  severity: Severity;
  label?: string;
  className?: string;
}

const severityConfig: Record<
  Severity,
  { defaultLabel: string; icon: typeof Info; bg: string; text: string }
> = {
  low: {
    defaultLabel: 'Low',
    icon: Info,
    bg: 'bg-[var(--info-soft)]',
    text: 'text-[var(--info)]',
  },
  medium: {
    defaultLabel: 'Medium',
    icon: AlertTriangle,
    bg: 'bg-[var(--gold-soft)]',
    text: 'text-[var(--gold)]',
  },
  high: {
    defaultLabel: 'High',
    icon: AlertCircle,
    bg: 'bg-[rgba(251,146,60,0.12)]',
    text: 'text-[#FB923C]',
  },
  critical: {
    defaultLabel: 'Critical',
    icon: AlertOctagon,
    bg: 'bg-[var(--danger-soft)]',
    text: 'text-[var(--danger)]',
  },
};

export function SeverityBadge({ severity, label, className }: SeverityBadgeProps) {
  const config = severityConfig[severity];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
        config.bg,
        config.text,
        className
      )}
    >
      <Icon size={12} />
      {label ?? config.defaultLabel}
    </span>
  );
}
