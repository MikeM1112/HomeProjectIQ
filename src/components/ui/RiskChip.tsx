'use client';

import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';

type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

interface RiskChipProps {
  level: RiskLevel;
  className?: string;
}

const riskConfig: Record<
  RiskLevel,
  { label: string; icon: typeof ShieldCheck; bg: string; text: string; border: string }
> = {
  low: {
    label: 'Low Risk',
    icon: ShieldCheck,
    bg: 'bg-[var(--emerald-soft)]',
    text: 'text-[var(--emerald)]',
    border: 'border-[var(--emerald)]/20',
  },
  moderate: {
    label: 'Moderate',
    icon: ShieldAlert,
    bg: 'bg-[var(--gold-soft)]',
    text: 'text-[var(--gold)]',
    border: 'border-[var(--gold)]/20',
  },
  high: {
    label: 'High Risk',
    icon: AlertTriangle,
    bg: 'bg-[rgba(251,146,60,0.12)]',
    text: 'text-[#FB923C]',
    border: 'border-[#FB923C]/20',
  },
  critical: {
    label: 'Critical',
    icon: AlertOctagon,
    bg: 'bg-[var(--danger-soft)]',
    text: 'text-[var(--danger)]',
    border: 'border-[var(--danger)]/20',
  },
};

export function RiskChip({ level, className }: RiskChipProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border',
        config.bg,
        config.text,
        config.border,
        className
      )}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}
