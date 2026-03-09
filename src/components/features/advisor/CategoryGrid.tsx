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
          className={cn('r' + Math.min(i, 5), 'animate-rise opacity-0 transition-all duration-200 hover:-translate-y-[2px]')}
          style={{
            background: 'var(--glass)',
            borderLeft: `4px solid ${cat.clr}`,
            boxShadow: 'var(--shadow)',
          }}
        >
          <div className="pl-1 py-0.5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-1.5"
              style={{ background: 'var(--icon-bg)' }}
            >
              <span className="text-[22px] leading-none">{cat.icon}</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text)]">{cat.label}</p>
            <p className="text-[11px] text-[var(--text-sub)] leading-tight">{cat.sub}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
