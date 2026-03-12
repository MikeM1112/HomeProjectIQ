'use client';

import { motion } from 'framer-motion';
import { Calendar, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RiskChip } from './RiskChip';
import { StatusChip } from './StatusChip';

type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

interface SystemHealthCardProps {
  name: string;
  systemType: string;
  condition: string;
  riskLevel: RiskLevel;
  lastServiced?: string;
  installDate?: string;
  className?: string;
}

const conditionVariant = (condition: string) => {
  const lower = condition.toLowerCase();
  if (lower === 'good' || lower === 'excellent') return 'success' as const;
  if (lower === 'fair' || lower === 'aging') return 'warning' as const;
  if (lower === 'poor' || lower === 'failing' || lower === 'critical') return 'danger' as const;
  return 'default' as const;
};

export function SystemHealthCard({
  name,
  systemType,
  condition,
  riskLevel,
  lastServiced,
  installDate,
  className,
}: SystemHealthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        'rounded-[20px] bg-[var(--glass)] backdrop-blur-[16px] border border-[var(--glass-border)] shadow-[var(--card-shadow)] p-4 transition-all duration-300 hover:border-[var(--glass-border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-[var(--text)] truncate">{name}</h4>
          <p className="text-[11px] text-[var(--text-dim)] mt-0.5">{systemType}</p>
        </div>
        <RiskChip level={riskLevel} />
      </div>

      {/* Condition */}
      <div className="mb-3">
        <StatusChip status={condition} variant={conditionVariant(condition)} />
      </div>

      {/* Dates */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {lastServiced && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-sub)]">
            <Wrench size={12} className="text-[var(--text-dim)]" />
            <span>Serviced {lastServiced}</span>
          </div>
        )}
        {installDate && (
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-sub)]">
            <Calendar size={12} className="text-[var(--text-dim)]" />
            <span>Installed {installDate}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
