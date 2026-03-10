'use client';

import { useUser } from '@/hooks/useUser';
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
    <div
      className="space-y-2 rounded-[20px] p-4 border border-[var(--glass-border)] backdrop-blur-[16px] shadow-[var(--card-shadow)]"
      style={{ background: 'var(--glass)' }}
    >
      <div className="flex items-baseline justify-between">
        <h3 className="font-serif text-lg text-[var(--text)]">
          Level <span className="gradient-text">{level}</span>: {levelInfo.label}
        </h3>
        <span className="text-xs font-semibold text-[var(--text-sub)]">{user.xp} XP</span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: '10px', background: 'var(--xp-bar-bg)' }}
      >
        <div
          className="h-full rounded-full animate-barGrow origin-left transition-[width] duration-[600ms] ease-in-out"
          style={{
            width: `${xpInfo.progress}%`,
            background: 'var(--xp-gradient)',
            boxShadow: '0 0 16px var(--accent-glow)',
          }}
          role="progressbar"
          aria-valuenow={xpInfo.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {nextLevel && (
        <p style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
          {xpInfo.needed - xpInfo.current} XP to {nextLevel.label}
        </p>
      )}
    </div>
  );
}
