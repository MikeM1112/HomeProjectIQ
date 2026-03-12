'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCapabilityScore } from '@/hooks/useIntelligence';

const LEVEL_COLORS: Record<string, string> = {
  beginner: '#ef4444',
  developing: '#f97316',
  capable: '#eab308',
  proficient: '#22c55e',
  expert: '#06b6d4',
};

export function CapabilityScoreGauge({ compact }: { compact?: boolean }) {
  const { score, isLoading, recalculate, isCalculating } = useCapabilityScore();

  if (isLoading) return <Card padding={compact ? 'sm' : 'md'}><div className="text-sm text-[var(--text-sub)]">Loading...</div></Card>;

  const value = score?.overall_score ?? 0;
  const level = score?.capability_level ?? 'beginner';
  const color = LEVEL_COLORS[level] ?? LEVEL_COLORS.beginner;

  // SVG gauge arc
  const radius = compact ? 35 : 50;
  const circumference = Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Card padding={compact ? 'sm' : 'md'}>
      <div className="flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <svg width={radius * 2 + 10} height={radius + 15} viewBox={`0 0 ${radius * 2 + 10} ${radius + 15}`}>
            <path
              d={`M 5 ${radius + 5} A ${radius} ${radius} 0 0 1 ${radius * 2 + 5} ${radius + 5}`}
              fill="none"
              stroke="var(--glass-border)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d={`M 5 ${radius + 5} A ${radius} ${radius} 0 0 1 ${radius * 2 + 5} ${radius + 5}`}
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000"
            />
            <text x={radius + 5} y={radius} textAnchor="middle" className="fill-[var(--text)]" fontSize={compact ? '18' : '24'} fontWeight="bold">
              {value}
            </text>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold text-[var(--text)] ${compact ? 'text-sm' : 'text-base'}`}>Home Capability</h3>
          <p className="text-sm capitalize" style={{ color }}>{level}</p>
          {!compact && score?.suggestions && (
            <ul className="mt-2 space-y-1">
              {(Array.isArray(score.suggestions) ? score.suggestions : []).slice(0, 2).map((s, i) => (
                <li key={i} className="text-xs text-[var(--text-sub)]">· {String(s)}</li>
              ))}
            </ul>
          )}
          {!compact && (
            <Button size="sm" variant="ghost" className="mt-2" loading={isCalculating} onClick={() => recalculate()}>
              Recalculate
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
