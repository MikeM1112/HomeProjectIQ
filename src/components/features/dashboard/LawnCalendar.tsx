'use client';

import { Card } from '@/components/ui/Card';
import type { LawnCalendarItem } from '@/lib/demo-data';

interface LawnCalendarProps {
  items: LawnCalendarItem[];
}

const CATEGORY_ICONS: Record<string, string> = {
  seeding: '🌱',
  fertilizing: '🧪',
  mowing: '🌿',
  aerating: '🔧',
  watering: '💦',
  pest: '🛡️',
  general: '📋',
};

export function LawnCalendar({ items }: LawnCalendarProps) {
  const now = new Date();
  const currentMonth = now.toLocaleString('en-US', { month: 'short' });
  const thisMonthItems = items.filter((i) => i.month === currentMonth);
  const futureItems = items.filter((i) => i.month !== currentMonth);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          📅 Lawn & Garden Calendar
        </h3>
      </div>
      <p className="text-[11px] mb-3" style={{ color: 'var(--text-dim)' }}>
        AI-recommended best times based on your zone, soil temp, and weather.
      </p>

      {/* This month's actions */}
      {thisMonthItems.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>
            🔥 Do This Month
          </p>
          <div className="space-y-2">
            {thisMonthItems.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-xl border p-3"
                style={{ borderColor: 'var(--glass-border)', background: 'var(--bg-deep)' }}
              >
                <div
                  className="absolute -top-8 -right-8 w-20 h-20 rounded-full opacity-[0.08] blur-[30px] pointer-events-none"
                  style={{ background: item.accent }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{ background: item.accentBg, color: item.accent }}
                    >
                      {item.bestWindow}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {CATEGORY_ICONS[item.category]} {item.category}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
                    {item.icon} {item.title}
                  </p>
                  <p className="text-[11px] leading-relaxed mb-1.5" style={{ color: 'var(--text-sub)' }}>
                    {item.description}
                  </p>
                  <div className="flex items-center gap-1.5 p-1.5 rounded-lg" style={{ background: 'var(--glass)' }}>
                    <span className="text-[10px]">🎯</span>
                    <span className="text-[10px] font-medium" style={{ color: item.accent }}>
                      Why now: {item.whyNow}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming */}
      {futureItems.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-dim)' }}>
            Upcoming
          </p>
          <div className="space-y-1.5">
            {futureItems.map((item) => (
              <Card key={item.id} padding="sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: item.accentBg }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.title}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      {item.month} &middot; {item.bestWindow}
                    </p>
                  </div>
                  <span
                    className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                    style={{ background: item.accentBg, color: item.accent }}
                  >
                    {item.category}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
