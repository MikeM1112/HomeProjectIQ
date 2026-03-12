'use client';

import { Card } from '@/components/ui/Card';
import { useDiyDecision } from '@/hooks/useIntelligence';

export function DIYDecisionCard({ projectId }: { projectId: string }) {
  const { decision, isLoading } = useDiyDecision(projectId);

  if (isLoading) return <Card><div className="text-sm text-[var(--text-sub)]">Analyzing...</div></Card>;
  if (!decision) return null;

  const icon = decision.recommendation === 'DIY' ? '🛠️'
    : decision.recommendation === 'HIRE_PRO' ? '👷'
    : '🤔';

  const recColor = decision.recommendation === 'DIY' ? 'var(--success)'
    : decision.recommendation === 'HIRE_PRO' ? 'var(--accent)'
    : 'var(--warning)';

  const recLabel = decision.recommendation === 'DIY' ? 'DIY This!'
    : decision.recommendation === 'HIRE_PRO' ? 'Hire a Pro'
    : 'Consider Both';

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">DIY vs. Pro</h4>
            <span className="text-xs font-bold" style={{ color: recColor }}>
              {recLabel}
            </span>
          </div>
          {decision.savings > 0 && (
            <span className="ml-auto text-sm font-bold text-[var(--success)]">
              Save ${decision.savings}
            </span>
          )}
        </div>

        {/* Cost comparison */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl p-3" style={{ background: 'var(--glass)' }}>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-sub)]">DIY Cost</p>
            <p className="text-lg font-bold text-[var(--text)]">${decision.diy_cost.total}</p>
            <div className="text-[10px] text-[var(--text-sub)] space-y-0.5 mt-1">
              <div>Materials: ${decision.diy_cost.materials}</div>
              {decision.diy_cost.tools > 0 && <div>Tools: ${decision.diy_cost.tools}</div>}
              <div>Your time: ${decision.diy_cost.time_value}</div>
            </div>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'var(--glass)' }}>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-sub)]">Pro Cost</p>
            <p className="text-lg font-bold text-[var(--text)]">${decision.pro_cost.average}</p>
            <p className="text-[10px] text-[var(--text-sub)] mt-1">
              Range: ${decision.pro_cost.low}–${decision.pro_cost.high}
            </p>
          </div>
        </div>

        {/* Reasoning */}
        {decision.reasoning.length > 0 && (
          <div className="space-y-1">
            {decision.reasoning.map((reason, i) => (
              <p key={i} className="text-xs text-[var(--text-sub)] flex items-start gap-1.5">
                <span className="text-[var(--accent)] mt-0.5">•</span>
                {reason}
              </p>
            ))}
          </div>
        )}

        {/* Safety warning */}
        {!decision.factors.safety_ok && (
          <div className="rounded-lg p-2 bg-[var(--danger)]/10 border border-[var(--danger)]/20">
            <p className="text-xs font-semibold text-[var(--danger)]">
              ⚠️ Safety concern — professional inspection recommended
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
