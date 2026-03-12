'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRiskRadar } from '@/hooks/useIntelligence';

const RISK_COLORS: Record<string, string> = {
  low: '#22c55e',
  moderate: '#eab308',
  high: '#f97316',
  critical: '#ef4444',
};

const RISK_BG: Record<string, string> = {
  low: 'bg-green-400/10',
  moderate: 'bg-yellow-400/10',
  high: 'bg-orange-400/10',
  critical: 'bg-red-400/10',
};

export function RiskRadarChart({ compact }: { compact?: boolean }) {
  const { risks, criticalCount, highCount, isLoading, recalculate, isCalculating } = useRiskRadar();

  if (isLoading) return <Card padding={compact ? 'sm' : 'md'}><div className="text-sm text-[var(--text-sub)]">Loading...</div></Card>;

  if (risks.length === 0) {
    return (
      <Card padding={compact ? 'sm' : 'md'}>
        <h3 className="font-semibold text-[var(--text)] text-sm">Risk Radar</h3>
        <p className="text-xs text-[var(--text-sub)] mt-1">Add home systems to see risk analysis</p>
        {!compact && <Button size="sm" variant="ghost" className="mt-2" loading={isCalculating} onClick={() => recalculate()}>Analyze Risks</Button>}
      </Card>
    );
  }

  return (
    <Card padding={compact ? 'sm' : 'md'}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-[var(--text)] text-sm">Risk Radar</h3>
        {(criticalCount > 0 || highCount > 0) && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-400/10 text-red-400">
            {criticalCount + highCount} alert{criticalCount + highCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {risks.slice(0, compact ? 3 : undefined).map((risk) => (
          <div key={risk.id} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: RISK_COLORS[risk.risk_level] }} />
            <span className="text-sm text-[var(--text)] flex-1 capitalize truncate">{risk.system_type}</span>
            <span className={`px-1.5 py-0.5 rounded text-xs capitalize ${RISK_BG[risk.risk_level]}`} style={{ color: RISK_COLORS[risk.risk_level] }}>
              {risk.risk_level}
            </span>
            <span className="text-xs text-[var(--text-sub)] w-8 text-right">{risk.risk_score}</span>
          </div>
        ))}
      </div>

      {!compact && (
        <Button size="sm" variant="ghost" className="mt-3" loading={isCalculating} onClick={() => recalculate()}>
          Refresh Analysis
        </Button>
      )}
    </Card>
  );
}
