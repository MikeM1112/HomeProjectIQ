export function DashboardScreen() {
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

      {/* App header */}
      <div className="flex items-center gap-1.5 px-1">
        <span className="text-sm">🏠</span>
        <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>HomeProjectIQ</span>
      </div>

      {/* Health score card */}
      <div className="rounded-xl p-2.5" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
        <div className="flex items-center gap-2.5">
          <div className="relative w-12 h-12 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--emerald)" strokeWidth="10" strokeLinecap="round" strokeDasharray="216.5 264" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>82</span>
              <span className="text-[6px]" style={{ color: 'var(--emerald)' }}>B+</span>
            </div>
          </div>
          <div>
            <p className="text-[8px] font-semibold" style={{ color: 'var(--text)' }}>Home Health</p>
            <p className="text-[6px]" style={{ color: 'var(--text-dim)' }}>7 of 9 systems good</p>
          </div>
        </div>
      </div>

      {/* Smart insight mini */}
      <div className="rounded-xl p-2.5" style={{ background: 'var(--bg-deep)', border: '1px solid var(--glass-border)' }}>
        <span className="text-[6px] font-bold uppercase px-1 py-0.5 rounded" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
          AI Insight
        </span>
        <p className="text-[7px] mt-1 leading-tight" style={{ color: 'var(--text)' }}>Perfect week for grass seed</p>
        <p className="text-[6px] mt-0.5" style={{ color: 'var(--text-dim)' }}>Soil temp is 55°F</p>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { val: '14', label: 'Projects', color: 'var(--accent)' },
          { val: '$1.8K', label: 'Saved', color: 'var(--emerald)' },
          { val: '12', label: 'Streak', color: 'var(--gold)' },
        ].map((s) => (
          <div key={s.label} className="rounded-lg p-1.5 text-center" style={{ background: 'var(--glass)' }}>
            <p className="text-[9px] font-bold" style={{ color: s.color }}>{s.val}</p>
            <p className="text-[5px]" style={{ color: 'var(--text-dim)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Mini project list */}
      <div className="space-y-1">
        {['Kitchen Faucet', 'Deck Staining', 'Toilet Fix'].map((p, i) => (
          <div key={p} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: 'var(--glass)' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: i === 0 ? 'var(--emerald)' : i === 1 ? 'var(--gold)' : 'var(--emerald)' }} />
            <span className="text-[7px]" style={{ color: 'var(--text)' }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
