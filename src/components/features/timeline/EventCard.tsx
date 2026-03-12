'use client';

import { Card } from '@/components/ui/Card';
import type { TimelineEvent } from '@/types/app';

const TYPE_ICONS: Record<string, string> = {
  repair: '🔧',
  maintenance: '🔄',
  inspection: '🔍',
  purchase: '🛒',
  warranty: '📄',
  incident: '⚡',
  upgrade: '⬆️',
  other: '📋',
};

export function EventCard({ event }: { event: TimelineEvent }) {
  const icon = TYPE_ICONS[event.event_type] ?? '📋';
  const date = new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Card padding="sm">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center text-sm">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--text)] truncate">{event.title}</p>
            <span className="text-xs text-[var(--text-sub)] flex-shrink-0 ml-2">{date}</span>
          </div>
          {event.description && (
            <p className="text-xs text-[var(--text-sub)] mt-0.5 line-clamp-2">{event.description}</p>
          )}
          {event.cost != null && event.cost > 0 && (
            <span className="text-xs text-[var(--accent)] mt-1 inline-block">${event.cost.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Card>
  );
}
