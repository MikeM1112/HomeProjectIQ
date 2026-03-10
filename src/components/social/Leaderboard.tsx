'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  topSkill: string;
  isCurrentUser?: boolean;
}

const DEMO_ENTRIES: LeaderboardEntry[] = [
  { id: '1', name: 'Mike M.', xp: 2350, level: 5, topSkill: 'Plumbing', isCurrentUser: true },
  { id: '2', name: 'Sarah K.', xp: 1850, level: 4, topSkill: 'Painting' },
  { id: '3', name: 'Jake R.', xp: 1200, level: 3, topSkill: 'Electrical' },
  { id: '4', name: 'Emma L.', xp: 980, level: 3, topSkill: 'Landscaping' },
  { id: '5', name: 'Chris P.', xp: 650, level: 2, topSkill: 'Carpentry' },
];

const RANK_STYLES = [
  { badge: '\u{1F451}', color: '#FBBF24' }, // gold crown
  { badge: '\u{1F948}', color: '#C0C0C0' }, // silver
  { badge: '\u{1F949}', color: '#CD7F32' }, // bronze
];

export function Leaderboard({ entries = DEMO_ENTRIES }: { entries?: LeaderboardEntry[] }) {
  const [period, setPeriod] = useState<'all' | 'month' | 'week'>('all');
  const sorted = [...entries].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-bold text-ink">Leaderboard</h3>
        <div className="flex gap-1">
          {(['all', 'month', 'week'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`tag pressable text-[10px] ${period === p ? 'gradient-accent text-white' : 'bg-surface-3 text-ink-sub'}`}
            >
              {p === 'all' ? 'All Time' : p === 'month' ? 'Month' : 'Week'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((entry, i) => {
          const rankStyle = RANK_STYLES[i];
          return (
            <Card
              key={entry.id}
              className={`glass glass-sm shadow-[var(--card-shadow)] ${entry.isCurrentUser ? 'border border-brand' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 text-center">
                  {rankStyle ? (
                    <span className="text-lg">{rankStyle.badge}</span>
                  ) : (
                    <span className="text-sm font-bold text-ink-dim">#{i + 1}</span>
                  )}
                </div>
                <Avatar name={entry.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${entry.isCurrentUser ? 'text-brand' : 'text-ink'}`}>
                    {entry.name} {entry.isCurrentUser && '(You)'}
                  </p>
                  <p className="text-xs text-ink-dim">
                    Lv.{entry.level} — Best: {entry.topSkill}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-ink">{entry.xp.toLocaleString()}</p>
                  <p className="text-[10px] text-ink-dim">XP</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
