'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HomeHealthScore } from './HomeHealthScore';
import { MaintenanceCard } from './MaintenanceCard';
import { SeasonalSpotlight } from './SeasonalSpotlight';
import { MaintenanceSetup } from './MaintenanceSetup';
import { useMaintenance } from '@/hooks/useMaintenance';
import { useDemo } from '@/hooks/useDemo';
import {
  calculateHomeHealthScore,
  SEASON_CONFIG,
  TASK_CATEGORIES,
  type TaskCategory,
  type Season,
} from '@/lib/maintenance';
import { DEMO_MAINTENANCE } from '@/lib/demo-data';
import type { MaintenanceTaskRow } from '@/hooks/useMaintenance';

type FilterCategory = TaskCategory | 'all';
type FilterSeason = Season | 'year_round' | 'all';

/**
 * Convert demo data to the MaintenanceTaskRow shape for demo mode.
 */
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

export function MaintenanceDashboard() {
  const { isDemo } = useDemo();
  const {
    tasks: liveTasks,
    isSetup,
    isLoading,
    completeTask,
    dismissTask,
    snoozeTask,
    setupHome,
    isCompleting,
    isSettingUp,
  } = useMaintenance();

  const [categoryFilter, setCategoryFilter] = useState<FilterCategory>('all');
  const [seasonFilter, setSeasonFilter] = useState<FilterSeason>('all');

  // Use demo data in demo mode, live data otherwise
  const tasks: MaintenanceTaskRow[] = isDemo ? demoToRows() : liveTasks;
  const setupDone = isDemo ? true : isSetup;

  // Calculate health score
  const healthScore = useMemo(() => calculateHomeHealthScore(tasks), [tasks]);

  // Filter tasks
  const activeTasks = useMemo(() => {
    return tasks
      .filter((t) => !t.is_dismissed)
      .filter((t) => categoryFilter === 'all' || t.category === categoryFilter)
      .filter((t) => seasonFilter === 'all' || t.season === seasonFilter);
  }, [tasks, categoryFilter, seasonFilter]);

  // Sort by due date ascending (overdue first)
  const sortedTasks = useMemo(() => {
    return [...activeTasks].sort((a, b) => {
      const aDate = a.next_due_at ? new Date(a.next_due_at).getTime() : Infinity;
      const bDate = b.next_due_at ? new Date(b.next_due_at).getTime() : Infinity;
      return aDate - bDate;
    });
  }, [activeTasks]);

  // Group by urgency
  const overdueTasks = sortedTasks.filter((t) => {
    if (!t.next_due_at) return false;
    return new Date(t.next_due_at) < new Date();
  });
  const dueSoonTasks = sortedTasks.filter((t) => {
    if (!t.next_due_at) return false;
    const due = new Date(t.next_due_at);
    const now = new Date();
    const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil >= 0 && daysUntil <= 7;
  });
  const upcomingTasks = sortedTasks.filter((t) => {
    if (!t.next_due_at) return false;
    const due = new Date(t.next_due_at);
    const now = new Date();
    const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil > 7;
  });

  // Handlers (no-op in demo mode)
  const handleComplete = async (taskId: string) => {
    if (isDemo) return;
    await completeTask(taskId);
  };

  const handleDismiss = async (taskId: string) => {
    if (isDemo) return;
    await dismissTask(taskId);
  };

  const handleSnooze = async (taskId: string, days: number) => {
    if (isDemo) return;
    await snoozeTask(taskId, days);
  };

  // Loading skeleton
  if (isLoading && !isDemo) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded-lg bg-[var(--glass-border)] animate-pulse" />
        <div className="h-40 rounded-2xl bg-[var(--glass-border)] animate-pulse" />
        <div className="h-24 rounded-2xl bg-[var(--glass-border)] animate-pulse" />
        <div className="h-24 rounded-2xl bg-[var(--glass-border)] animate-pulse" />
      </div>
    );
  }

  // Setup wizard (only for real users, not demo)
  if (!setupDone && !isDemo) {
    return <MaintenanceSetup onComplete={setupHome} isLoading={isSettingUp} />;
  }

  // Category chips (only categories that have tasks)
  const activeCategories = [
    ...new Set(tasks.filter((t) => !t.is_dismissed).map((t) => t.category)),
  ];

  return (
    <div className="space-y-6">
      {/* Home Health Score */}
      <HomeHealthScore tasks={tasks} score={healthScore} />

      {/* Seasonal Spotlight */}
      <SeasonalSpotlight
        tasks={tasks}
        onComplete={handleComplete}
        isCompleting={isCompleting}
      />

      {/* Overdue Section */}
      {overdueTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--danger)' }}
            />
            <h3 className="font-serif text-lg" style={{ color: 'var(--danger)' }}>
              Overdue ({overdueTasks.length})
            </h3>
          </div>
          <div className="space-y-2">
            {overdueTasks.map((task) => (
              <MaintenanceCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onSnooze={handleSnooze}
                onDismiss={handleDismiss}
                isCompleting={isCompleting}
              />
            ))}
          </div>
        </div>
      )}

      {/* Due Soon Section */}
      {dueSoonTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
            <h3 className="font-serif text-lg" style={{ color: 'var(--gold)' }}>
              Due This Week ({dueSoonTasks.length})
            </h3>
          </div>
          <div className="space-y-2">
            {dueSoonTasks.map((task) => (
              <MaintenanceCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onSnooze={handleSnooze}
                onDismiss={handleDismiss}
                isCompleting={isCompleting}
              />
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
            All Tasks
          </h3>
          <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
            {activeTasks.length} tasks
          </span>
        </div>

        {/* Category Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          <button
            onClick={() => setCategoryFilter('all')}
            className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all"
            style={{
              background:
                categoryFilter === 'all' ? 'var(--accent-soft)' : 'var(--chip-bg)',
              color:
                categoryFilter === 'all' ? 'var(--accent)' : 'var(--chip-text)',
              border: `1px solid ${categoryFilter === 'all' ? 'var(--accent)' : 'var(--chip-border)'}`,
            }}
          >
            All
          </button>
          {activeCategories.map((cat) => {
            const info = TASK_CATEGORIES[cat as TaskCategory];
            return (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat as TaskCategory)}
                className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all"
                style={{
                  background:
                    categoryFilter === cat ? 'var(--accent-soft)' : 'var(--chip-bg)',
                  color:
                    categoryFilter === cat ? 'var(--accent)' : 'var(--chip-text)',
                  border: `1px solid ${categoryFilter === cat ? 'var(--accent)' : 'var(--chip-border)'}`,
                }}
              >
                {info?.icon} {info?.label ?? cat}
              </button>
            );
          })}
        </div>

        {/* Season Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          <button
            onClick={() => setSeasonFilter('all')}
            className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all"
            style={{
              background:
                seasonFilter === 'all' ? 'var(--accent-soft)' : 'var(--chip-bg)',
              color:
                seasonFilter === 'all' ? 'var(--accent)' : 'var(--chip-text)',
              border: `1px solid ${seasonFilter === 'all' ? 'var(--accent)' : 'var(--chip-border)'}`,
            }}
          >
            All Seasons
          </button>
          {Object.entries(SEASON_CONFIG).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setSeasonFilter(key as Season)}
              className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all"
              style={{
                background:
                  seasonFilter === key ? config.bgColor : 'var(--chip-bg)',
                color: seasonFilter === key ? config.color : 'var(--chip-text)',
                border: `1px solid ${seasonFilter === key ? config.color : 'var(--chip-border)'}`,
              }}
            >
              {config.icon} {config.label}
            </button>
          ))}
          <button
            onClick={() => setSeasonFilter('year_round')}
            className="shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all"
            style={{
              background:
                seasonFilter === 'year_round'
                  ? 'var(--accent-soft)'
                  : 'var(--chip-bg)',
              color:
                seasonFilter === 'year_round'
                  ? 'var(--accent)'
                  : 'var(--chip-text)',
              border: `1px solid ${seasonFilter === 'year_round' ? 'var(--accent)' : 'var(--chip-border)'}`,
            }}
          >
            Year-Round
          </button>
        </div>
      </div>

      {/* Upcoming Tasks */}
      {upcomingTasks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: 'var(--emerald)' }}
            />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--emerald)' }}>
              Up to Date ({upcomingTasks.length})
            </h3>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task) => (
              <MaintenanceCard
                key={task.id}
                task={task}
                onComplete={handleComplete}
                onSnooze={handleSnooze}
                onDismiss={handleDismiss}
                isCompleting={isCompleting}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {activeTasks.length === 0 && (
        <Card padding="lg">
          <div className="text-center py-4">
            <span className="text-4xl block mb-2">🎉</span>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
              {categoryFilter !== 'all' || seasonFilter !== 'all'
                ? 'No tasks match your filters'
                : 'All caught up!'}
            </p>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-dim)' }}>
              {categoryFilter !== 'all' || seasonFilter !== 'all'
                ? 'Try changing your filters to see more tasks'
                : 'Your home maintenance is on track. Great job!'}
            </p>
            {(categoryFilter !== 'all' || seasonFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => {
                  setCategoryFilter('all');
                  setSeasonFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
