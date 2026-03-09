'use client';

import { BADGE_DEFINITIONS } from '@/lib/constants';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';

export function BadgeShowcase() {
  const { user } = useUser();
  const earnedBadges = user?.badges ?? [];

  return (
    <div className="grid grid-cols-5 gap-2">
      {BADGE_DEFINITIONS.map((badge) => {
        const earned = earnedBadges.includes(badge.id);
        return (
          <div
            key={badge.id}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all',
              earned
                ? 'bg-[var(--accent-lt)] glow-accent'
                : 'bg-[var(--muted)] opacity-40'
            )}
            title={earned ? badge.label : badge.condition}
          >
            <span className="text-2xl">{badge.icon}</span>
            <span className="text-[10px] leading-tight font-medium text-[var(--ink-sub)]">
              {badge.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
