export function DiagnoseScreen() {
  return (
    <div className="w-[220px] h-[420px] p-3 space-y-2.5" style={{ background: 'var(--bg)' }}>
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
        <span className="text-sm">🔍</span>
        <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>Diagnose</span>
      </div>

      {/* Mascot chat bubble */}
      <div className="flex items-start gap-2 px-1">
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--accent-soft)' }}>
          <span className="text-[10px]">🤖</span>
        </div>
        <div className="rounded-xl rounded-tl-none p-2 flex-1" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
          <p className="text-[7px] leading-tight" style={{ color: 'var(--text)' }}>Hi! What&apos;s going on?</p>
        </div>
      </div>

      {/* Text input */}
      <div className="rounded-lg px-2 py-1.5 flex items-center" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <span className="text-[7px]" style={{ color: 'var(--text-dim)' }}>Describe what&apos;s wrong...</span>
      </div>

      {/* Camera + Gallery buttons */}
      <div className="flex gap-1.5">
        <div className="flex-1 rounded-lg py-1.5 flex items-center justify-center gap-1" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}>
          <span className="text-[9px]">📷</span>
          <span className="text-[6px] font-semibold" style={{ color: 'var(--accent)' }}>Camera</span>
        </div>
        <div className="flex-1 rounded-lg py-1.5 flex items-center justify-center gap-1" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}>
          <span className="text-[9px]">🖼️</span>
          <span className="text-[6px] font-semibold" style={{ color: 'var(--accent)' }}>Gallery</span>
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-1 px-1">
        {['All', 'Easy', 'Medium', 'Hard'].map((pill, i) => (
          <div
            key={pill}
            className="rounded-full px-2 py-0.5 text-[6px] font-semibold"
            style={{
              background: i === 0 ? 'var(--accent)' : 'var(--glass)',
              color: i === 0 ? 'white' : 'var(--text-dim)',
              border: i === 0 ? 'none' : '1px solid var(--glass-border)',
            }}
          >
            {pill}
          </div>
        ))}
      </div>

      {/* Categories list */}
      <div className="space-y-1">
        <p className="text-[6px] font-semibold px-1" style={{ color: 'var(--text-dim)' }}>CATEGORIES</p>
        {[
          { name: 'Plumbing', icon: '🔧', color: 'var(--accent)' },
          { name: 'Electrical', icon: '⚡', color: 'var(--gold)' },
          { name: 'HVAC', icon: '❄️', color: 'var(--emerald)' },
          { name: 'Roofing', icon: '🏠', color: 'var(--accent)' },
        ].map((cat) => (
          <div key={cat.name} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: 'var(--glass)' }}>
            <span className="text-[9px]">{cat.icon}</span>
            <span className="text-[7px] font-medium" style={{ color: 'var(--text)' }}>{cat.name}</span>
            <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function GuidedRepairScreen() {
  return (
    <div className="w-[220px] h-[420px] p-3 space-y-2.5" style={{ background: 'var(--bg)' }}>
      {/* Mini status bar */}
      <div className="flex items-center justify-between px-1 pt-4">
        <span className="text-[8px] font-bold" style={{ color: 'var(--text-dim)' }}>9:41</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-1.5 rounded-sm" style={{ background: 'var(--text-dim)' }} />
          <div className="w-3 h-1.5 rounded-sm" style={{ background: 'var(--text-dim)' }} />
        </div>
      </div>

      {/* Header with back arrow */}
      <div className="flex items-center gap-1.5 px-1">
        <span className="text-[8px]" style={{ color: 'var(--text-dim)' }}>&larr;</span>
        <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>Guided Repair</span>
      </div>

      {/* Progress */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[7px] font-semibold" style={{ color: 'var(--accent)' }}>Step 2 of 6</span>
          <span className="text-[6px]" style={{ color: 'var(--text-dim)' }}>33%</span>
        </div>
        <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
          <div className="h-full rounded-full" style={{ width: '33%', background: 'var(--accent)' }} />
        </div>
      </div>

      {/* Step instruction card */}
      <div className="rounded-xl p-3" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
        <span className="text-[6px] font-bold uppercase px-1 py-0.5 rounded" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
          Step 2
        </span>
        <p className="text-[8px] font-semibold mt-1.5 leading-tight" style={{ color: 'var(--text)' }}>
          Remove the old faucet cartridge
        </p>
        <p className="text-[6px] mt-1 leading-tight" style={{ color: 'var(--text-dim)' }}>
          Use pliers to grip and pull straight up
        </p>
      </div>

      {/* Photo upload zone */}
      <div
        className="rounded-xl p-3 flex flex-col items-center justify-center gap-1"
        style={{
          border: '1.5px dashed var(--border)',
          background: 'var(--bg-deep)',
          minHeight: '52px',
        }}
      >
        <span className="text-[14px]">📸</span>
        <p className="text-[6px] font-medium" style={{ color: 'var(--text-dim)' }}>Upload progress photo</p>
      </div>

      {/* Pro tip */}
      <div className="rounded-lg p-2" style={{ background: 'var(--accent-soft)' }}>
        <p className="text-[6px] font-bold" style={{ color: 'var(--accent)' }}>💡 Pro Tip</p>
        <p className="text-[6px] mt-0.5 leading-tight" style={{ color: 'var(--text)' }}>
          Take a photo before removal so you remember the orientation
        </p>
      </div>

      {/* Mark Complete button */}
      <div className="rounded-lg py-2 text-center" style={{ background: 'var(--accent)' }}>
        <span className="text-[8px] font-bold" style={{ color: 'white' }}>Mark Complete</span>
      </div>

      {/* Step dots */}
      <div className="flex items-center justify-center gap-1.5 pt-1">
        {[0, 1, 2, 3, 4, 5].map((dot) => (
          <div
            key={dot}
            className="rounded-full"
            style={{
              width: dot === 1 ? '12px' : '4px',
              height: '4px',
              background: dot === 1 ? 'var(--accent)' : dot < 1 ? 'var(--emerald)' : 'var(--glass-border)',
              borderRadius: '9999px',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function ToolboxScreen() {
  return (
    <div className="w-[220px] h-[420px] p-3 space-y-2.5" style={{ background: 'var(--bg)' }}>
      {/* Mini status bar */}
      <div className="flex items-center justify-between px-1 pt-4">
        <span className="text-[8px] font-bold" style={{ color: 'var(--text-dim)' }}>9:41</span>
        <div className="flex gap-0.5">
          <div className="w-3 h-1.5 rounded-sm" style={{ background: 'var(--text-dim)' }} />
          <div className="w-3 h-1.5 rounded-sm" style={{ background: 'var(--text-dim)' }} />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🧰</span>
          <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>My Toolbox</span>
        </div>
        <span className="text-[7px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: 'var(--glass)', color: 'var(--text-dim)' }}>
          12 tools
        </span>
      </div>

      {/* Search bar */}
      <div className="rounded-lg px-2 py-1.5 flex items-center gap-1.5" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
        <span className="text-[8px]" style={{ color: 'var(--text-dim)' }}>🔍</span>
        <span className="text-[7px]" style={{ color: 'var(--text-dim)' }}>Search tools...</span>
      </div>

      {/* Tool cards */}
      <div className="space-y-1.5">
        {[
          { name: 'Adjustable Wrench', owned: true, condition: 'Good', condColor: 'var(--emerald)', icon: '🔧' },
          { name: 'Drill Set', owned: true, condition: 'Good', condColor: 'var(--emerald)', icon: '🔩' },
          { name: 'Pliers', owned: true, condition: 'Fair', condColor: 'var(--gold)', icon: '🔧' },
          { name: 'Tile Cutter', owned: false, condition: 'Need', condColor: 'var(--accent)', icon: '🪚' },
        ].map((tool) => (
          <div key={tool.name} className="flex items-center gap-2 px-2 py-2 rounded-xl" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--bg-deep)' }}>
              <span className="text-[10px]">{tool.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[7px] font-semibold truncate" style={{ color: 'var(--text)' }}>{tool.name}</span>
                <span className="text-[8px]">{tool.owned ? '✅' : '❌'}</span>
              </div>
              <span
                className="text-[5px] font-bold uppercase px-1 py-px rounded mt-0.5 inline-block"
                style={{
                  background: tool.owned ? (tool.condition === 'Good' ? 'var(--emerald-soft)' : 'var(--gold-soft)') : 'var(--accent-soft)',
                  color: tool.condColor,
                }}
              >
                {tool.condition}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Add Tool button */}
      <div className="rounded-lg py-2 text-center" style={{ background: 'var(--accent)', marginTop: 'auto' }}>
        <span className="text-[8px] font-bold" style={{ color: 'white' }}>+ Add Tool</span>
      </div>
    </div>
  );
}

export function RiskRadarScreen() {
  return (
    <div className="w-[220px] h-[420px] p-3 space-y-2.5" style={{ background: 'var(--bg)' }}>
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
        <span className="text-sm">📡</span>
        <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>Risk Radar</span>
      </div>

      {/* Radar chart */}
      <div className="flex items-center justify-center py-1">
        <div className="relative w-[130px] h-[130px]">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Background rings */}
            <circle cx="100" cy="100" r="90" fill="none" stroke="var(--glass-border)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="68" fill="none" stroke="var(--glass-border)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="45" fill="none" stroke="var(--glass-border)" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="22" fill="none" stroke="var(--glass-border)" strokeWidth="0.5" />
            {/* Radar spokes */}
            <line x1="100" y1="10" x2="100" y2="190" stroke="var(--glass-border)" strokeWidth="0.5" />
            <line x1="14.5" y1="50.5" x2="185.5" y2="149.5" stroke="var(--glass-border)" strokeWidth="0.5" />
            <line x1="14.5" y1="149.5" x2="185.5" y2="50.5" stroke="var(--glass-border)" strokeWidth="0.5" />
            {/* Data polygon - HVAC(top), Plumbing(top-right), Electrical(bot-right), Roof(bot-left), Foundation(top-left) */}
            <polygon
              points="100,30 165,65 150,155 50,155 35,65"
              fill="var(--accent)"
              fillOpacity="0.15"
              stroke="var(--accent)"
              strokeWidth="1.5"
            />
            {/* Data points */}
            <circle cx="100" cy="30" r="4" fill="var(--emerald)" />
            <circle cx="165" cy="65" r="4" fill="var(--accent)" />
            <circle cx="150" cy="155" r="4" fill="var(--gold)" />
            <circle cx="50" cy="155" r="4" fill="var(--accent)" />
            <circle cx="35" cy="65" r="4" fill="var(--emerald)" />
            {/* Labels */}
            <text x="100" y="16" textAnchor="middle" fill="var(--text-dim)" fontSize="8" fontWeight="600">HVAC</text>
            <text x="182" y="65" textAnchor="start" fill="var(--text-dim)" fontSize="8" fontWeight="600">Plumbing</text>
            <text x="162" y="165" textAnchor="start" fill="var(--text-dim)" fontSize="8" fontWeight="600">Electrical</text>
            <text x="38" y="165" textAnchor="end" fill="var(--text-dim)" fontSize="8" fontWeight="600">Roof</text>
            <text x="18" y="65" textAnchor="end" fill="var(--text-dim)" fontSize="8" fontWeight="600">Foundation</text>
          </svg>
        </div>
      </div>

      {/* Overall risk badge */}
      <div className="flex justify-center">
        <div className="rounded-full px-3 py-1 flex items-center gap-1.5" style={{ background: 'var(--emerald-soft)', border: '1px solid var(--emerald)' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--emerald)' }} />
          <span className="text-[7px] font-bold" style={{ color: 'var(--emerald)' }}>Low Risk</span>
        </div>
      </div>

      {/* Top risk items */}
      <div className="space-y-1">
        <p className="text-[6px] font-semibold px-1" style={{ color: 'var(--text-dim)' }}>TOP ITEMS</p>
        {[
          { text: 'HVAC filter overdue', icon: '⚠️', color: 'var(--gold)' },
          { text: 'Deck boards aging', icon: '📋', color: 'var(--accent)' },
          { text: 'Gutter cleaning due', icon: '📋', color: 'var(--text-dim)' },
        ].map((item) => (
          <div key={item.text} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg" style={{ background: 'var(--glass)' }}>
            <span className="text-[8px]">{item.icon}</span>
            <span className="text-[7px]" style={{ color: 'var(--text)' }}>{item.text}</span>
            <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: item.color }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CapabilityScreen() {
  return (
    <div className="w-[220px] h-[420px] p-3 space-y-2.5" style={{ background: 'var(--bg)' }}>
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
        <span className="text-sm">🏆</span>
        <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>Capability Score</span>
      </div>

      {/* Large circular score gauge */}
      <div className="flex justify-center py-1">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="var(--glass-border)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="42"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${0.78 * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[16px] font-bold" style={{ color: 'var(--text)' }}>78</span>
            <span className="text-[8px] font-bold" style={{ color: 'var(--accent)' }}>B+</span>
          </div>
        </div>
      </div>

      {/* Level badge */}
      <div className="flex justify-center">
        <div className="rounded-full px-3 py-1" style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }}>
          <span className="text-[7px] font-bold" style={{ color: 'var(--accent)' }}>Developing</span>
        </div>
      </div>

      {/* Category bars */}
      <div className="space-y-2 px-1">
        <p className="text-[6px] font-semibold" style={{ color: 'var(--text-dim)' }}>SKILL BREAKDOWN</p>
        {[
          { name: 'Plumbing', pct: 85, color: 'var(--accent)' },
          { name: 'Electrical', pct: 62, color: 'var(--gold)' },
          { name: 'HVAC', pct: 71, color: 'var(--emerald)' },
          { name: 'Painting', pct: 90, color: 'var(--accent)' },
        ].map((skill) => (
          <div key={skill.name}>
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[7px] font-medium" style={{ color: 'var(--text)' }}>{skill.name}</span>
              <span className="text-[6px] font-bold" style={{ color: skill.color }}>{skill.pct}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--glass-border)' }}>
              <div className="h-full rounded-full" style={{ width: `${skill.pct}%`, background: skill.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Next milestone */}
      <div className="rounded-lg p-2" style={{ background: 'var(--gold-soft)' }}>
        <p className="text-[6px] font-bold" style={{ color: 'var(--gold)' }}>🎯 Next Milestone</p>
        <p className="text-[7px] mt-0.5" style={{ color: 'var(--text)' }}>Level up Electrical</p>
      </div>
    </div>
  );
}

export function TimelineScreen() {
  return (
    <div className="w-[220px] h-[420px] p-3 space-y-2.5" style={{ background: 'var(--bg)' }}>
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
        <span className="text-sm">📅</span>
        <span className="text-[10px] font-bold" style={{ color: 'var(--text)' }}>Timeline</span>
      </div>

      {/* Vertical timeline */}
      <div className="px-1">
        {[
          { title: 'Kitchen Faucet Replaced', date: 'Mar 5', tag: 'Plumbing', tagColor: 'var(--accent)', status: 'Complete', statusColor: 'var(--emerald)' },
          { title: 'Deck Stained', date: 'Feb 18', tag: 'Exterior', tagColor: 'var(--gold)', status: 'Complete', statusColor: 'var(--emerald)' },
          { title: 'HVAC Filter Changed', date: 'Feb 1', tag: 'HVAC', tagColor: 'var(--emerald)', status: 'Complete', statusColor: 'var(--emerald)' },
          { title: 'Toilet Fix', date: 'Jan 15', tag: 'Plumbing', tagColor: 'var(--accent)', status: 'Complete', statusColor: 'var(--emerald)' },
        ].map((event, i, arr) => (
          <div key={event.title} className="flex gap-2.5">
            {/* Timeline column */}
            <div className="flex flex-col items-center shrink-0" style={{ width: '14px' }}>
              <div
                className="w-3 h-3 rounded-full border-2 shrink-0"
                style={{
                  background: i === 0 ? 'var(--accent)' : 'var(--bg)',
                  borderColor: i === 0 ? 'var(--accent)' : 'var(--glass-border)',
                }}
              />
              {i < arr.length - 1 && (
                <div className="flex-1" style={{ width: '1.5px', background: 'var(--glass-border)', minHeight: '100%' }} />
              )}
            </div>

            {/* Event content */}
            <div className="pb-4 flex-1 min-w-0">
              <div className="rounded-xl p-2.5" style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-semibold leading-tight" style={{ color: 'var(--text)' }}>{event.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[6px]" style={{ color: 'var(--text-dim)' }}>{event.date}</span>
                  <span
                    className="text-[5px] font-bold uppercase px-1 py-px rounded"
                    style={{ background: 'var(--accent-soft)', color: event.tagColor }}
                  >
                    {event.tag}
                  </span>
                  <span
                    className="text-[5px] font-bold px-1 py-px rounded ml-auto"
                    style={{ background: 'var(--emerald-soft)', color: event.statusColor }}
                  >
                    {event.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
