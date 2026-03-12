'use client';

import { Card } from '@/components/ui/Card';
import { useHandyProfiles } from '@/hooks/useSocial';

const MEDAL = ['🥇', '🥈', '🥉'];

export function LeaderboardCard() {
  const { profiles, isLoading } = useHandyProfiles();

  if (isLoading) return null;

  const sorted = [...profiles]
    .sort((a, b) => (b.repairs_helped + b.tools_lent_count) - (a.repairs_helped + a.tools_lent_count))
    .slice(0, 10);

  if (sorted.length === 0) {
    return (
      <Card padding="md" className="text-center">
        <span className="text-3xl">🏆</span>
        <h3 className="font-semibold text-[var(--text)] mt-2 text-sm">Community Leaderboard</h3>
        <p className="text-xs text-[var(--text-sub)] mt-1">Be the first to join!</p>
      </Card>
    );
  }

  return (
    <Card padding="md">
      <h3 className="font-semibold text-[var(--text)] text-sm mb-3">Community Leaderboard</h3>
      <div className="space-y-2">
        {sorted.map((profile, i) => (
          <div key={profile.id} className="flex items-center gap-2">
            <span className="w-6 text-center text-sm">{MEDAL[i] ?? `${i + 1}`}</span>
            <div className="w-7 h-7 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center text-xs font-bold text-[var(--text)]">
              {(profile.display_name?.[0] ?? '?').toUpperCase()}
            </div>
            <span className="flex-1 text-sm text-[var(--text)] truncate">{profile.display_name ?? 'Anonymous'}</span>
            <span className="text-xs text-[var(--text-sub)]">{profile.repairs_helped + profile.tools_lent_count} pts</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
