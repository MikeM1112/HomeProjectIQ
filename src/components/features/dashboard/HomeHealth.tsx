'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import type { HomeHealthData, HomeHealthCategory } from '@/lib/demo-data';

interface HomeHealthProps {
  data: HomeHealthData;
}

const STATUS_COLORS: Record<HomeHealthCategory['status'], { bg: string; color: string; label: string }> = {
  excellent: { bg: 'var(--emerald-soft)', color: 'var(--emerald)', label: 'Excellent' },
  good: { bg: 'var(--info-soft)', color: 'var(--info)', label: 'Good' },
  fair: { bg: 'var(--gold-soft)', color: 'var(--gold)', label: 'Fair' },
  needs_attention: { bg: 'var(--danger-soft)', color: 'var(--danger)', label: 'Needs Attention' },
};

const CONDITION_LABELS: Record<string, { label: string; color: string }> = {
  like_new: { label: 'Like New', color: 'var(--emerald)' },
  good: { label: 'Good', color: 'var(--info)' },
  worn: { label: 'Worn', color: 'var(--gold)' },
  failing: { label: 'Failing', color: 'var(--danger)' },
};

function getScoreColor(score: number): string {
  if (score >= 90) return 'var(--emerald)';
  if (score >= 75) return 'var(--info)';
  if (score >= 60) return 'var(--gold)';
  return 'var(--danger)';
}

function getGradeColor(grade: string): string {
  if (grade.startsWith('A')) return 'var(--emerald)';
  if (grade.startsWith('B')) return 'var(--info)';
  if (grade.startsWith('C')) return 'var(--gold)';
  return 'var(--danger)';
}

export function HomeHealth({ data }: HomeHealthProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const excellentCount = data.categories.filter((c) => c.status === 'excellent').length;
  const needsAttention = data.categories.filter((c) => c.status === 'needs_attention');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          🏠 Home Health Score
        </h3>
        <div className="flex items-center gap-1">
          {data.trend === 'improving' && <span className="text-xs" style={{ color: 'var(--emerald)' }}>&#8593;</span>}
          {data.trend === 'declining' && <span className="text-xs" style={{ color: 'var(--danger)' }}>&#8595;</span>}
          <span className="text-[11px] font-medium" style={{ color: data.trend === 'improving' ? 'var(--emerald)' : data.trend === 'declining' ? 'var(--danger)' : 'var(--text-dim)' }}>
            {data.trend === 'improving' ? `+${data.trendDelta}` : data.trend === 'declining' ? `-${data.trendDelta}` : 'Stable'} this month
          </span>
        </div>
      </div>

      {/* Score Hero */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] p-5 mb-4"
        style={{ background: 'var(--bg-deep)' }}
      >
        <div
          className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-[0.15] blur-[50px] pointer-events-none"
          style={{ background: getGradeColor(data.grade) }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-5">
          {/* Circular score */}
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={getScoreColor(data.overallScore)}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${data.overallScore * 2.64} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: 'var(--text)' }}>{data.overallScore}</span>
              <span className="text-xs font-bold" style={{ color: getGradeColor(data.grade) }}>{data.grade}</span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
              {data.overallScore >= 85 ? 'Your home is in great shape' : data.overallScore >= 70 ? 'Your home is in good shape' : 'Your home needs some attention'}
            </p>
            <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
              {excellentCount} of {data.categories.length} systems rated excellent.
              {needsAttention.length > 0 && (
                <> {needsAttention.length} need{needsAttention.length === 1 ? 's' : ''} attention.</>
              )}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                🔥 {data.streakDays}-day streak
              </span>
              <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                Tap any system for details
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-1.5">
        {data.categories.map((cat) => {
          const s = STATUS_COLORS[cat.status];
          const isExpanded = expanded === cat.id;
          const sys = cat.system;

          return (
            <div key={cat.id}>
              <Card
                padding="sm"
                variant="interactive"
                className="cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : cat.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg shrink-0">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{cat.label}</p>
                        {sys?.photoAssessed && (
                          <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                            📸 AI
                          </span>
                        )}
                        {sys?.maintenanceVerified && (
                          <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                            &#10003; Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                        <span className="text-xs font-bold" style={{ color: getScoreColor(cat.score) }}>{cat.score}</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass)' }}>
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${cat.score}%`, background: getScoreColor(cat.score) }} />
                    </div>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>{cat.tip}</p>
                  </div>
                  <span className="text-[10px] shrink-0 transition-transform" style={{ color: 'var(--text-dim)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                    &#9656;
                  </span>
                </div>
              </Card>

              {/* Expanded system detail */}
              {isExpanded && sys && (
                <div
                  className="mx-2 mt-1 mb-2 rounded-xl p-4 space-y-3 animate-rise"
                  style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
                >
                  {/* System info header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold" style={{ color: 'var(--text)' }}>
                        {sys.brand ?? cat.label}
                        {sys.model && <span className="font-normal" style={{ color: 'var(--text-sub)' }}> &middot; {sys.model}</span>}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                        Installed {sys.installYear} &middot; {sys.ageYears} years old &middot; Expected life: {sys.estimatedLifespan}
                      </p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: CONDITION_LABELS[sys.condition]?.color ?? 'var(--text-dim)' }}>
                      {CONDITION_LABELS[sys.condition]?.label ?? sys.condition}
                    </span>
                  </div>

                  {/* Lifespan bar */}
                  {sys.lifespanPct > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>System Lifespan</span>
                        <span className="text-[10px] font-semibold" style={{ color: sys.lifespanPct > 75 ? 'var(--gold)' : 'var(--text-sub)' }}>
                          {sys.lifespanPct}% through
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${sys.lifespanPct}%`,
                            background: sys.lifespanPct > 80 ? 'var(--danger)' : sys.lifespanPct > 60 ? 'var(--gold)' : 'var(--emerald)',
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Maintenance proof */}
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                      style={{ background: sys.maintenanceVerified ? 'var(--emerald-soft)' : 'var(--glass)' }}
                    >
                      <span className="text-[10px]">{sys.maintenanceVerified ? '✓' : '?'}</span>
                      <span className="text-[10px] font-semibold" style={{ color: sys.maintenanceVerified ? 'var(--emerald)' : 'var(--text-dim)' }}>
                        {sys.maintenanceCount} service records
                      </span>
                    </div>
                    {sys.photoAssessed && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'var(--accent-soft)' }}>
                        <span className="text-[10px]">📸</span>
                        <span className="text-[10px] font-semibold" style={{ color: 'var(--accent)' }}>Photo assessed</span>
                      </div>
                    )}
                  </div>

                  {/* Condition note */}
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                    {sys.conditionNote}
                  </p>

                  {/* Photo assessment note */}
                  {sys.photoNote && (
                    <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'var(--accent-soft)' }}>
                      <span className="text-xs shrink-0">📸</span>
                      <p className="text-[10px]" style={{ color: 'var(--accent)' }}>{sys.photoNote}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
