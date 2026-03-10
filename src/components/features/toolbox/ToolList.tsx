'use client';

import { useState } from 'react';
import type { ToolboxItem } from '@/types/app';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TOOLS } from '@/lib/constants';

interface ToolListProps {
  tools: ToolboxItem[];
  onRemove: (toolId: string) => void;
  lentOutIds?: string[];
}

export function ToolList({ tools, onRemove, lentOutIds = [] }: ToolListProps) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const grouped = tools.reduce<Record<string, ToolboxItem[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});

  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🧰</p>
        <p className="text-[var(--ink-sub)] text-sm">Your toolbox is empty.</p>
        <p className="text-[var(--ink-dim)] text-xs mt-1">Add tools to track what you own.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="font-serif text-sm font-semibold text-[var(--ink-sub)] mb-2">
            {category} ({items.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => {
              const def = TOOLS.find((t) => t.id === item.tool_id);
              const isLentOut = lentOutIds.includes(item.tool_id);
              return (
                <Card key={item.tool_id} padding="sm" className="relative">
                  <span className="text-xl">{def?.emoji ?? '🔧'}</span>
                  <p className="text-xs font-medium mt-1 text-[var(--ink)]">{item.tool_name}</p>
                  {isLentOut && (
                    <span className="absolute top-1.5 left-1.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-[var(--warning)]/15 text-[var(--warning)]">
                      Out
                    </span>
                  )}
                  {confirmId === item.tool_id ? (
                    <div className="absolute inset-0 glass rounded-[20px] flex items-center justify-center gap-2 animate-fade shadow-[var(--card-shadow)]">
                      <Button variant="destructive" size="sm" onClick={() => { onRemove(item.tool_id); setConfirmId(null); }}>
                        Remove
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)}>
                        Keep
                      </Button>
                    </div>
                  ) : !isLentOut ? (
                    <button
                      onClick={() => setConfirmId(item.tool_id)}
                      className="absolute top-1 right-1 text-[var(--ink-dim)] hover:text-[var(--red)] text-xs"
                      aria-label={`Remove ${item.tool_name}`}
                    >
                      &times;
                    </button>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
