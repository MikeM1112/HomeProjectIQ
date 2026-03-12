'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  score: number;
  label: string;
  sublabel?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { ring: 80, stroke: 6, fontSize: 'text-2xl', labelSize: 'text-[11px]', sublabelSize: 'text-[10px]' },
  md: { ring: 120, stroke: 8, fontSize: 'text-4xl', labelSize: 'text-xs', sublabelSize: 'text-[11px]' },
  lg: { ring: 160, stroke: 10, fontSize: 'text-5xl', labelSize: 'text-sm', sublabelSize: 'text-xs' },
} as const;

export function ScoreCard({
  score,
  label,
  sublabel,
  color = 'var(--accent)',
  size = 'md',
  className,
}: ScoreCardProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const config = sizeConfig[size];
  const radius = (config.ring - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        'flex flex-col items-center gap-2',
        className
      )}
    >
      <div className="relative" style={{ width: config.ring, height: config.ring }}>
        {/* Background ring */}
        <svg
          width={config.ring}
          height={config.ring}
          className="rotate-[-90deg]"
        >
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="var(--glass-border)"
            strokeWidth={config.stroke}
          />
          {/* Progress ring */}
          <motion.circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>
        {/* Centered score */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className={cn(config.fontSize, 'font-bold text-[var(--text)]')}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
          >
            {clamped}
          </motion.span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className={cn(config.labelSize, 'font-semibold text-[var(--text)]')}>
          {label}
        </p>
        {sublabel && (
          <p className={cn(config.sublabelSize, 'text-[var(--text-sub)] mt-0.5')}>
            {sublabel}
          </p>
        )}
      </div>
    </motion.div>
  );
}
