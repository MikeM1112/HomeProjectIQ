'use client';

import { Card } from '@/components/ui/Card';
import type { ToolLoan } from '@/lib/demo-data';

interface ToolLendingProps {
  loans: ToolLoan[];
}

const STATUS_STYLES = {
  out: { bg: 'var(--info-soft)', color: 'var(--info)', label: 'Lent Out' },
  overdue: { bg: 'var(--danger-soft)', color: 'var(--danger)', label: 'Overdue' },
  returned: { bg: 'var(--emerald-soft)', color: 'var(--emerald)', label: 'Returned' },
};

export function ToolLending({ loans }: ToolLendingProps) {
  const active = loans.filter((l) => l.status !== 'returned');
  const returned = loans.filter((l) => l.status === 'returned');

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          🤝 Tool Lending
        </h3>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: active.some((l) => l.status === 'overdue')
              ? 'var(--danger-soft)'
              : 'var(--info-soft)',
            color: active.some((l) => l.status === 'overdue')
              ? 'var(--danger)'
              : 'var(--info)',
          }}
        >
          {active.length} out
        </span>
      </div>
      <div className="space-y-2">
        {active.map((loan) => {
          const s = STATUS_STYLES[loan.status];
          return (
            <Card key={loan.id} padding="sm">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: s.bg }}
                >
                  {loan.toolEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    {loan.toolName}
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                    {loan.borrowerAvatar} {loan.borrowerName} &middot; Since {formatDate(loan.lentDate)}
                  </p>
                </div>
                <span
                  className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.label}
                </span>
              </div>
            </Card>
          );
        })}
        {returned.length > 0 && (
          <p className="text-[11px] mt-2" style={{ color: 'var(--text-dim)' }}>
            +{returned.length} returned recently
          </p>
        )}
      </div>
    </div>
  );
}
