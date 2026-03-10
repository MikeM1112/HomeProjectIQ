'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MAINTENANCE_TASKS, TASK_CATEGORIES, type TaskCategory } from '@/lib/maintenance';
import type { MaintenanceTaskRow } from '@/hooks/useMaintenance';

interface MaintenanceCardProps {
  task: MaintenanceTaskRow;
  onComplete: (taskId: string) => void;
  onSnooze: (taskId: string, days: number) => void;
  onDismiss: (taskId: string) => void;
  isCompleting?: boolean;
}

function getUrgency(nextDue: string | null): 'overdue' | 'due_soon' | 'upcoming' | 'on_track' {
  if (!nextDue) return 'on_track';
  const now = new Date();
  const due = new Date(nextDue);
  const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 7) return 'due_soon';
  if (daysUntil <= 30) return 'upcoming';
  return 'on_track';
}

function formatDueDate(nextDue: string | null): string {
  if (!nextDue) return 'Not scheduled';
  const now = new Date();
  const due = new Date(nextDue);
  const daysUntil = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysUntil < -1) return `${Math.abs(daysUntil)} days overdue`;
  if (daysUntil === -1) return 'Yesterday';
  if (daysUntil === 0) return 'Today';
  if (daysUntil === 1) return 'Tomorrow';
  if (daysUntil <= 7) return `In ${daysUntil} days`;
  return due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const URGENCY_STYLES = {
  overdue: { color: 'var(--danger)', bg: 'var(--danger-soft)', ring: 'ring-1 ring-[var(--danger)]/30', label: 'Overdue' },
  due_soon: { color: 'var(--gold)', bg: 'var(--gold-soft)', ring: 'ring-1 ring-[var(--gold)]/30', label: 'Due Soon' },
  upcoming: { color: 'var(--accent)', bg: 'var(--accent-soft)', ring: '', label: 'Upcoming' },
  on_track: { color: 'var(--emerald)', bg: 'var(--emerald-soft)', ring: '', label: 'On Track' },
};

const DIFFICULTY_LABELS = ['', 'Easy', 'Moderate', 'Intermediate', 'Advanced', 'Expert'];

export function MaintenanceCard({ task, onComplete, onSnooze, onDismiss, isCompleting }: MaintenanceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showSnooze, setShowSnooze] = useState(false);
  const [completing, setCompleting] = useState(false);

  const urgency = getUrgency(task.next_due_at);
  const style = URGENCY_STYLES[urgency];

  // Find the task definition for extra details
  const taskDef = MAINTENANCE_TASKS.find((t) => t.id === task.task_id);
  const catInfo = TASK_CATEGORIES[task.category as TaskCategory];

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await onComplete(task.id);
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Card
      padding="sm"
      variant="interactive"
      className={style.ring}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3">
        {/* Category Icon */}
        <div
          className="w-10 h-10 rounded-[20px] flex items-center justify-center text-xl shrink-0"
          style={{ background: style.bg }}
        >
          {taskDef?.icon ?? catInfo?.icon ?? '🔧'}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>
              {task.title}
            </p>
            {task.importance === 'critical' && (
              <span
                className="text-[8px] font-bold uppercase px-1 py-0.5 rounded"
                style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
              >
                critical
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
              {catInfo?.label ?? task.category}
            </span>
            {taskDef && (
              <>
                <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>&middot;</span>
                <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                  {taskDef.timeEstimate}
                </span>
              </>
            )}
            {task.last_completed_at && (
              <>
                <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>&middot;</span>
                <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                  Last: {new Date(task.last_completed_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Due Date + Status */}
        <div className="text-right shrink-0">
          <span className="text-[10px] font-bold block" style={{ color: style.color }}>
            {formatDueDate(task.next_due_at)}
          </span>
          {(urgency === 'overdue' || urgency === 'due_soon') && (
            <button
              onClick={(e) => { e.stopPropagation(); handleComplete(); }}
              disabled={completing || isCompleting}
              className="text-[10px] font-bold px-2 py-0.5 rounded-full transition-all mt-1 disabled:opacity-50"
              style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}
            >
              {completing ? '...' : 'Done'}
            </button>
          )}
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-3">
          {/* Description */}
          {taskDef?.description && (
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-sub)' }}>
              {taskDef.description}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap gap-2">
            {taskDef && (
              <Badge variant="default">
                {DIFFICULTY_LABELS[taskDef.difficultyLevel] ?? 'Easy'}
              </Badge>
            )}
            {taskDef && (
              <Badge variant="info">
                {taskDef.timeEstimate}
              </Badge>
            )}
            <Badge variant={task.importance === 'critical' ? 'error' : task.importance === 'important' ? 'warning' : 'default'}>
              {task.importance}
            </Badge>
          </div>

          {/* Tools Needed */}
          {taskDef && taskDef.toolsNeeded.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase mb-1" style={{ color: 'var(--text-dim)' }}>
                Tools Needed
              </p>
              <div className="flex flex-wrap gap-1">
                {taskDef.toolsNeeded.map((tool) => (
                  <span
                    key={tool}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--chip-bg)', color: 'var(--chip-text)', border: '1px solid var(--chip-border)' }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {task.notes && (
            <p className="text-[11px] italic" style={{ color: 'var(--text-dim)' }}>
              Note: {task.notes}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => { e.stopPropagation(); handleComplete(); }}
              loading={completing || isCompleting}
            >
              Mark Complete (+15 XP)
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => { e.stopPropagation(); setShowSnooze(!showSnooze); }}
            >
              Snooze
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); onDismiss(task.id); }}
            >
              Dismiss
            </Button>
          </div>

          {/* Snooze Options */}
          {showSnooze && (
            <div className="flex gap-2">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  onClick={(e) => { e.stopPropagation(); onSnooze(task.id, days); setShowSnooze(false); }}
                  className="text-[11px] font-medium px-3 py-1 rounded-full transition-colors"
                  style={{ background: 'var(--chip-bg)', color: 'var(--chip-text)', border: '1px solid var(--chip-border)' }}
                >
                  {days === 7 ? '1 week' : days === 14 ? '2 weeks' : '1 month'}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
