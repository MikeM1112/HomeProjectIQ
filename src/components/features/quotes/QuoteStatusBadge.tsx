'use client';

import { Badge } from '@/components/ui/Badge';
import type { QuoteStatus } from '@/types/app';

const statusConfig: Record<QuoteStatus, { label: string; variant: 'warning' | 'info' | 'success' | 'gradient' | 'default' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  matched: { label: 'Pros Found', variant: 'info' },
  quoted: { label: 'Quotes Ready', variant: 'success' },
  accepted: { label: 'Accepted', variant: 'gradient' },
  expired: { label: 'Expired', variant: 'default' },
  cancelled: { label: 'Cancelled', variant: 'default' },
};

export function QuoteStatusBadge({ status }: { status: QuoteStatus }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
