export function PlannerScreen() {
  return (
    <div className="w-[220px] h-[420px] p-3 space-y-3" style={{ background: 'var(--bg)' }}>
      {/* Mini status bar */}
      <div className="flex items-center justify-between px-1 pt-4">
        <span className="text-[8px] font-bold" style={{ color: 'var(--text-dim)' }}>9:41</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-1.5 rounded-sm" style={{ background: 'var(--text-dim)' }} />
          <div className="w-3 h-1.5 rounded-sm" style={{ background: 'var(--text-dim)' }} />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-1.5 px-1">
        <span className="text-sm">💰</span>
        <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>Project Planner</span>
      </div>

      {/* Savings overview */}
      <div className="rounded-xl p-2.5 flex items-center gap-2.5" style={{ background: 'var(--bg-deep)', border: '1px solid var(--glass-border)' }}>
        <div className="relative w-12 h-12 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="10" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--gold)" strokeWidth="10" strokeLinecap="round" strokeDasharray="107.5 264" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>41%</span>
          </div>
        </div>
        <div>
          <p className="text-[8px] font-semibold" style={{ color: 'var(--text)' }}>$5,200 saved</p>
          <p className="text-[6px]" style={{ color: 'var(--text-dim)' }}>of $12,800 target</p>
        </div>
      </div>

      {/* Project cards */}
      {[
        { title: 'Kitchen Backsplash', pct: 88, color: 'var(--emerald)', icon: '🍳', cost: '$3,200' },
        { title: 'Deck Rebuild', pct: 22, color: 'var(--accent)', icon: '🪵', cost: '$5,500' },
        { title: 'Outdoor Shower', pct: 33, color: 'var(--gold)', icon: '🚿', cost: '$2,400' },
        { title: 'Smart Thermostat', pct: 24, color: 'var(--accent)', icon: '🌡️', cost: '$1,700' },
      ].map((p) => (
        <div key={p.title} className="rounded-lg p-2 flex items-center gap-2" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
          <span className="text-[10px]">{p.icon}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[7px] font-semibold" style={{ color: 'var(--text)' }}>{p.title}</span>
              <span className="text-[6px]" style={{ color: 'var(--text-dim)' }}>{p.cost}</span>
            </div>
            <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
              <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
