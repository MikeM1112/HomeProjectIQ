'use client';

import { Card } from '@/components/ui/Card';
import type { LeaderboardEntry } from '@/lib/demo-data';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const RANK_STYLES: Record<number, { bg: string; emoji: string }> = {
  1: { bg: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', emoji: '🥇' },
  2: { bg: 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)', emoji: '🥈' },
  3: { bg: 'linear-gradient(135deg, #CD7F32 0%, #B8690F 100%)', emoji: '🥉' },
};

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          🏆 Handiness Leaderboard
        </h3>
        <span className="text-[11px] font-medium" style={{ color: 'var(--text-dim)' }}>
          Your friends
        </span>
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-3 mb-4">
        {[entries[1], entries[0], entries[2]].filter(Boolean).map((entry, i) => {
          const heights = ['h-20', 'h-28', 'h-16'];
          const rank = entry.rank;
          const rs = RANK_STYLES[rank] ?? { bg: 'var(--glass)', emoji: '' };
          return (
            <div key={entry.name} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{entry.avatar}</span>
              <span className="text-[10px] font-semibold" style={{ color: 'var(--text)' }}>
                {entry.name.split(' ')[0]}
              </span>
              <div
                className={`w-16 ${heights[i]} rounded-t-xl flex flex-col items-center justify-center`}
                style={{
                  background: rs.bg,
                  opacity: entry.isCurrentUser ? 1 : 0.85,
                }}
              >
                <span className="text-lg">{rs.emoji}</span>
                <span className="text-[10px] font-bold text-white">{entry.xp.toLocaleString()} XP</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rest of leaderboard */}
      <div className="space-y-1.5">
        {entries.slice(3).map((entry) => (
          <Card
            key={entry.name}
            padding="sm"
            className={entry.isCurrentUser ? 'ring-1 ring-[var(--accent)]' : ''}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: 'var(--glass)', color: 'var(--text-sub)' }}
              >
                {entry.rank}
              </span>
              <span className="text-lg">{entry.avatar}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="text-[10px] ml-1" style={{ color: 'var(--accent)' }}>(You)</span>
                  )}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                  Lvl {entry.level} {entry.levelLabel} &middot; {entry.projectCount} projects &middot; {entry.topSkill}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
                  {entry.xp.toLocaleString()} XP
                </p>
                <p className="text-[10px]" style={{ color: 'var(--emerald)' }}>
                  ${entry.savings} saved
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
