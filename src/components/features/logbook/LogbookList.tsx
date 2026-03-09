'use client';

import type { LogbookEntry } from '@/types/app';
import { LogbookEntryCard } from './LogbookEntry';
import { Skeleton } from '@/components/ui/Skeleton';

interface LogbookListProps {
  entries: LogbookEntry[];
  loading: boolean;
  onDelete: (id: string) => void;
  onAddEntry: () => void;
}

function groupByMonth(entries: LogbookEntry[]): Record<string, LogbookEntry[]> {
  const groups: Record<string, LogbookEntry[]> = {};
  for (const entry of entries) {
    const d = new Date(entry.repair_date);
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(entry);
  }
  return groups;
}

export function LogbookList({ entries, loading, onDelete, onAddEntry }: LogbookListProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="card" className="h-20" />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">📋</p>
        <p className="text-ink-sub text-sm">No logbook entries yet.</p>
        <button
          onClick={onAddEntry}
          className="mt-3 px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg tap"
        >
          Log Your First Repair
        </button>
      </div>
    );
  }

  const grouped = groupByMonth(entries);

  return (
    <div className="space-y-6 pb-20">
      {Object.entries(grouped).map(([month, items]) => (
        <div key={month}>
          <h3 className="font-serif text-base font-semibold text-ink mb-3">{month}</h3>
          <div className="space-y-2">
            {items.map((entry) => (
              <LogbookEntryCard key={entry.id} entry={entry} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={onAddEntry}
        className="fixed bottom-20 right-4 sm:right-auto sm:left-1/2 sm:translate-x-[200px] w-14 h-14 bg-brand text-white rounded-full shadow-lg flex items-center justify-center text-2xl tap z-30"
        aria-label="Add entry"
      >
        +
      </button>
    </div>
  );
}
