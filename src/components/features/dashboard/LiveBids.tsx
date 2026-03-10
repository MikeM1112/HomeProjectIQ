'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ContractorBid } from '@/lib/demo-data';

interface LiveBidsProps {
  bids: ContractorBid[];
  projectTitle?: string;
  onSelect?: (bid: ContractorBid) => void;
}

export function LiveBids({ bids, projectTitle = 'Ceiling Fan Installation', onSelect }: LiveBidsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          📸 Live Bids
        </h3>
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: 'var(--emerald)' }}
          />
          <span className="text-[11px] font-medium" style={{ color: 'var(--emerald)' }}>
            {bids.length} bids
          </span>
        </div>
      </div>
      <p className="text-xs mb-3" style={{ color: 'var(--text-dim)' }}>
        For: {projectTitle}
      </p>

      <div className="space-y-2">
        {bids.map((bid) => (
          <Card key={bid.id} padding="sm" variant="interactive">
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--glass)' }}
              >
                {bid.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                    {bid.companyName}
                  </p>
                  {bid.verified && (
                    <span className="text-[10px] px-1 py-0.5 rounded" style={{ background: 'var(--info-soft)', color: 'var(--info)' }}>
                      &#10003;
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px]" style={{ color: 'var(--gold)' }}>
                    {'★'.repeat(Math.floor(bid.rating))} {bid.rating}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                    ({bid.reviewCount})
                  </span>
                </div>
                {bid.friendRecommended && (
                  <p className="text-[10px] mt-1" style={{ color: 'var(--accent)' }}>
                    👤 Recommended by {bid.friendName}
                  </p>
                )}
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                  {bid.responseTime} &middot; ~{bid.estimatedDays} day{bid.estimatedDays > 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-bold" style={{ color: 'var(--text)' }}>
                  ${(bid.bidAmount / 100).toFixed(0)}
                </p>
                <Button
                  size="sm"
                  className="mt-1.5 text-[10px] !px-2.5 !py-1"
                  onClick={() => onSelect?.(bid)}
                >
                  Select
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
