'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { WallAnalysisData } from '@/lib/demo-data';

interface WallAnalysisProps {
  analysis: WallAnalysisData;
  onAction?: () => void;
}

function getProbColor(pct: number): string {
  if (pct >= 70) return 'var(--danger)';
  if (pct >= 40) return 'var(--gold)';
  return 'var(--emerald)';
}

const SEVERITY_STYLES = {
  critical: { bg: 'var(--danger-soft)', color: 'var(--danger)', label: 'Critical' },
  moderate: { bg: 'var(--gold-soft)', color: 'var(--gold)', label: 'Moderate' },
  low: { bg: 'var(--info-soft)', color: 'var(--info)', label: 'Low' },
};

export function WallAnalysis({ analysis, onAction }: WallAnalysisProps) {
  const [tab, setTab] = useState<'obstacles' | 'checklist' | 'cost'>('obstacles');
  const a = analysis;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          🧱 AI Wall Analysis
        </h3>
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>
          From photo Mar 8
        </span>
      </div>
      <p className="text-[11px] mb-3" style={{ color: 'var(--text-dim)' }}>
        Snap a photo of any wall — AI identifies load-bearing risk and what&apos;s hidden inside.
      </p>

      {/* Verdict hero card */}
      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] p-5 mb-3"
        style={{ background: 'var(--bg-deep)' }}
      >
        <div
          className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-[0.15] blur-[50px] pointer-events-none"
          style={{ background: getProbColor(a.loadBearingProbability) }}
          aria-hidden="true"
        />
        <div className="relative flex items-center gap-5">
          {/* Probability gauge */}
          <div className="relative w-20 h-20 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={getProbColor(a.loadBearingProbability)}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${a.loadBearingProbability * 2.64} 264`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{a.loadBearingProbability}%</span>
              <span className="text-[8px]" style={{ color: 'var(--text-dim)' }}>load-bearing</span>
            </div>
          </div>

          <div className="flex-1">
            <div
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1"
              style={{ background: getProbColor(a.loadBearingProbability), color: 'white' }}
            >
              {a.verdictLabel}
            </div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>
              {a.wallName}
            </p>
            <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-sub)' }}>
              {a.verdictNote}
            </p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-3 p-1 rounded-xl" style={{ background: 'var(--glass)' }}>
        {([
          { key: 'obstacles' as const, label: 'Behind the Wall' },
          { key: 'checklist' as const, label: 'Pro Checklist' },
          { key: 'cost' as const, label: 'Cost Estimate' },
        ]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 text-[11px] font-semibold py-1.5 rounded-lg transition-all duration-200"
            style={
              tab === t.key
                ? { background: 'var(--accent)', color: 'white', boxShadow: '0 2px 8px var(--accent-glow)' }
                : { color: 'var(--text-dim)' }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'obstacles' && (
        <div className="space-y-2 animate-rise">
          {a.obstacles.map((obs) => {
            const s = SEVERITY_STYLES[obs.severity];
            return (
              <div
                key={obs.id}
                className="rounded-xl p-3 border border-[var(--glass-border)]"
                style={{ background: 'var(--glass)' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{obs.icon}</span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{obs.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded" style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                    <span className="text-xs font-bold" style={{ color: getProbColor(obs.probability) }}>{obs.probability}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--glass-border)' }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${obs.probability}%`, background: getProbColor(obs.probability) }} />
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-dim)' }}>{obs.note}</p>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'checklist' && (
        <div className="space-y-2 animate-rise">
          {a.proChecklist.map((item) => (
            <div
              key={item.id}
              className="rounded-xl p-3 border border-[var(--glass-border)] flex items-start gap-3"
              style={{ background: item.critical ? 'var(--danger-soft)' : 'var(--glass)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold"
                style={{ background: item.critical ? 'var(--danger)' : 'var(--accent)', color: 'white' }}
              >
                {item.step}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{item.title}</p>
                  {item.critical && (
                    <span className="text-[8px] font-bold uppercase px-1 py-0.5 rounded" style={{ background: 'var(--danger)', color: 'white' }}>
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[10px]" style={{ color: 'var(--text-sub)' }}>{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'cost' && (
        <div className="space-y-2 animate-rise">
          {[
            { label: 'Structural Engineering', ...a.costEstimate.engineering, icon: '📐' },
            { label: 'Wall Removal + Labor', ...a.costEstimate.removal, icon: '🏗️' },
            { label: 'Building Permit', ...a.costEstimate.permit, icon: '📋' },
            { label: 'LVL/Steel Beam + Install', ...a.costEstimate.beam, icon: '🔩' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl p-3 border border-[var(--glass-border)] flex items-center justify-between"
              style={{ background: 'var(--glass)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm" style={{ color: 'var(--text)' }}>{item.label}</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                ${item.lo.toLocaleString()} – ${item.hi.toLocaleString()}
              </span>
            </div>
          ))}

          {/* Total */}
          <div
            className="rounded-xl p-3 border-2 flex items-center justify-between"
            style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}
          >
            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>Total Estimate</span>
            <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>
              ${a.costEstimate.totalLo.toLocaleString()} – ${a.costEstimate.totalHi.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Warning flags */}
      <div className="mt-3 space-y-1.5">
        {a.warnings.map((w, i) => (
          <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'var(--danger-soft)' }}>
            <span className="text-xs shrink-0">⚠️</span>
            <p className="text-[10px]" style={{ color: 'var(--danger)' }}>{w}</p>
          </div>
        ))}
      </div>

      {/* AI Disclaimer */}
      <div className="mt-2 p-2 rounded-lg" style={{ background: 'var(--glass)' }}>
        <p className="text-[9px] italic" style={{ color: 'var(--text-dim)' }}>
          {a.aiDisclaimer}
        </p>
      </div>

      {/* CTA */}
      <Button onClick={onAction} className="w-full mt-3" size="lg">
        Scan Your Wall
      </Button>
    </div>
  );
}
