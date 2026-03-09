'use client';

interface SavingsInsightProps {
  totalSavings: number;
  projectCount: number;
}

export function SavingsInsight({ totalSavings, projectCount }: SavingsInsightProps) {
  if (projectCount === 0) return null;

  const avgSavings = projectCount > 0 ? Math.round(totalSavings / projectCount) : 0;
  const fmtCurrency = (n: number) => `$${n.toLocaleString()}`;

  // Fun comparisons
  const comparisons = [
    { threshold: 50, text: `That's a nice dinner out!`, emoji: '🍽️' },
    { threshold: 100, text: `That's a month of streaming services!`, emoji: '📺' },
    { threshold: 250, text: `That's a weekend getaway!`, emoji: '✈️' },
    { threshold: 500, text: `That's a new appliance!`, emoji: '🏠' },
    { threshold: 1000, text: `That's a vacation fund!`, emoji: '🏖️' },
    { threshold: 2500, text: `That's serious home equity!`, emoji: '📈' },
    { threshold: 5000, text: `You're saving like a pro!`, emoji: '🏆' },
  ];

  const comparison = [...comparisons].reverse().find(c => totalSavings >= c.threshold) || comparisons[0];

  return (
    <div
      className="rounded-2xl p-5 text-center"
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <div className="text-[10px] uppercase tracking-[1px] font-semibold mb-2" style={{ color: 'var(--text-dim)' }}>
        Total DIY Savings
      </div>
      <div className="text-4xl font-extrabold font-mono mb-1" style={{ color: 'var(--emerald)' }}>
        {fmtCurrency(totalSavings)}
      </div>
      <div className="text-xs mb-4" style={{ color: 'var(--text-dim)' }}>
        {projectCount} project{projectCount !== 1 ? 's' : ''} · avg {fmtCurrency(avgSavings)} saved each
      </div>
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}
      >
        <span>{comparison.emoji}</span>
        <span>{comparison.text}</span>
      </div>
    </div>
  );
}
