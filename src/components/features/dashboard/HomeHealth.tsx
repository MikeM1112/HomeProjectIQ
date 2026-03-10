'use client';

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
  const excellentCount = data.categories.filter((c) => c.status === 'excellent').length;
  const needsAttention = data.categories.filter((c) => c.status === 'needs_attention');

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          🏠 Home Health Score
        </h3>
        <div className="flex items-center gap-1">
          {data.trend === 'improving' && <span className="text-xs" style={{ color: 'var(--emerald)' }}>↑</span>}
          {data.trend === 'declining' && <span className="text-xs" style={{ color: 'var(--danger)' }}>↓</span>}
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
        {/* Ambient glow */}
        <div
          className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-[0.15] blur-[50px] pointer-events-none"
          style={{ background: getGradeColor(data.grade) }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-5">
          {/* Circular score */}
          <div className="relative w-24 h-24 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {/* Background ring */}
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="var(--glass-border)"
                strokeWidth="8"
              />
              {/* Score ring */}
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke={getScoreColor(data.overallScore)}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${data.overallScore * 2.64} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                {data.overallScore}
              </span>
              <span
                className="text-xs font-bold"
                style={{ color: getGradeColor(data.grade) }}
              >
                {data.grade}
              </span>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text)' }}>
              Your home is in good shape
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
                Active today
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-1.5">
        {data.categories.map((cat) => {
          const s = STATUS_COLORS[cat.status];
          return (
            <Card key={cat.id} padding="sm">
              <div className="flex items-center gap-3">
                <span className="text-lg shrink-0">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {cat.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {s.label}
                      </span>
                      <span className="text-xs font-bold" style={{ color: getScoreColor(cat.score) }}>
                        {cat.score}
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div
                    className="w-full h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'var(--glass)' }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.score}%`,
                        background: getScoreColor(cat.score),
                      }}
                    />
                  </div>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-dim)' }}>
                    {cat.tip}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
