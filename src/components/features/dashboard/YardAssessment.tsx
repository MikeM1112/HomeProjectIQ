'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { YardAssessment as YardAssessmentData } from '@/lib/demo-data';

interface YardAssessmentProps {
  assessment: YardAssessmentData;
  onAction?: () => void;
}

const SEVERITY_STYLES = {
  high: { bg: 'var(--danger-soft)', color: 'var(--danger)' },
  medium: { bg: 'var(--gold-soft)', color: 'var(--gold)' },
  low: { bg: 'var(--info-soft)', color: 'var(--info)' },
};

function getHealthColor(pct: number): string {
  if (pct >= 80) return 'var(--emerald)';
  if (pct >= 60) return 'var(--gold)';
  return 'var(--danger)';
}

export function YardAssessment({ assessment, onAction }: YardAssessmentProps) {
  const [tab, setTab] = useState<'overview' | 'materials' | 'plan'>('overview');
  const a = assessment;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          🌱 Yard AI Assessment
        </h3>
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>
          From photo Mar 8
        </span>
      </div>
      <p className="text-[11px] mb-3" style={{ color: 'var(--text-dim)' }}>
        Snap a photo of your yard — AI estimates exactly what you need.
      </p>

      {/* Health overview card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] p-4 mb-3"
        style={{ background: 'var(--bg-deep)' }}
      >
        <div
          className="absolute -top-12 -right-12 w-28 h-28 rounded-full opacity-[0.12] blur-[40px] pointer-events-none"
          style={{ background: getHealthColor(a.healthPct) }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-4">
          {/* Health ring */}
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={getHealthColor(a.healthPct)}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${a.healthPct * 2.51} 251`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{a.healthPct}%</span>
              <span className="text-[9px]" style={{ color: 'var(--text-dim)' }}>healthy</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {a.estimatedSqFt.toLocaleString()} sq ft yard
            </p>
            <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
              {a.grassType} &middot; {a.barePatchPct}% bare/thin
            </p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
                Need: {a.seedCalculation.overseedLbs} lbs seed
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}>
                ${a.seedCalculation.totalCostLo}-${a.seedCalculation.totalCostHi}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-3 p-1 rounded-xl" style={{ background: 'var(--glass)' }}>
        {(['overview', 'materials', 'plan'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all capitalize"
            style={tab === t
              ? { background: 'var(--accent)', color: 'white', boxShadow: '0 2px 8px var(--accent-glow)' }
              : { color: 'var(--text-dim)' }
            }
          >
            {t === 'overview' ? 'Issues' : t === 'materials' ? `Materials (${a.materials.length})` : `Plan (${a.aiPlan.length} steps)`}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="space-y-2">
          {a.issues.map((issue) => {
            const sv = SEVERITY_STYLES[issue.severity];
            return (
              <Card key={issue.id} padding="sm">
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{issue.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{issue.title}</p>
                      <span className="text-[9px] font-bold uppercase px-1 py-0.5 rounded" style={{ background: sv.bg, color: sv.color }}>
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                      {issue.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
          <p className="text-[10px] leading-relaxed p-2 rounded-lg" style={{ background: 'var(--glass)', color: 'var(--text-sub)' }}>
            <strong>Seed math:</strong> {a.seedCalculation.coverageNote}
          </p>
        </div>
      )}

      {tab === 'materials' && (
        <div className="space-y-2">
          {a.materials.map((m, i) => (
            <Card key={i} padding="sm">
              <div className="flex items-center gap-3">
                <span className="text-lg shrink-0">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{m.name}</p>
                    {m.tag && (
                      <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: m.tag.includes('NOT') ? 'var(--danger-soft)' : 'var(--accent-soft)', color: m.tag.includes('NOT') ? 'var(--danger)' : 'var(--accent)' }}>
                        {m.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                    {m.quantity} &middot; {m.store}
                  </p>
                </div>
                <span className="text-xs font-bold shrink-0" style={{ color: m.estimatedCost > 0 ? 'var(--text)' : 'var(--emerald)' }}>
                  {m.estimatedCost > 0 ? `$${m.estimatedCost}` : 'Owned'}
                </span>
              </div>
            </Card>
          ))}
          <div className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'var(--glass)' }}>
            <span className="text-[11px] font-semibold" style={{ color: 'var(--text)' }}>Estimated Total</span>
            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
              ${a.materials.reduce((sum, m) => sum + m.estimatedCost, 0)}
            </span>
          </div>
        </div>
      )}

      {tab === 'plan' && (
        <div className="space-y-2">
          {a.aiPlan.map((step) => (
            <Card key={step.step} padding="sm">
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  {step.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {step.icon} {step.title}
                    </p>
                  </div>
                  <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-dim)' }}>
                    {step.description}
                  </p>
                  <span className="text-[10px] font-semibold mt-1 inline-block" style={{ color: 'var(--accent)' }}>
                    {step.timing}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button onClick={onAction} className="w-full mt-3" size="lg">
        📸 Scan Your Yard
      </Button>
    </div>
  );
}
