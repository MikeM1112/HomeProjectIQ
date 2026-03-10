'use client';

import { useState } from 'react';
import type { SmartInsight } from '@/lib/demo-data';

interface SmartInsightsProps {
  insights: SmartInsight[];
}

export function SmartInsights({ insights }: SmartInsightsProps) {
  const [current, setCurrent] = useState(0);
  const insight = insights[current];

  if (!insight) return null;

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)]"
      style={{
        background: 'var(--bg-deep)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-[0.12] blur-[60px] pointer-events-none"
        style={{ background: insight.accent }}
        aria-hidden="true"
      />

      <div className="relative p-5">
        {/* Source badge + weather */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase"
            style={{ background: insight.accentBg, color: insight.accent }}
          >
            <span>{insight.icon}</span>
            {insight.label}
          </div>
          {insight.timing && (
            <span className="text-[11px] font-medium" style={{ color: 'var(--text-dim)' }}>
              {insight.timing}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-serif text-xl leading-tight mb-2"
          style={{ color: 'var(--text)' }}
        >
          {insight.title}
        </h3>

        {/* Body */}
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>
          {insight.body}
        </p>

        {/* Navigation dots + arrows */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {insights.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === current ? insight.accent : 'var(--text-dim)',
                  opacity: i === current ? 1 : 0.3,
                  transform: i === current ? 'scale(1.3)' : 'scale(1)',
                }}
                aria-label={`Show insight ${i + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrent((current - 1 + insights.length) % insights.length)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
              style={{ background: 'var(--glass)', color: 'var(--text-sub)' }}
              aria-label="Previous insight"
            >
              &larr;
            </button>
            <button
              onClick={() => setCurrent((current + 1) % insights.length)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors"
              style={{ background: 'var(--glass)', color: 'var(--text-sub)' }}
              aria-label="Next insight"
            >
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
