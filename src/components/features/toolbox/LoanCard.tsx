'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { ToolLoan } from '@/types/app';

function relativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

interface LoanCardProps {
  loan: ToolLoan;
  isOverdue: boolean;
  onReturn: (id: string) => void;
  isReturning: boolean;
}

export function LoanCard({ loan, isOverdue, onReturn, isReturning }: LoanCardProps) {
  return (
    <Card padding="sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{loan.tool_emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--ink)] truncate">{loan.tool_name}</span>
            {isOverdue && <Badge variant="error">Overdue</Badge>}
          </div>
          <p className="text-xs text-[var(--ink-sub)]">
            Lent to <span className="font-medium">{loan.borrower_name}</span> {relativeDate(loan.lent_date)}
          </p>
          {loan.due_date && (
            <p className={`text-xs mt-0.5 ${isOverdue ? 'text-[var(--red)] font-medium' : 'text-[var(--ink-dim)]'}`}>
              Due: {new Date(loan.due_date).toLocaleDateString()}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onReturn(loan.id)}
          disabled={isReturning}
        >
          {isReturning ? '...' : 'Returned'}
        </Button>
      </div>
    </Card>
  );
}
