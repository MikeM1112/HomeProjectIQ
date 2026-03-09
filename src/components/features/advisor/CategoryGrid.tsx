'use client';

import { CATEGORIES } from '@/lib/project-data';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

interface CategoryGridProps {
  onClick: (categoryId: string) => void;
  loading?: boolean;
}

export function CategoryGrid({ onClick, loading }: CategoryGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {CATEGORIES.map((cat, i) => (
        <Card
          key={cat.id}
          variant="interactive"
          padding="sm"
          onClick={() => onClick(cat.id)}
          className={cn('r' + Math.min(i, 5), 'animate-rise opacity-0')}
        >
          <div style={{ borderLeftColor: cat.clr }} className="border-l-4 -ml-3 pl-2.5 py-0.5 rounded-l">
            <span className="text-[28px] leading-none">{cat.icon}</span>
            <p className="mt-1 text-sm font-semibold text-[var(--ink)]">{cat.label}</p>
            <p className="text-[11px] text-[var(--ink-sub)] leading-tight">{cat.sub}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
