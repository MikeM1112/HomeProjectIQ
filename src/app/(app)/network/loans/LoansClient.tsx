'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Mascot } from '@/components/brand/Mascot';
import { useToolLoans } from '@/hooks/useToolLoans';
import { formatDate, cn } from '@/lib/utils';
import type { ToolLoan, ToolLoanStatus } from '@/types/app';

type TabType = 'lent' | 'borrowed';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function getLoanStatusConfig(
  loan: ToolLoan
): {
  label: string;
  variant: 'success' | 'warning' | 'error' | 'default';
  icon: React.ReactNode;
} {
  if (loan.status === 'returned') {
    return {
      label: 'Returned',
      variant: 'success',
      icon: <CheckCircle2 size={12} />,
    };
  }

  const today = new Date().toISOString().split('T')[0];

  if (loan.due_date) {
    const due = loan.due_date.split('T')[0];
    if (due < today) {
      return {
        label: 'Overdue',
        variant: 'error',
        icon: <AlertTriangle size={12} />,
      };
    }
    // Due within 3 days
    const dueDate = new Date(due);
    const todayDate = new Date(today);
    const diffDays = Math.ceil(
      (dueDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays <= 3) {
      return {
        label: 'Due Soon',
        variant: 'warning',
        icon: <Clock size={12} />,
      };
    }
  }

  return {
    label: 'Active',
    variant: 'default',
    icon: <Clock size={12} />,
  };
}

function LoanCard({
  loan,
  direction,
  onReturn,
  isReturning,
}: {
  loan: ToolLoan;
  direction: 'lent' | 'borrowed';
  onReturn: (id: string) => void;
  isReturning: boolean;
}) {
  const status = getLoanStatusConfig(loan);

  return (
    <GlassPanel padding="md">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg"
          style={{ background: 'var(--chip-bg)' }}
        >
          {loan.tool_emoji || '🔧'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--text)' }}
            >
              {loan.tool_name}
            </span>
            <Badge variant={status.variant}>
              <span className="flex items-center gap-1">
                {status.icon}
                {status.label}
              </span>
            </Badge>
          </div>

          <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
            {direction === 'lent' ? 'Lent to' : 'Borrowed from'}{' '}
            <span className="font-medium" style={{ color: 'var(--text)' }}>
              {loan.borrower_name}
            </span>
          </p>

          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span
              className="text-[11px] flex items-center gap-1"
              style={{ color: 'var(--text-sub)' }}
            >
              <Calendar size={10} />
              {formatDate(loan.lent_date)}
            </span>
            {loan.due_date && (
              <span
                className="text-[11px] flex items-center gap-1"
                style={{
                  color:
                    status.variant === 'error'
                      ? 'var(--danger)'
                      : status.variant === 'warning'
                        ? 'var(--gold)'
                        : 'var(--text-sub)',
                }}
              >
                <Clock size={10} />
                Due {formatDate(loan.due_date)}
              </span>
            )}
          </div>

          {loan.notes && (
            <p
              className="text-[11px] mt-1 line-clamp-1"
              style={{ color: 'var(--text-sub)' }}
            >
              {loan.notes}
            </p>
          )}
        </div>

        {loan.status !== 'returned' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onReturn(loan.id)}
            loading={isReturning}
            className="shrink-0"
          >
            <RotateCcw size={12} className="mr-1" />
            {direction === 'lent' ? 'Mark Returned' : 'Return'}
          </Button>
        )}
      </div>
    </GlassPanel>
  );
}

export function LoansClient() {
  const [tab, setTab] = useState<TabType>('lent');
  const { loans, isLoading, returnLoan, isReturning } = useToolLoans();

  // For now, all loans are "lent" since the API is from the lender's perspective
  // In a full implementation, you'd have separate endpoints for borrowed items
  const lentLoans = loans;
  const borrowedLoans: ToolLoan[] = []; // placeholder

  const activeTab = tab === 'lent' ? lentLoans : borrowedLoans;
  const activeCount = activeTab.filter((l) => l.status !== 'returned').length;

  const handleReturn = async (id: string) => {
    try {
      await returnLoan(id);
    } catch {
      // Error handled by hook
    }
  };

  return (
    <>
      <Navbar title="Tool Loans" showBack backHref="/network" />
      <PageWrapper>
        <div className="space-y-4">
          {/* Tab Switcher */}
          <div
            className="flex rounded-2xl p-1"
            style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
          >
            {(['lent', 'borrowed'] as const).map((t) => {
              const isActive = tab === t;
              const count =
                t === 'lent'
                  ? lentLoans.filter((l) => l.status !== 'returned').length
                  : borrowedLoans.filter((l) => l.status !== 'returned').length;

              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-[var(--text-sub)]'
                  )}
                  style={
                    isActive
                      ? { background: 'var(--accent-gradient, var(--accent))' }
                      : {}
                  }
                >
                  {t === 'lent' ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownLeft size={16} />
                  )}
                  {t === 'lent' ? 'Lent' : 'Borrowed'}
                  {count > 0 && (
                    <span
                      className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full',
                        isActive
                          ? 'bg-white/20'
                          : 'bg-[var(--chip-bg)]'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Loans List */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {activeTab.length === 0 ? (
                  <motion.div variants={fadeUp}>
                    <GlassPanel padding="lg" className="text-center">
                      <Mascot mode="tool" size="lg" className="mx-auto mb-3" />
                      <p
                        className="text-sm font-semibold mb-1"
                        style={{ color: 'var(--text)' }}
                      >
                        {tab === 'lent'
                          ? 'No tools lent out'
                          : 'No borrowed tools'}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: 'var(--text-sub)' }}
                      >
                        {tab === 'lent'
                          ? 'When you lend tools to friends, they will appear here.'
                          : 'Tools you borrow from friends will appear here.'}
                      </p>
                    </GlassPanel>
                  </motion.div>
                ) : (
                  activeTab.map((loan) => (
                    <motion.div key={loan.id} variants={fadeUp}>
                      <LoanCard
                        loan={loan}
                        direction={tab}
                        onReturn={handleReturn}
                        isReturning={isReturning}
                      />
                    </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
