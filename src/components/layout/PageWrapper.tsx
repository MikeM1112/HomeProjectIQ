'use client';

import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function PageWrapper({ children, className, animate = true }: PageWrapperProps) {
  return (
    <div
      className={cn(
        'max-w-[480px] mx-auto px-4 py-4 sm:py-6',
        animate && 'animate-rise',
        className
      )}
    >
      {children}
    </div>
  );
}
