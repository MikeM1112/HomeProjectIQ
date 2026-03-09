'use client';

import { useUser } from '@/hooks/useUser';
import { Progress } from '@/components/ui/Progress';
import { LEVEL_THRESHOLDS } from '@/lib/constants';
import { getLevel, getXpForNextLevel } from '@/lib/utils';

export function XPProgress() {
  const { user } = useUser();
  if (!user) return null;

  const level = getLevel(user.xp);
  const levelInfo = LEVEL_THRESHOLDS[level - 1];
  const xpInfo = getXpForNextLevel(user.xp);
  const nextLevel = level < 5 ? LEVEL_THRESHOLDS[level] : null;

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-lg text-[var(--ink)]">
          Level <span className="gradient-text">{level}</span>: {levelInfo.label}
        </h3>
        <span className="text-xs text-[var(--ink-sub)]">{user.xp} XP</span>
      </div>
      <Progress value={xpInfo.progress} gradient animated />
      {nextLevel && (
        <p className="text-xs text-[var(--ink-dim)]">
          {xpInfo.needed - xpInfo.current} XP to {nextLevel.label}
        </p>
      )}
    </div>
  );
}
