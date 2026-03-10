'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ProjectPlannerData, PlannedProject } from '@/lib/demo-data';

interface ProjectPlannerProps {
  data: ProjectPlannerData;
  onAction?: () => void;
}

const PRIORITY_STYLES: Record<PlannedProject['priority'], { bg: string; color: string; label: string }> = {
  high: { bg: 'var(--danger-soft)', color: 'var(--danger)', label: 'High' },
  medium: { bg: 'var(--gold-soft)', color: 'var(--gold)', label: 'Medium' },
  low: { bg: 'var(--emerald-soft)', color: 'var(--emerald)', label: 'Low' },
};

function getProgressColor(pct: number): string {
  if (pct >= 75) return 'var(--emerald)';
  if (pct >= 40) return 'var(--gold)';
  return 'var(--accent)';
}

function formatCurrency(cents: number): string {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function ProjectPlanner({ data, onAction }: ProjectPlannerProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');

  const overallPct = Math.round((data.totalSaved / data.totalTarget) * 100);
  const filters = ['All', ...data.properties];
  const filtered = filter === 'All' ? data.projects : data.projects.filter((p) => p.property === filter);

  return (
    <div>
      <h3 className="font-serif text-lg mb-3" style={{ color: 'var(--text)' }}>
        💰 Project Planner
      </h3>

      {/* Overall savings ring */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] p-5 mb-4"
        style={{ background: 'var(--bg-deep)' }}
      >
        <div
          className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-[0.12] blur-[40px] pointer-events-none"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-5">
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={getProgressColor(overallPct)}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${overallPct * 2.64} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{overallPct}%</span>
              <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>saved</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
              {formatCurrency(data.totalSaved)} of {formatCurrency(data.totalTarget)}
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
              {data.projects.length} planned projects across {data.properties.length} properties
            </p>
          </div>
        </div>
      </div>

      {/* Property filter pills */}
      <div className="flex gap-1 mb-3 p-1 rounded-xl" style={{ background: 'var(--glass)' }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-all duration-200"
            style={
              filter === f
                ? { background: 'var(--accent)', color: 'white', boxShadow: '0 2px 8px var(--accent-glow)' }
                : { color: 'var(--text-dim)' }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Project cards */}
      <div className="space-y-1.5">
        {filtered.map((project) => {
          const pct = Math.round((project.savedSoFar / project.estimatedCost) * 100);
          const p = PRIORITY_STYLES[project.priority];
          const isExpanded = expanded === project.id;

          return (
            <div key={project.id}>
              <Card
                padding="sm"
                variant="interactive"
                className="cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : project.id)}
              >
                <div className="flex items-center gap-3">
                  {/* Mini progress ring */}
                  <div className="relative w-10 h-10 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={getProgressColor(pct)}
                        strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={`${pct * 2.64} 264`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[9px] font-bold" style={{ color: 'var(--text)' }}>{pct}%</span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-sm">{project.icon}</span>
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{project.title}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ background: 'var(--glass)', color: 'var(--text-dim)' }}>
                        {project.property}
                      </span>
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: p.bg, color: p.color }}>
                        {p.label}
                      </span>
                      <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>
                        by {new Date(project.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    {/* Savings bar */}
                    <div className="mt-1.5">
                      <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass)' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: getProgressColor(pct) }} />
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{formatCurrency(project.savedSoFar)}</span>
                        <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{formatCurrency(project.estimatedCost)}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] shrink-0 transition-transform" style={{ color: 'var(--text-dim)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    &#9656;
                  </span>
                </div>
              </Card>

              {/* Expanded details */}
              {isExpanded && (
                <div
                  className="mx-2 mt-1 mb-2 rounded-xl p-4 space-y-3 animate-rise"
                  style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
                >
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                    {project.notes}
                  </p>
                  <div
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ background: 'var(--accent-soft)' }}
                  >
                    <span className="text-xs">💡</span>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--accent)' }}>
                      Save ${(project.monthlySavings).toLocaleString()}/mo to reach goal by{' '}
                      {new Date(project.targetDate).toLocaleDateString('en-US', { month: 'short' })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                      className="flex-1 text-[11px] font-semibold py-2 rounded-lg transition-colors"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                    >
                      Edit Budget
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onAction?.(); }}
                      className="flex-1 text-[11px] font-semibold py-2 rounded-lg transition-colors"
                      style={{ background: 'var(--glass)', color: 'var(--text-sub)' }}
                    >
                      View Materials
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <Button onClick={onAction} className="w-full mt-3" size="lg">
        Plan a New Project
      </Button>
    </div>
  );
}
