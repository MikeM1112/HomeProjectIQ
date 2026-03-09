'use client';

import { useState, useEffect } from 'react';

const TIPS = [
  { emoji: '💡', tip: 'Always turn off the water supply before working on any plumbing fixture.', category: 'Plumbing' },
  { emoji: '⚡', tip: 'Never work on electrical without turning off the breaker first — and test with a voltage tester.', category: 'Electrical' },
  { emoji: '🎨', tip: 'For a smooth paint finish, sand between coats with 220-grit sandpaper.', category: 'Painting' },
  { emoji: '🔧', tip: 'When drilling into walls, use a stud finder first to avoid pipes and wires.', category: 'General' },
  { emoji: '📏', tip: 'Measure twice, cut once — the oldest rule in carpentry for a reason.', category: 'Carpentry' },
  { emoji: '🧤', tip: 'Always wear safety glasses and gloves when using power tools.', category: 'Safety' },
  { emoji: '🌡️', tip: 'Change your HVAC filter every 1-3 months for optimal efficiency.', category: 'HVAC' },
  { emoji: '🚿', tip: 'Clean your showerhead with vinegar overnight to remove mineral buildup.', category: 'Plumbing' },
  { emoji: '🔋', tip: 'Test smoke detectors monthly and replace batteries every 6 months.', category: 'Safety' },
  { emoji: '🪵', tip: 'Use wood filler for small holes — spackle is only for drywall.', category: 'Carpentry' },
  { emoji: '💧', tip: 'A running toilet can waste 200+ gallons per day. Fix the flapper valve.', category: 'Plumbing' },
  { emoji: '🔌', tip: 'GFCI outlets should be tested monthly — press the test/reset buttons.', category: 'Electrical' },
  { emoji: '🧊', tip: 'Insulate exposed pipes before winter to prevent costly burst pipe repairs.', category: 'Plumbing' },
  { emoji: '🏠', tip: 'Caulk around windows and doors annually to save up to 15% on energy bills.', category: 'Exterior' },
  { emoji: '🌿', tip: 'Keep mulch 6 inches away from your foundation to prevent termite issues.', category: 'Landscaping' },
];

export function QuickTips() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * TIPS.length));
  }, []);

  const tip = TIPS[tipIndex];

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: 'var(--accent-soft)' }}
        >
          {tip.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
              Pro Tip
            </span>
            <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
              {tip.category}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            {tip.tip}
          </p>
        </div>
      </div>
      <button
        onClick={() => setTipIndex((tipIndex + 1) % TIPS.length)}
        className="mt-3 text-xs font-semibold"
        style={{ color: 'var(--accent)' }}
      >
        Next Tip →
      </button>
    </div>
  );
}
