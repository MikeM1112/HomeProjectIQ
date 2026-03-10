'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { QuoteStatusBadge } from './QuoteStatusBadge';
import type { QuoteRequest } from '@/types/app';

interface QuoteTrackerProps {
  quote: QuoteRequest;
  onCancel: () => void;
  isCancelling?: boolean;
}

const STEPS: { status: string; label: string }[] = [
  { status: 'pending', label: 'Submitted' },
  { status: 'matched', label: 'Pros Found' },
  { status: 'quoted', label: 'Quotes Ready' },
  { status: 'accepted', label: 'Accepted' },
];

export function QuoteTracker({ quote, onCancel, isCancelling }: QuoteTrackerProps) {
  const currentIndex = STEPS.findIndex((s) => s.status === quote.status);
  const isActive = currentIndex >= 0 && currentIndex < STEPS.length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ink">Quote Status</h3>
        <QuoteStatusBadge status={quote.status} />
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-1 mb-3">
        {STEPS.map((step, i) => (
          <div key={step.status} className="flex-1 flex items-center gap-1">
            <div
              className="h-1.5 flex-1 rounded-full transition-all"
              style={{
                background: i <= currentIndex ? 'var(--accent)' : 'var(--border)',
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-ink-sub">
        <span>
          {quote.bid_count > 0
            ? `${quote.bid_count} bid${quote.bid_count === 1 ? '' : 's'} received`
            : 'Waiting for pros to respond'}
        </span>
        <span>{quote.preferred_timeline.replace('_', ' ')}</span>
      </div>

      {isActive && quote.status !== 'accepted' && (
        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full"
          onClick={onCancel}
          loading={isCancelling}
        >
          Cancel Request
        </Button>
      )}
    </Card>
  );
}
