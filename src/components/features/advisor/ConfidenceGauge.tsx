'use client';

import { useEffect, useState } from 'react';
import { getConfidenceLabel } from '@/lib/utils';

interface ConfidenceGaugeProps {
  value: number;
}

export function ConfidenceGauge({ value }: ConfidenceGaugeProps) {
  const [displayed, setDisplayed] = useState(0);
  const verdict = getConfidenceLabel(value);

  useEffect(() => {
    const duration = 600;
    const start = performance.now();
    let rafId: number;
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * value));
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

  const radius = 80;
  const stroke = 10;
  const circumference = Math.PI * radius;
  const offset = circumference - (displayed / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[200px] h-[120px]">
        <svg viewBox="0 0 200 120" className="w-full h-full">
          <path
            d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
            fill="none"
            stroke="#E5E0DB"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={`M ${100 - radius} 100 A ${radius} ${radius} 0 0 1 ${100 + radius} 100`}
            fill="none"
            stroke={verdict.color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="font-serif text-4xl font-bold" style={{ color: verdict.color }}>
            {displayed}
          </span>
        </div>
      </div>
      <div
        className="tag text-sm"
        style={{ backgroundColor: verdict.bg, color: verdict.color }}
      >
        {verdict.label}
      </div>
    </div>
  );
}
