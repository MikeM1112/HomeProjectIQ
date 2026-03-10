'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { DiagnosisShowcase } from '@/lib/demo-data';

interface DiagnosisGalleryProps {
  showcases: DiagnosisShowcase[];
  onAction?: () => void;
}

const SEVERITY_STYLES = {
  critical: { bg: 'var(--danger-soft)', color: 'var(--danger)' },
  moderate: { bg: 'var(--gold-soft)', color: 'var(--gold)' },
  cosmetic: { bg: 'var(--emerald-soft)', color: 'var(--emerald)' },
};

export function DiagnosisGallery({ showcases, onAction }: DiagnosisGalleryProps) {
  const [current, setCurrent] = useState(0);
  const showcase = showcases[current];

  if (!showcase) return null;

  return (
    <div>
      <h3 className="font-serif text-lg mb-1" style={{ color: 'var(--text)' }}>
        🔍 AI Diagnosis Gallery
      </h3>
      <p className="text-[11px] mb-3" style={{ color: 'var(--text-dim)' }}>
        See how AI identifies common home issues — mold, cracks, damage, and more.
      </p>

      <div
        className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)]"
        style={{ background: 'var(--bg-deep)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.12] blur-[60px] pointer-events-none"
          style={{ background: 'var(--accent)' }}
          aria-hidden="true"
        />

        <div className="relative p-5">
          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              {showcase.title}
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
              {current + 1} of {showcases.length}
            </span>
          </div>

          {/* A vs B comparison */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[showcase.optionA, showcase.optionB].map((opt, i) => {
              const sev = SEVERITY_STYLES[opt.severity];
              return (
                <div
                  key={i}
                  className="rounded-xl p-3 text-center border border-[var(--glass-border)]"
                  style={{ background: 'var(--glass)' }}
                >
                  <span className="text-2xl block mb-1">{opt.icon}</span>
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text)' }}>{opt.label}</p>
                  <span
                    className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded inline-block"
                    style={{ background: sev.bg, color: sev.color }}
                  >
                    {opt.severityLabel}
                  </span>
                </div>
              );
            })}
          </div>

          {/* AI Verdict */}
          <div
            className="rounded-xl p-3 mb-3 border"
            style={{ borderColor: 'var(--accent)', background: 'var(--accent-soft)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase" style={{ color: 'var(--accent)' }}>
                AI Verdict
              </span>
              <span className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>
                {showcase.confidence}% confidence
              </span>
            </div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              {showcase.verdict}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-xs shrink-0">🔧</span>
              <div>
                <p className="text-[10px] font-semibold" style={{ color: 'var(--text-sub)' }}>Action Required</p>
                <p className="text-[11px]" style={{ color: 'var(--text)' }}>{showcase.actionRequired}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-xs">💰</span>
                <span className="text-[11px] font-medium" style={{ color: 'var(--text)' }}>{showcase.costEstimate}</span>
              </div>
              <span
                className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                style={{
                  background: showcase.diyFeasible ? 'var(--emerald-soft)' : 'var(--gold-soft)',
                  color: showcase.diyFeasible ? 'var(--emerald)' : 'var(--gold)',
                }}
              >
                {showcase.diyFeasible ? 'DIY Feasible' : 'Hire a Pro'}
              </span>
            </div>
            <div className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'var(--info-soft)' }}>
              <span className="text-xs shrink-0">💡</span>
              <p className="text-[10px]" style={{ color: 'var(--info)' }}>{showcase.proTip}</p>
            </div>
          </div>

          {/* Navigation dots + arrows */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {showcases.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    background: i === current ? 'var(--accent)' : 'var(--text-dim)',
                    opacity: i === current ? 1 : 0.3,
                    transform: i === current ? 'scale(1.3)' : 'scale(1)',
                  }}
                  aria-label={`Show showcase ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrent((current - 1 + showcases.length) % showcases.length)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
                style={{ background: 'var(--glass)', color: 'var(--text-sub)' }}
                aria-label="Previous showcase"
              >
                &larr;
              </button>
              <button
                onClick={() => setCurrent((current + 1) % showcases.length)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
                style={{ background: 'var(--glass)', color: 'var(--text-sub)' }}
                aria-label="Next showcase"
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Button onClick={onAction} className="w-full mt-3" size="lg">
        Try AI Diagnosis
      </Button>
    </div>
  );
}
