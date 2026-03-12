'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface SecondaryCTAProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export function SecondaryCTA({
  children,
  onClick,
  href,
  icon,
  loading = false,
  disabled = false,
  fullWidth = false,
  className,
}: SecondaryCTAProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-sm text-[var(--text)] bg-transparent border border-[var(--glass-border)] backdrop-blur-[16px] shadow-[var(--card-shadow)] transition-all duration-200',
    'hover:border-[var(--glass-border-hover)] hover:bg-[var(--glass)] hover:shadow-[var(--card-shadow-hover)]',
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
    className
  );

  const inner = (
    <>
      {loading && <Spinner size="sm" />}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <motion.div
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        className={fullWidth ? 'w-full' : 'inline-block'}
      >
        <Link href={href} className={classes}>
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={!disabled && !loading ? { scale: 0.97 } : undefined}
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      className={classes}
    >
      {inner}
    </motion.button>
  );
}
