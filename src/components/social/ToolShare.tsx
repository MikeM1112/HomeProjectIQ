'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

interface ToolLend {
  id: string;
  toolName: string;
  borrowerName: string;
  borrowerAvatar?: string;
  lentAt: string;
  dueDate: string;
  isOverdue: boolean;
}

interface ToolBorrow {
  id: string;
  toolName: string;
  lenderName: string;
  lenderAvatar?: string;
  borrowedAt: string;
  dueDate: string;
  isOverdue: boolean;
}

const DEMO_LENT: ToolLend[] = [
  { id: '1', toolName: 'Circular Saw', borrowerName: 'Jake R.', lentAt: '2026-03-01', dueDate: '2026-03-15', isOverdue: false },
  { id: '2', toolName: 'Stud Finder', borrowerName: 'Sarah K.', lentAt: '2026-02-20', dueDate: '2026-03-05', isOverdue: true },
];

const DEMO_BORROWED: ToolBorrow[] = [
  { id: '3', toolName: 'Pressure Washer', lenderName: 'Emma L.', borrowedAt: '2026-03-08', dueDate: '2026-03-22', isOverdue: false },
];

export function ToolShareHub() {
  const [tab, setTab] = useState<'lent' | 'borrowed'>('lent');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-bold text-ink">Tool Share</h3>
        <Button size="sm" variant="ghost">+ Lend Tool</Button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setTab('lent')}
          className={`tag pressable ${tab === 'lent' ? 'gradient-accent text-white' : 'bg-surface-3 text-ink-sub'}`}
        >
          Lent Out ({DEMO_LENT.length})
        </button>
        <button
          onClick={() => setTab('borrowed')}
          className={`tag pressable ${tab === 'borrowed' ? 'gradient-accent text-white' : 'bg-surface-3 text-ink-sub'}`}
        >
          Borrowed ({DEMO_BORROWED.length})
        </button>
      </div>

      {tab === 'lent' && (
        <div className="space-y-2">
          {DEMO_LENT.map((item) => (
            <Card key={item.id} className={`glass glass-sm ${item.isOverdue ? 'border border-danger' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{'\u{1F527}'}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{item.toolName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Avatar name={item.borrowerName} size="sm" />
                    <span className="text-xs text-ink-sub">{item.borrowerName}</span>
                    <span className="text-[10px] text-ink-dim">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {item.isOverdue && (
                  <span className="tag text-[10px] bg-danger-soft text-danger" style={{ padding: '1px 6px' }}>Overdue</span>
                )}
                <Button size="sm" variant="ghost">Return</Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'borrowed' && (
        <div className="space-y-2">
          {DEMO_BORROWED.map((item) => (
            <Card key={item.id} className="glass glass-sm">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{'\u{1F6E0}\uFE0F'}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink">{item.toolName}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-ink-sub">From: {item.lenderName}</span>
                    <span className="text-[10px] text-ink-dim">
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button size="sm">Return</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
