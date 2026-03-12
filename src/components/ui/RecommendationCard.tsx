'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Priority = 'low' | 'medium' | 'high' | 'critical';

interface RecommendationCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  cta?: { label: string; onClick: () => void };
  priority?: Priority;
  className?: string;
}

const priorityAccent: Record<Priority, string> = {
  low: 'var(--info)',
  medium: 'var(--gold)',
  high: '#FB923C',
  critical: 'var(--danger)',
};

export function RecommendationCard({
  title,
  description,
  icon,
  cta,
  priority = 'medium',
  className,
}: RecommendationCardProps) {
  const accentColor = priorityAccent[priority];

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
      <div className="flex gap-3">
        {/* Icon */}
        {icon && (
          <div
            className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
              color: accentColor,
            }}
          >
            {icon}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-[var(--text)] leading-tight">
              {title}
            </h4>
            {/* Priority dot */}
            <span
              className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </div>
          <p className="text-xs text-[var(--text-sub)] mt-1 leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* CTA */}
          {cta && (
            <button
              onClick={cta.onClick}
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: accentColor }}
            >
              {cta.label}
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
