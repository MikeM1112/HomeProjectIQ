'use client';

import { useTimeline } from '@/hooks/useTimeline';
import { EventCard } from './EventCard';

export function TimelineView({ propertyId }: { propertyId?: string }) {
  const { events, isLoading } = useTimeline(propertyId);

  if (isLoading) return <div className="text-sm text-[var(--text-sub)]">Loading timeline...</div>;

  if (events.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl">📅</span>
        <p className="text-[var(--text)] font-semibold mt-3">No events yet</p>
        <p className="text-sm text-[var(--text-sub)] mt-1">Your home history will appear here</p>
      </div>
    );
  }

  // Group events by month
  const grouped = events.reduce<Record<string, typeof events>>((acc, event) => {
    const date = new Date(event.event_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(event);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([monthKey, monthEvents]) => {
        const [year, month] = monthKey.split('-');
        const label = new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return (
          <div key={monthKey}>
            <h3 className="text-sm font-semibold text-[var(--text-sub)] mb-2">{label}</h3>
            <div className="space-y-2 border-l-2 border-[var(--glass-border)] pl-4">
              {monthEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
