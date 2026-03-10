'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { QuoteStatusBadge } from './QuoteStatusBadge';
import { useQuotes } from '@/hooks/useQuotes';
import { formatCurrency } from '@/lib/utils';

export function ActiveQuotes() {
  const { activeQuotes, isLoading } = useQuotes();

  if (isLoading || activeQuotes.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-serif text-lg text-[var(--text)]">Active Quotes</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          {activeQuotes.length}
        </span>
      </div>
      <div className="space-y-3">
        {activeQuotes.slice(0, 3).map((quote) => (
          <Card key={quote.id} padding="sm">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{quote.title}</p>
                <p className="text-xs text-ink-sub mt-0.5">
                  {quote.estimated_pro_lo && quote.estimated_pro_hi
                    ? `${formatCurrency(quote.estimated_pro_lo)} – ${formatCurrency(quote.estimated_pro_hi)}`
                    : 'Awaiting quotes'}
                  {quote.bid_count > 0 && ` · ${quote.bid_count} bid${quote.bid_count === 1 ? '' : 's'}`}
                </p>
              </div>
              <QuoteStatusBadge status={quote.status} />
            </div>
            {quote.project_id && (
              <Link
                href={`/project/${quote.project_id}#hire-pro`}
                className="text-xs font-medium mt-2 inline-block"
                style={{ color: 'var(--accent)' }}
              >
                View Project
              </Link>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
