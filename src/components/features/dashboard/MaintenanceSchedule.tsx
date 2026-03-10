'use client';

import { Card } from '@/components/ui/Card';
import type { MaintenanceTask } from '@/lib/demo-data';

interface MaintenanceScheduleProps {
  tasks: MaintenanceTask[];
  onMarkDone?: (id: string) => void;
}

const STATUS_STYLES = {
  on_track: { bg: 'var(--emerald-soft)', color: 'var(--emerald)', label: 'On Track', ring: '' },
  due_soon: { bg: 'var(--gold-soft)', color: 'var(--gold)', label: 'Due Soon', ring: 'ring-1 ring-[var(--gold)]/30' },
  overdue: { bg: 'var(--danger-soft)', color: 'var(--danger)', label: 'Overdue', ring: 'ring-1 ring-[var(--danger)]/30' },
};

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDue(dateStr: string, status: MaintenanceTask['status']): string {
  const days = daysUntil(dateStr);
  if (status === 'overdue') return `${Math.abs(days)} days overdue`;
  if (days <= 7) return `Due in ${days} day${days !== 1 ? 's' : ''}`;
  const d = new Date(dateStr);
  return `Due ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

export function MaintenanceSchedule({ tasks, onMarkDone }: MaintenanceScheduleProps) {
  const overdue = tasks.filter((t) => t.status === 'overdue');
  const dueSoon = tasks.filter((t) => t.status === 'due_soon');
  const onTrack = tasks.filter((t) => t.status === 'on_track');
  const sorted = [...overdue, ...dueSoon, ...onTrack];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          🗓️ Maintenance Schedule
        </h3>
        <div className="flex items-center gap-2">
          {overdue.length > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}
            >
              {overdue.length} overdue
            </span>
          )}
          <span className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
            {tasks.length} tasks
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {sorted.map((task) => {
          const s = STATUS_STYLES[task.status];
          return (
            <Card key={task.id} padding="sm" variant="interactive" className={s.ring}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: s.bg }}
                >
                  {task.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {task.title}
                    </p>
                    {task.partnerTag && (
                      <span
                        className="text-[8px] font-bold uppercase px-1 py-0.5 rounded"
                        style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                      >
                        auto
                      </span>
                    )}
                  </div>
                  <p className="text-[11px]" style={{ color: 'var(--text-dim)' }}>
                    {task.frequencyLabel}
                    {task.lastDone && (
                      <> &middot; Last: {new Date(task.lastDone).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</>
                    )}
                  </p>
                  {task.notes && (
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                      {task.notes}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <span
                    className="text-[10px] font-bold block mb-1"
                    style={{ color: s.color }}
                  >
                    {formatDue(task.nextDue, task.status)}
                  </span>
                  {task.status !== 'on_track' && onMarkDone && (
                    <button
                      onClick={() => onMarkDone(task.id)}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors"
                      style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
