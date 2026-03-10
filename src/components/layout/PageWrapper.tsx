'use client';

import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  withGlow?: boolean;
}

export function PageWrapper({ children, className, animate = true, withGlow = false }: PageWrapperProps) {
  return (
    <div
      className={cn(
        'max-w-[480px] mx-auto px-4 py-4 sm:py-6 relative',
        animate && 'animate-rise',
        className
      )}
      style={{ background: 'transparent' }}
    >
      {withGlow && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-30 blur-[100px] pointer-events-none -z-10 animate-glow-pulse"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
      )}
      {children}
    </div>
  );
}
