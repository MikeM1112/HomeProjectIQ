export function AssessmentScreen() {
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
        <span className="text-[8px]" style={{ color: 'var(--text-dim)' }}>&larr;</span>
        <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>AI Assessment</span>
      </div>

      {/* Verdict card */}
      <div className="rounded-xl p-3" style={{ background: 'var(--emerald-soft)', border: '1px solid var(--emerald)' }}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--emerald)' }}>
            <span className="text-white text-[10px] font-bold">92%</span>
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase" style={{ color: 'var(--emerald)' }}>DIY Recommended</p>
            <p className="text-[9px] font-semibold" style={{ color: 'var(--text)' }}>Kitchen Faucet</p>
          </div>
        </div>
        <p className="text-[6px]" style={{ color: 'var(--text-sub)' }}>Beginner-friendly project</p>
      </div>

      {/* Cost comparison */}
      <div className="grid grid-cols-2 gap-1.5">
        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--emerald-soft)' }}>
          <p className="text-[6px] font-semibold" style={{ color: 'var(--emerald)' }}>DIY Cost</p>
          <p className="text-[9px] font-bold" style={{ color: 'var(--text)' }}>$25 – $60</p>
        </div>
        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--gold-soft)' }}>
          <p className="text-[6px] font-semibold" style={{ color: 'var(--gold)' }}>Pro Cost</p>
          <p className="text-[9px] font-bold" style={{ color: 'var(--text)' }}>$150 – $300</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        <p className="text-[7px] font-semibold" style={{ color: 'var(--text-dim)' }}>STEPS</p>
        {['Shut off water', 'Remove old faucet', 'Install new faucet', 'Test connections'].map((step, i) => (
          <div key={step} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'var(--glass)' }}>
            <div className="w-3 h-3 rounded-full flex items-center justify-center text-[6px] font-bold" style={{ background: 'var(--accent)', color: 'white' }}>
              {i + 1}
            </div>
            <span className="text-[7px]" style={{ color: 'var(--text)' }}>{step}</span>
          </div>
        ))}
      </div>

      {/* Tools */}
      <div className="rounded-lg p-2" style={{ background: 'var(--glass)' }}>
        <p className="text-[6px] font-semibold mb-1" style={{ color: 'var(--text-dim)' }}>TOOLS NEEDED</p>
        <div className="flex gap-1.5">
          {['🔧', '🔦', '🩹'].map((tool) => (
            <div key={tool} className="w-6 h-6 rounded flex items-center justify-center text-[10px]" style={{ background: 'var(--accent-soft)' }}>
              {tool}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
