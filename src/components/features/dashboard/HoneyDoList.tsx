'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import type { HoneyDoItem } from '@/lib/demo-data';

interface HoneyDoListProps {
  items: HoneyDoItem[];
  onToggle?: (id: string) => void;
}

const PRIORITY_STYLES = {
  high: { bg: 'var(--danger-soft)', color: 'var(--danger)', label: 'Urgent' },
  medium: { bg: 'var(--gold-soft)', color: 'var(--gold)', label: 'Soon' },
  low: { bg: 'var(--emerald-soft)', color: 'var(--emerald)', label: 'Whenever' },
};

export function HoneyDoList({ items: initialItems, onToggle }: HoneyDoListProps) {
  const [items, setItems] = useState(initialItems);
  const pending = items.filter((i) => !i.done);
  const done = items.filter((i) => i.done);

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
    onToggle?.(id);
  };

  const formatDate = (d: string | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          💌 Honey-Do List
        </h3>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
        >
          {pending.length} pending
        </span>
      </div>
      <div className="space-y-2">
        {pending.map((item) => {
          const p = PRIORITY_STYLES[item.priority];
          return (
            <Card key={item.id} padding="sm" variant="interactive">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggle(item.id)}
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{ borderColor: p.color }}
                  aria-label={`Mark "${item.title}" as done`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{item.icon}</span>
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
                      {item.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px]">{item.assignedByAvatar}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                      From {item.assignedBy}
                    </span>
                    {item.dueDate && (
                      <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                        &middot; Due {formatDate(item.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: p.bg, color: p.color }}
                >
                  {p.label}
                </span>
              </div>
            </Card>
          );
        })}
        {done.length > 0 && (
          <div className="mt-3 opacity-50">
            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-dim)' }}>
              Completed
            </p>
            {done.map((item) => (
              <Card key={item.id} padding="sm" className="mb-1.5">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(item.id)}
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}
                    aria-label={`Unmark "${item.title}"`}
                  >
                    <span className="text-xs">&#10003;</span>
                  </button>
                  <span className="text-sm line-through" style={{ color: 'var(--text-dim)' }}>
                    {item.icon} {item.title}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
