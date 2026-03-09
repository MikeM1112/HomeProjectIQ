'use client';

import { useEffect, useState } from 'react';
import { cn, getVerdictLabel, getVerdictColor, formatCurrency, getConfidenceLabel } from '@/lib/utils';

interface ShareCardPreviewProps {
  title: string;
  confidence: number;
  verdict: 'diy_easy' | 'diy_caution' | 'hire_pro';
  savings: number;
  category: string;
}

export function ShareCardPreview({ title, confidence, verdict, savings, category }: ShareCardPreviewProps) {
  const [displayed, setDisplayed] = useState(0);
  const [visible, setVisible] = useState(false);

  const verdictLabel = getVerdictLabel(verdict);
  const verdictColor = getVerdictColor(verdict);
  const confidenceInfo = getConfidenceLabel(confidence);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 600;
    const start = performance.now();
    let rafId: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * confidence));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [confidence, visible]);

  const radius = 50;
  const stroke = 8;
  const circumference = Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  const gradientClass = cn({
    'from-green-100 via-emerald-50 to-green-50': verdict === 'diy_easy',
    'from-amber-100 via-yellow-50 to-amber-50': verdict === 'diy_caution',
    'from-red-100 via-rose-50 to-red-50': verdict === 'hire_pro',
  });

  return (
    <div
      className={cn(
        'rounded-2xl overflow-hidden border border-border shadow-md transition-all duration-500',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      {/* Verdict strip */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ backgroundColor: verdictColor }}
      >
        <span className="text-white text-xs font-bold tracking-wide uppercase">
          {verdictLabel}
        </span>
        {category && (
          <span className="text-white/80 text-xs font-medium capitalize">
            {category}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className={cn('bg-gradient-to-br p-5', gradientClass)}>
        <div className="flex gap-4 items-center">
          {/* Gauge */}
          <div className="shrink-0">
            <div className="relative w-[120px] h-[72px]">
              <svg viewBox="0 0 120 72" className="w-full h-full">
                <path
                  d={`M ${60 - radius} 60 A ${radius} ${radius} 0 0 1 ${60 + radius} 60`}
                  fill="none"
                  stroke="#E5E0DB"
                  strokeWidth={stroke}
                  strokeLinecap="round"
                />
                <path
                  d={`M ${60 - radius} 60 A ${radius} ${radius} 0 0 1 ${60 + radius} 60`}
                  fill="none"
                  stroke={verdictColor}
                  strokeWidth={stroke}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-0">
                <span
                  className="font-serif text-2xl font-bold"
                  style={{ color: verdictColor }}
                >
                  {displayed}
                </span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-base font-semibold text-ink leading-snug truncate">
              {title}
            </h3>
            <div
              className="tag text-[10px] mt-1.5"
              style={{ backgroundColor: confidenceInfo.bg, color: confidenceInfo.color }}
            >
              {confidenceInfo.label}
            </div>
            {savings > 0 && (
              <p className="text-xs text-brand font-semibold mt-1.5">
                Save up to {formatCurrency(savings)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white px-4 py-2.5 flex items-center justify-between border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🏠</span>
          <span className="text-xs font-semibold text-ink-sub">HomeProjectIQ</span>
        </div>
        <span className="text-[10px] text-ink-dim">
          Get your free assessment
        </span>
      </div>
    </div>
  );
}
