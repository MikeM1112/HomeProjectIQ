'use client';

import { useUser } from '@/hooks/useUser';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { LEVEL_THRESHOLDS } from '@/lib/constants';
import { getLevel, getXpForNextLevel, formatCurrency } from '@/lib/utils';

export function StatsBar() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="min-w-[140px] h-24" />
        ))}
      </div>
    );
  }

  if (!user) return null;

  const level = getLevel(user.xp);
  const levelInfo = LEVEL_THRESHOLDS[level - 1];
  const xpInfo = getXpForNextLevel(user.xp);

  return (
    <div className="flex gap-[10px] overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {/* Level */}
      <Card padding="sm" className="min-w-[120px] shrink-0" style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)' }}>
        <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--text-dim)]">Level</p>
        <p className="text-[26px] font-[800] leading-tight gradient-text">{level}</p>
        <p className="text-xs text-[var(--text-sub)]">{levelInfo.label}</p>
      </Card>

      {/* XP */}
      <Card padding="sm" className="min-w-[120px] shrink-0" style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)' }}>
        <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--text-dim)]">XP</p>
        <p className="text-[26px] font-[800] leading-tight text-[var(--text)]">{user.xp}</p>
        <div className="mt-1.5 h-1.5 w-full rounded-full bg-[var(--xp-bar-bg)] overflow-hidden">
          <div
            className="h-full rounded-full animate-barGrow origin-left"
            style={{
              width: `${xpInfo.progress}%`,
              background: 'var(--xp-gradient)',
              boxShadow: '0 0 8px var(--accent-glow)',
            }}
          />
        </div>
      </Card>

      {/* Savings */}
      <Card padding="sm" className="min-w-[120px] shrink-0" style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)' }}>
        <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--text-dim)]">Savings</p>
        <p className="text-[26px] font-[800] leading-tight text-[var(--emerald)]">{formatCurrency(user.total_savings)}</p>
      </Card>

      {/* Streak */}
      <Card padding="sm" className="min-w-[120px] shrink-0" style={{ background: 'var(--glass)', borderColor: 'var(--glass-border)' }}>
        <p className="text-[10px] uppercase tracking-[0.8px] text-[var(--text-dim)]">Streak</p>
        <p className="text-[26px] font-[800] leading-tight text-[var(--gold)]">
          {user.streak} <span className="text-lg">🔥</span>
        </p>
        <p className="text-xs text-[var(--text-sub)]">days</p>
      </Card>
    </div>
  );
}
