'use client';

import { useState } from 'react';
import { CATEGORIES } from '@/lib/project-data';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { LogbookEntry as LogbookEntryType } from '@/types/app';

interface LogbookEntryProps {
  entry: LogbookEntryType;
  onDelete: (id: string) => void;
}

export function LogbookEntryCard({ entry, onDelete }: LogbookEntryProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const cat = CATEGORIES.find((c) => c.id === entry.category_id);

  const laborBadge = {
    diy: { variant: 'success' as const, label: 'DIY' },
    hired_pro: { variant: 'info' as const, label: 'Hired Pro' },
    warranty: { variant: 'default' as const, label: 'Warranty' },
  }[entry.labor_type];

  return (
    <Card padding="sm" className="relative">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{cat?.icon ?? '🔧'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">{entry.title}</p>
            <Badge variant={laborBadge.variant}>{laborBadge.label}</Badge>
          </div>
          <p className="text-xs text-ink-dim">{formatDate(entry.repair_date)}</p>
          {entry.cost !== null && entry.cost > 0 && (
            <p className="text-xs font-mono text-ink-sub mt-0.5">{formatCurrency(entry.cost)}</p>
          )}
          {entry.notes && (
            <p className="text-xs text-ink-sub mt-1 line-clamp-2">{entry.notes}</p>
          )}
        </div>
        <button
          onClick={() => setShowConfirm(true)}
          className="text-ink-dim hover:text-danger text-lg shrink-0"
          aria-label="Delete entry"
        >
          &times;
        </button>
      </div>
      {showConfirm && (
        <div className="absolute inset-0 bg-white/95 rounded-xl flex items-center justify-center gap-3 animate-fade">
          <p className="text-sm">Delete?</p>
          <Button variant="destructive" size="sm" onClick={() => onDelete(entry.id)}>
            Yes
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowConfirm(false)}>
            No
          </Button>
        </div>
      )}
    </Card>
  );
}
