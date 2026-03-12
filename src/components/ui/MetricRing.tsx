'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MetricRingProps {
  value: number;
  label: string;
  color?: string;
  size?: number;
  className?: string;
}

export function MetricRing({
  value,
  label,
  color = 'var(--accent)',
  size = 56,
  className,
}: MetricRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--glass-border)"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[var(--text)]">{clamped}</span>
        </div>
      </div>
      <span className="text-[10px] font-medium text-[var(--text-sub)] text-center leading-tight">
        {label}
      </span>
    </div>
  );
}
