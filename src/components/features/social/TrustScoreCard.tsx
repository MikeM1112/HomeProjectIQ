'use client';

import { Card } from '@/components/ui/Card';
import { useTrustScore } from '@/hooks/useIntelligence';

export function TrustScoreCard({ userId }: { userId?: string }) {
  const { trustScore, isLoading } = useTrustScore(userId);

  if (isLoading) return <Card><div className="text-sm text-[var(--text-sub)]">Loading trust score...</div></Card>;
  if (!trustScore) return null;

  const trustColor = trustScore.trust_level === 'high' ? 'var(--success)'
    : trustScore.trust_level === 'medium' ? 'var(--warning)'
    : 'var(--danger)';

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[var(--text)]">Trust Score</h4>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold" style={{ color: trustColor }}>
              {trustScore.overall_score}
            </span>
            <span className="text-[10px] text-[var(--text-sub)]">/100</span>
          </div>
        </div>

        {/* Trust bar */}
        <div className="w-full h-2 rounded-full bg-[var(--glass-border)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${trustScore.overall_score}%`, background: trustColor }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-sub)]">As Lender</p>
            <p className="text-sm font-semibold text-[var(--text)]">{trustScore.lender.total_loans} loans</p>
            {trustScore.lender.active_loans > 0 && (
              <p className="text-[10px] text-[var(--text-sub)]">{trustScore.lender.active_loans} active</p>
            )}
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-sub)]">As Borrower</p>
            <p className="text-sm font-semibold text-[var(--text)]">{trustScore.borrower.on_time_percent}% on-time</p>
            <p className="text-[10px] text-[var(--text-sub)]">{trustScore.borrower.returned} returned</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
