'use client';

import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  getCurrentSeason,
  SEASON_CONFIG,
  MAINTENANCE_TASKS,
} from '@/lib/maintenance';
import type { MaintenanceTaskRow } from '@/hooks/useMaintenance';

interface SeasonalSpotlightProps {
  tasks: MaintenanceTaskRow[];
  onComplete: (taskId: string) => void;
  isCompleting?: boolean;
}

const SEASON_TIPS: Record<string, string[]> = {
  spring: [
    'Check for winter damage on roof, gutters, and exterior',
    'Service AC before the first hot day to avoid rush pricing',
    'Spring is prime time for exterior painting and deck work',
  ],
  summer: [
    'Maintain 3.5" mowing height to protect grass from heat stress',
    'Run sprinklers early morning (5-8am) to reduce evaporation',
    'Trim branches 6+ inches from your house to prevent pest access',
  ],
  fall: [
    'Schedule furnace service in September before the rush',
    'Clean gutters after peak leaf fall, not before',
    'Winterize outdoor faucets before the first freeze',
  ],
  winter: [
    'Keep cabinet doors open during extreme cold to prevent pipe freezing',
    'Never use space heaters unattended or near flammables',
    'Check that your CO detectors are working, especially with heating running',
  ],
};

export function SeasonalSpotlight({ tasks, onComplete, isCompleting }: SeasonalSpotlightProps) {
  const season = getCurrentSeason();
  const config = SEASON_CONFIG[season];
  const tips = SEASON_TIPS[season] ?? [];

  // Filter tasks for current season
  const seasonalTasks = tasks.filter(
    (t) => !t.is_dismissed && (t.season === season || t.season === 'year_round')
  );

  // Sort: overdue first, then due soon, then by importance
  const sortedTasks = [...seasonalTasks].sort((a, b) => {
    const aDate = a.next_due_at ? new Date(a.next_due_at).getTime() : Infinity;
    const bDate = b.next_due_at ? new Date(b.next_due_at).getTime() : Infinity;
    return aDate - bDate;
  });

  // Calculate progress
  const completedThisSeason = seasonalTasks.filter((t) => {
    if (!t.last_completed_at) return false;
    const completed = new Date(t.last_completed_at);
    const now = new Date();
    const monthsAgo = (now.getFullYear() - completed.getFullYear()) * 12 + now.getMonth() - completed.getMonth();
    return monthsAgo < 4; // completed within last ~season
  }).length;

  const totalSeasonal = seasonalTasks.length;
  const progressPct = totalSeasonal > 0 ? Math.round((completedThisSeason / totalSeasonal) * 100) : 0;

  // Progress ring parameters
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          {config.icon} {config.label} Focus
        </h3>
        <Badge variant="default">
          {seasonalTasks.length} tasks
        </Badge>
      </div>

      <Card padding="md" style={{ borderTop: `3px solid ${config.color}` }}>
        {/* Header with progress ring */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative shrink-0">
            <svg width="68" height="68" viewBox="0 0 68 68">
              <circle
                cx="34" cy="34" r={radius}
                fill="none"
                stroke="var(--glass-border)"
                strokeWidth="5"
                opacity="0.3"
              />
              <circle
                cx="34" cy="34" r={radius}
                fill="none"
                stroke={config.color}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 34 34)"
                style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg">{config.icon}</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {completedThisSeason}/{totalSeasonal} completed
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
              {progressPct}% of {config.label.toLowerCase()} tasks done
            </p>
          </div>
        </div>

        {/* Seasonal Tips */}
        {tips.length > 0 && (
          <div
            className="rounded-[20px] p-3 mb-4"
            style={{ background: config.bgColor }}
          >
            <p className="text-[10px] font-bold uppercase mb-1.5" style={{ color: config.color }}>
              {config.label} Tips
            </p>
            <ul className="space-y-1">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[10px] mt-0.5" style={{ color: config.color }}>&#8226;</span>
                  <span className="text-[11px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Priority Task List */}
        <div className="space-y-2">
          {sortedTasks.slice(0, 5).map((task) => {
            const taskDef = MAINTENANCE_TASKS.find((t) => t.id === task.task_id);
            const isOverdue = task.next_due_at && new Date(task.next_due_at) < new Date();
            const isDueSoon = task.next_due_at && !isOverdue &&
              Math.ceil((new Date(task.next_due_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) <= 7;

            return (
              <div
                key={task.id}
                className="flex items-center gap-3 p-2 rounded-[20px] transition-colors"
                style={{ background: isOverdue ? 'var(--danger-soft)' : isDueSoon ? 'var(--gold-soft)' : 'transparent' }}
              >
                <span className="text-sm">{taskDef?.icon ?? '🔧'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                    {task.title}
                  </p>
                  {task.next_due_at && (
                    <p className="text-[10px]" style={{
                      color: isOverdue ? 'var(--danger)' : isDueSoon ? 'var(--gold)' : 'var(--text-dim)',
                    }}>
                      {isOverdue
                        ? `${Math.abs(Math.ceil((new Date(task.next_due_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days overdue`
                        : `Due ${new Date(task.next_due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                      }
                    </p>
                  )}
                </div>
                {(isOverdue || isDueSoon) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onComplete(task.id)}
                    disabled={isCompleting}
                    className="shrink-0"
                  >
                    Done
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {seasonalTasks.length > 5 && (
          <p className="text-[11px] text-center mt-3" style={{ color: 'var(--text-dim)' }}>
            +{seasonalTasks.length - 5} more tasks this {config.label.toLowerCase()}
          </p>
        )}
      </Card>
    </div>
  );
}
