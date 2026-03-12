'use client';

import { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const paddingMap = {
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
} as const;

export function GlassPanel({
  children,
  className,
  padding = 'md',
  hover = false,
  onClick,
}: GlassPanelProps) {
  const motionProps: HTMLMotionProps<'div'> = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" },
    ...(hover
      ? {
          whileHover: {
            borderColor: 'var(--glass-border-hover)',
            scale: 1.01,
          },
        }
      : {}),
    ...(onClick
      ? {
          whileTap: { scale: 0.98 },
        }
      : {}),
  };

  return (
    <motion.div
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        'rounded-[20px] bg-[var(--glass)] backdrop-blur-[16px] border border-[var(--glass-border)] shadow-[var(--card-shadow)] transition-all duration-300',
        hover &&
          'cursor-pointer hover:border-[var(--glass-border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        onClick && 'cursor-pointer',
        paddingMap[padding],
        className
      )}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
