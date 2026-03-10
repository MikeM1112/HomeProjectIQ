'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useDemo } from '@/hooks/useDemo';
import { calculateHomeHealthScore, MAINTENANCE_TASKS } from '@/lib/maintenance';
import { DEMO_MAINTENANCE } from '@/lib/demo-data';
import type { MaintenanceTaskRow } from '@/hooks/useMaintenance';

function demoToRows(): MaintenanceTaskRow[] {
  return DEMO_MAINTENANCE.map((d) => ({
    id: d.id,
    user_id: 'demo-user-001',
    task_id: d.id,
    title: d.title,
    category: d.category.toLowerCase(),
    frequency:
      d.frequencyDays <= 30
        ? 'monthly'
        : d.frequencyDays <= 90
          ? 'quarterly'
          : d.frequencyDays <= 180
            ? 'seasonal'
            : 'annual',
    season: null,
    importance: 'important',
    last_completed_at: d.lastDone,
    next_due_at: d.nextDue,
    is_dismissed: false,
    snoozed_until: null,
    notes: d.notes,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/**
 * Compact maintenance widget for the main dashboard.
 * Shows health score + urgent tasks + link to full maintenance page.
 */
export function MaintenanceDashboardCompact() {
  const { isDemo } = useDemo();
  const { tasks: liveTasks, isSetup, isLoading } = useMaintenance();

  const tasks: MaintenanceTaskRow[] = isDemo ? demoToRows() : liveTasks;
  const setupDone = isDemo ? true : isSetup;

  const healthScore = useMemo(() => calculateHomeHealthScore(tasks), [tasks]);
  const activeTasks = tasks.filter((t) => !t.is_dismissed);

  const overdueCount = activeTasks.filter((t) => {
    if (!t.next_due_at) return false;
    return new Date(t.next_due_at) < new Date();
  }).length;

  const dueSoonCount = activeTasks.filter((t) => {
    if (!t.next_due_at) return false;
    const due = new Date(t.next_due_at);
    const now = new Date();
    const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 7;
  }).length;

  // Get top 3 most urgent tasks
  const urgentTasks = [...activeTasks]
    .filter((t) => t.next_due_at)
    .sort((a, b) => new Date(a.next_due_at!).getTime() - new Date(b.next_due_at!).getTime())
    .slice(0, 3);

  const scoreColor =
    healthScore >= 80 ? 'var(--emerald)' : healthScore >= 50 ? 'var(--gold)' : 'var(--danger)';

  // SVG gauge
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  if (isLoading && !isDemo) {
    return (
      <div className="h-24 rounded-[20px] bg-[var(--glass-border)] animate-pulse" />
    );
  }

  // Not set up: show CTA
  if (!setupDone && !isDemo) {
    return (
      <Link href="/maintenance">
        <Card padding="md" variant="interactive">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-[20px] flex items-center justify-center text-2xl"
              style={{ background: 'var(--accent-soft)' }}
            >
              🏠
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                Set Up Home Maintenance
              </p>
              <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                Personalize your maintenance schedule and never miss a task
              </p>
            </div>
            <span style={{ color: 'var(--accent)' }}>&#8250;</span>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          Home Maintenance
        </h3>
        <Link
          href="/maintenance"
          className="text-xs font-semibold text-[var(--accent)] hover:brightness-110 transition-all"
        >
          View All
        </Link>
      </div>

      <Card padding="md" variant="interactive">
        <div className="flex items-center gap-4">
          {/* Mini Health Gauge */}
          <div className="relative shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle
                cx="28" cy="28" r={radius}
                fill="none"
                stroke="var(--glass-border)"
                strokeWidth="4"
                opacity="0.3"
              />
              <circle
                cx="28" cy="28" r={radius}
                fill="none"
                stroke={scoreColor}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 28 28)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold" style={{ color: scoreColor }}>
                {healthScore}
              </span>
            </div>
          </div>

          {/* Summary */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {overdueCount > 0 && (
                <Badge variant="error">{overdueCount} overdue</Badge>
              )}
              {dueSoonCount > 0 && (
                <Badge variant="warning">{dueSoonCount} due soon</Badge>
              )}
              {overdueCount === 0 && dueSoonCount === 0 && (
                <Badge variant="success">All on track</Badge>
              )}
            </div>

            {/* Top urgent tasks */}
            <div className="space-y-0.5">
              {urgentTasks.map((task) => {
                const taskDef = MAINTENANCE_TASKS.find((t) => t.id === task.task_id);
                const isOverdue = task.next_due_at && new Date(task.next_due_at) < new Date();
                return (
                  <p
                    key={task.id}
                    className="text-[11px] truncate"
                    style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-dim)' }}
                  >
                    {taskDef?.icon ?? '🔧'} {task.title}
                  </p>
                );
              })}
            </div>
          </div>

          <span className="text-lg" style={{ color: 'var(--text-dim)' }}>&#8250;</span>
        </div>
      </Card>
    </div>
  );
}
