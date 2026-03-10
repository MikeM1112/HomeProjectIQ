'use client';

import { Card } from '@/components/ui/Card';
import { useUIStore } from '@/stores/uiStore';
import type { LastDoneItem } from '@/lib/demo-data';

interface LastDoneTrackerProps {
  items: LastDoneItem[];
}

function getDaysColor(days: number, frequency: string): string {
  // Simple heuristic: if days > ~80% of stated frequency, it's concerning
  if (frequency.includes('Monthly') && days > 25) return 'var(--danger)';
  if (frequency.includes('6 weeks') && days > 35) return 'var(--gold)';
  if (frequency.includes('90 days') && days > 70) return 'var(--gold)';
  if (frequency.includes('Twice a year') && days > 150) return 'var(--gold)';
  if (frequency.includes('Yearly') && days > 300) return 'var(--gold)';
  if (days > 180) return 'var(--danger)';
  return 'var(--emerald)';
}

function formatDaysAgo(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  if (days < 365) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 365)} year${Math.floor(days / 365) > 1 ? 's' : ''} ago`;
}

export function LastDoneTracker({ items }: LastDoneTrackerProps) {
  const { showToast } = useUIStore();
  const sorted = [...items].sort((a, b) => b.daysSince - a.daysSince);
  const partnerItems = items.filter((i) => i.partnerRelevant);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          ⏱️ Last Time You...
        </h3>
      </div>
      <p className="text-[11px] mb-3" style={{ color: 'var(--text-dim)' }}>
        Track when you last did key tasks. Never forget again.
      </p>

      <div className="space-y-2">
        {sorted.map((item) => {
          const c = getDaysColor(item.daysSince, item.frequency);
          return (
            <Card key={item.id} padding="sm">
              <div className="flex items-center gap-3">
                <span className="text-xl shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    {item.title}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                    {item.category} &middot; {item.frequency}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-bold" style={{ color: c }}>
                    {formatDaysAgo(item.daysSince)}
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                    {new Date(item.lastDone).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Partner services hint */}
      {partnerItems.length > 0 && (
        <div
          className="mt-3 p-3 rounded-xl border border-[var(--glass-border)]"
          style={{ background: 'var(--glass)' }}
        >
          <p className="text-[11px] font-semibold mb-1" style={{ color: 'var(--accent)' }}>
            🔔 Smart Reminders Available
          </p>
          <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            {partnerItems.length} items can be auto-scheduled with delivery & service partners
            (filter delivery, lawn care, HVAC service).
            {' '}
            <button
              onClick={() => showToast('Sign up to enable auto-reminders!', 'info')}
              className="font-semibold inline"
              style={{ color: 'var(--accent)' }}
            >
              Enable auto-reminders &rarr;
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
