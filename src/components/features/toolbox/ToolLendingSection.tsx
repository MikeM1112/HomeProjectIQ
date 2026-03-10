'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LoanCard } from './LoanCard';
import { LendToolModal } from './LendToolModal';
import { useToolLoans } from '@/hooks/useToolLoans';
import { useUIStore } from '@/stores/uiStore';
import type { ToolboxItem } from '@/types/app';

interface ToolLendingSectionProps {
  tools: ToolboxItem[];
}

export function ToolLendingSection({ tools }: ToolLendingSectionProps) {
  const [showLend, setShowLend] = useState(false);
  const { activeLoans, overdueLoans, createLoan, returnLoan, isReturning } = useToolLoans();
  const { showToast } = useUIStore();

  const lentOutIds = activeLoans.map((l) => l.tool_id);

  const handleLend = async (data: Parameters<typeof createLoan>[0]) => {
    try {
      await createLoan(data);
      showToast('+5 XP! Tool lent out.', 'success');
    } catch {
      showToast('Failed to lend tool.', 'error');
    }
  };

  const handleReturn = async (id: string) => {
    try {
      await returnLoan(id);
      showToast('+3 XP! Tool returned.', 'success');
    } catch {
      showToast('Failed to mark returned.', 'error');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-serif text-base font-semibold text-[var(--ink)]">
            Lending
          </h3>
          {activeLoans.length > 0 && (
            <Badge variant="default">{activeLoans.length} out</Badge>
          )}
          {overdueLoans.length > 0 && (
            <Badge variant="error">{overdueLoans.length} overdue</Badge>
          )}
        </div>
        <Button size="sm" variant="secondary" onClick={() => setShowLend(true)}>
          Lend a Tool
        </Button>
      </div>

      {activeLoans.length === 0 ? (
        <p className="text-xs text-[var(--ink-dim)] py-2">
          No tools currently lent out. Tap &ldquo;Lend a Tool&rdquo; to track a loan.
        </p>
      ) : (
        <div className="space-y-2">
          {activeLoans.map((loan) => (
            <LoanCard
              key={loan.id}
              loan={loan}
              isOverdue={overdueLoans.some((o) => o.id === loan.id)}
              onReturn={handleReturn}
              isReturning={isReturning}
            />
          ))}
        </div>
      )}

      <LendToolModal
        isOpen={showLend}
        onClose={() => setShowLend(false)}
        tools={tools}
        lentOutIds={lentOutIds}
        onLend={handleLend}
      />
    </div>
  );
}
