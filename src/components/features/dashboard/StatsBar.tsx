'use client';

import { useUser } from '@/hooks/useUser';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';
import { Skeleton } from '@/components/ui/Skeleton';
import { LEVEL_THRESHOLDS } from '@/lib/constants';
import { getLevel, getXpForNextLevel, formatCurrency } from '@/lib/utils';

export function StatsBar() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="min-w-[140px] h-20" />
        ))}
      </div>
    );
  }

  if (!user) return null;

  const level = getLevel(user.xp);
  const levelInfo = LEVEL_THRESHOLDS[level - 1];
  const xpInfo = getXpForNextLevel(user.xp);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      <Card padding="sm" className="min-w-[130px] shrink-0">
        <p className="text-[10px] text-ink-dim uppercase tracking-wider">Level</p>
        <p className="text-2xl font-bold text-brand">{level}</p>
        <p className="text-xs text-ink-sub">{levelInfo.label}</p>
      </Card>
      <Card padding="sm" className="min-w-[140px] shrink-0">
        <p className="text-[10px] text-ink-dim uppercase tracking-wider">XP</p>
        <p className="text-lg font-bold">{user.xp}</p>
        <Progress value={xpInfo.progress} />
      </Card>
      <Card padding="sm" className="min-w-[130px] shrink-0">
        <p className="text-[10px] text-ink-dim uppercase tracking-wider">Savings</p>
        <p className="text-lg font-bold text-success">{formatCurrency(user.total_savings)}</p>
      </Card>
      <Card padding="sm" className="min-w-[110px] shrink-0">
        <p className="text-[10px] text-ink-dim uppercase tracking-wider">Streak</p>
        <p className="text-lg font-bold">{user.streak}</p>
        <p className="text-xs text-ink-sub">days</p>
      </Card>
    </div>
  );
}
