'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Folder, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SavingsCardProps {
  totalSaved: number;
  projectCount: number;
  monthlyAvg: number;
  className?: string;
}

function formatDollars(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function SavingsCard({
  totalSaved,
  projectCount,
  monthlyAvg,
  className,
}: SavingsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        'rounded-[20px] bg-[var(--glass)] backdrop-blur-[16px] border border-[var(--glass-border)] shadow-[var(--card-shadow)] p-5 transition-all duration-300',
        className
      )}
    >
      {/* Total saved */}
      <div className="flex items-center gap-2 mb-1">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--emerald-soft)]">
          <TrendingUp size={16} className="text-[var(--emerald)]" />
        </div>
        <span className="text-xs font-medium text-[var(--text-sub)]">Total Saved</span>
      </div>
      <motion.p
        className="text-3xl font-bold text-[var(--emerald)] mt-2 mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      >
        {formatDollars(totalSaved)}
      </motion.p>

      {/* Supporting stats */}
      <div className="flex gap-4 pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <Folder size={14} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{projectCount}</p>
            <p className="text-[10px] text-[var(--text-dim)]">Projects</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={14} className="text-[var(--text-dim)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">{formatDollars(monthlyAvg)}</p>
            <p className="text-[10px] text-[var(--text-dim)]">Monthly Avg</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
