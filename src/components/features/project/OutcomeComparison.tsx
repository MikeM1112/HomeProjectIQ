'use client';

interface OutcomeComparisonProps {
  estimatedCostLo: number;
  estimatedCostHi: number;
  actualCost?: number | null;
  estimatedTime?: string;
  actualHours?: number | null;
  difficulty?: 'easier' | 'as_expected' | 'harder' | null;
}

export function OutcomeComparison({
  estimatedCostLo,
  estimatedCostHi,
  actualCost,
  estimatedTime,
  actualHours,
  difficulty,
}: OutcomeComparisonProps) {
  if (!actualCost && !actualHours) return null;

  const fmtCurrency = (n: number) => `$${n.toLocaleString()}`;
  const estimatedMid = (estimatedCostLo + estimatedCostHi) / 2;
  const costDiff = actualCost ? actualCost - estimatedMid : null;
  const costSaved = costDiff !== null && costDiff < 0;

  const difficultyLabel = {
    easier: { text: 'Easier than expected', emoji: '😊', color: 'var(--emerald)' },
    as_expected: { text: 'As expected', emoji: '👍', color: 'var(--gold)' },
    harder: { text: 'Harder than expected', emoji: '😤', color: 'var(--danger)' },
  };

  return (
    <div
      className="rounded-2xl p-4 space-y-3"
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
      }}
    >
      <h4 className="font-serif text-base font-semibold" style={{ color: 'var(--text)' }}>
        Estimated vs Actual
      </h4>

      {actualCost !== undefined && actualCost !== null && (
        <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Cost</div>
            <div className="text-sm font-mono" style={{ color: 'var(--text-sub)' }}>
              Est: {fmtCurrency(estimatedCostLo)}–{fmtCurrency(estimatedCostHi)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold font-mono" style={{ color: 'var(--text)' }}>
              {fmtCurrency(actualCost)}
            </div>
            {costDiff !== null && (
              <div
                className="text-xs font-semibold"
                style={{ color: costSaved ? 'var(--emerald)' : 'var(--danger)' }}
              >
                {costSaved ? '↓' : '↑'} {fmtCurrency(Math.abs(costDiff))} {costSaved ? 'under' : 'over'}
              </div>
            )}
          </div>
        </div>
      )}

      {actualHours !== undefined && actualHours !== null && (
        <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <div className="text-xs" style={{ color: 'var(--text-dim)' }}>Time</div>
            <div className="text-sm" style={{ color: 'var(--text-sub)' }}>
              Est: {estimatedTime || 'N/A'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              {actualHours}h
            </div>
          </div>
        </div>
      )}

      {difficulty && (
        <div className="flex items-center gap-2 pt-1">
          <span>{difficultyLabel[difficulty].emoji}</span>
          <span className="text-sm font-medium" style={{ color: difficultyLabel[difficulty].color }}>
            {difficultyLabel[difficulty].text}
          </span>
        </div>
      )}
    </div>
  );
}
