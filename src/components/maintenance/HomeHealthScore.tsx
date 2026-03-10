'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TASK_CATEGORIES, type TaskCategory } from '@/lib/maintenance';
import type { MaintenanceTaskRow } from '@/hooks/useMaintenance';

interface HomeHealthScoreProps {
  tasks: MaintenanceTaskRow[];
  score: number;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'var(--emerald)';
  if (score >= 50) return 'var(--gold)';
  return 'var(--danger)';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Needs Work';
  return 'Critical';
}

function getScoreGrade(score: number): string {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'A-';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'B-';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

function getUrgency(nextDue: string | null): 'overdue' | 'due_soon' | 'on_track' {
  if (!nextDue) return 'on_track';
  const now = new Date();
  const due = new Date(nextDue);
  const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 7) return 'due_soon';
  return 'on_track';
}

export function HomeHealthScore({ tasks, score }: HomeHealthScoreProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const activeTasks = tasks.filter((t) => !t.is_dismissed);
  const overdueCount = activeTasks.filter((t) => getUrgency(t.next_due_at) === 'overdue').length;
  const upToDateCount = activeTasks.filter((t) => getUrgency(t.next_due_at) === 'on_track').length;
  const dueSoonCount = activeTasks.filter((t) => getUrgency(t.next_due_at) === 'due_soon').length;

  const color = getScoreColor(score);
  const grade = getScoreGrade(score);

  // Category breakdown
  const categoryScores = Object.entries(TASK_CATEGORIES).map(([catId, catInfo]) => {
    const catTasks = activeTasks.filter((t) => t.category === catId);
    if (catTasks.length === 0) return null;
    const catOverdue = catTasks.filter((t) => getUrgency(t.next_due_at) === 'overdue').length;
    const catOnTrack = catTasks.filter((t) => getUrgency(t.next_due_at) === 'on_track').length;
    const catScore = catTasks.length > 0 ? Math.round((catOnTrack / catTasks.length) * 100) : 100;
    return {
      id: catId as TaskCategory,
      ...catInfo,
      score: catScore,
      total: catTasks.length,
      overdue: catOverdue,
      onTrack: catOnTrack,
    };
  }).filter(Boolean);

  // SVG gauge parameters
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          Home Health Score
        </h3>
        <Badge variant={score >= 80 ? 'success' : score >= 50 ? 'warning' : 'error'}>
          {getScoreLabel(score)}
        </Badge>
      </div>

      <Card padding="lg" onClick={() => setShowBreakdown(!showBreakdown)} variant="interactive">
        <div className="flex items-center gap-6">
          {/* Circular Gauge */}
          <div className="relative shrink-0">
            <svg width="140" height="140" viewBox="0 0 140 140" style={{ shapeRendering: 'geometricPrecision' }}>
              {/* Background ring */}
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke="var(--glass-border)"
                strokeWidth="10"
                opacity="0.3"
              />
              {/* Score ring */}
              <circle
                cx="70" cy="70" r={radius}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 70 70)"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold" style={{ color }}>{score}%</span>
              <span className="text-lg font-serif font-bold" style={{ color: 'var(--text-dim)' }}>{grade}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-2">
            {overdueCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--danger)' }} />
                <span className="text-sm" style={{ color: 'var(--danger)' }}>
                  {overdueCount} overdue
                </span>
              </div>
            )}
            {dueSoonCount > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: 'var(--gold)' }} />
                <span className="text-sm" style={{ color: 'var(--gold)' }}>
                  {dueSoonCount} due soon
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--emerald)' }} />
              <span className="text-sm" style={{ color: 'var(--emerald)' }}>
                {upToDateCount} up to date
              </span>
            </div>
            <p className="text-[11px] mt-2" style={{ color: 'var(--text-dim)' }}>
              {activeTasks.length} active tasks &middot; Tap for breakdown
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        {showBreakdown && categoryScores.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
            {categoryScores.map((cat) => cat && (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-sm w-5">{cat.icon}</span>
                <span className="text-xs font-medium flex-1" style={{ color: 'var(--text)' }}>
                  {cat.label}
                </span>
                <div className="w-24 h-1.5 rounded-full bg-[var(--glass-border)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.score}%`,
                      background: getScoreColor(cat.score),
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold w-8 text-right" style={{ color: getScoreColor(cat.score) }}>
                  {cat.score}%
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
