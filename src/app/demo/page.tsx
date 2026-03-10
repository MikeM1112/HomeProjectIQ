'use client';

import { useState } from 'react';

const SCREENS = ['Landing', 'Dashboard', 'Assessment', 'Logbook', 'Toolbox', 'AI Photo'] as const;
type Screen = typeof SCREENS[number];

// ─── Mock Data ─────────────────────────────────────────────
const PROJECTS = [
  { icon: '🚿', title: 'Leaky Faucet Repair', date: 'Mar 8, 2026', badge: 'DIY Easy', badgeColor: 'emerald' },
  { icon: '⚡', title: 'Outlet Replacement', date: 'Mar 5, 2026', badge: 'Caution', badgeColor: 'gold' },
  { icon: '🎨', title: 'Room Repaint — Master', date: 'Mar 1, 2026', badge: 'DIY Easy', badgeColor: 'emerald' },
];

const CATEGORIES = [
  { icon: '⚡', label: 'Electrical', sub: 'Outlets, switches, lights', color: '#FFD93D' },
  { icon: '🚿', label: 'Plumbing', sub: 'Faucets, drains, toilets', color: '#4FC3F7' },
  { icon: '🎨', label: 'Painting', sub: 'Interior, exterior, trim', color: '#81C784' },
  { icon: '🪚', label: 'Carpentry', sub: 'Doors, trim, shelving', color: '#A1887F' },
  { icon: '🧱', label: 'Walls', sub: 'Drywall, patching, texture', color: '#F48FB1' },
  { icon: '❄️', label: 'HVAC', sub: 'Filters, ducts, thermostats', color: '#CE93D8' },
];

const LOG_MARCH = [
  { icon: '🚿', bg: 'var(--info-soft)', title: 'Leaky Faucet Repair', meta: 'DIY · Mar 8', cost: '$25' },
  { icon: '⚡', bg: 'var(--gold-soft)', title: 'Outlet Replacement', meta: 'DIY · Mar 5', cost: '$18' },
  { icon: '🎨', bg: 'var(--emerald-soft)', title: 'Room Repaint', meta: 'DIY · Mar 1', cost: '$120' },
];

const LOG_FEB = [
  { icon: '❄️', bg: 'rgba(206,147,216,0.12)', title: 'HVAC Filter Change', meta: 'DIY · Feb 20', cost: '$30' },
  { icon: '🪚', bg: 'rgba(161,136,127,0.12)', title: 'Closet Shelf Install', meta: 'DIY · Feb 14', cost: '$65' },
  { icon: '🧱', bg: 'var(--danger-soft)', title: 'Drywall Patch', meta: 'DIY · Feb 8', cost: '$15' },
];

const TOOLS = [
  { emoji: '📏', name: 'Tape Measure', cat: 'Measuring' },
  { emoji: '🔨', name: 'Hammer', cat: 'Hand Tools' },
  { emoji: '🪛', name: 'Screwdriver Set', cat: 'Hand Tools' },
  { emoji: '🔧', name: 'Adjustable Wrench', cat: 'Hand Tools' },
  { emoji: '🔩', name: 'Cordless Drill', cat: 'Power Tools' },
  { emoji: '🥽', name: 'Safety Glasses', cat: 'Safety' },
  { emoji: '🧤', name: 'Work Gloves', cat: 'Safety' },
  { emoji: '⚡', name: 'Voltage Tester', cat: 'Specialty' },
];

const CHIP_CATS = [
  { emoji: '🧱', label: 'Walls', active: true },
  { emoji: '🚿', label: 'Plumbing', active: false },
  { emoji: '⚡', label: 'Electrical', active: false },
  { emoji: '🎨', label: 'Painting', active: false },
];

// ─── Sub-components ────────────────────────────────────────

function StatusBar() {
  return (
    <div className="flex items-end justify-between px-7 pb-2 h-[54px] text-sm font-semibold text-[var(--text)]">
      <span>9:41</span>
      <div className="flex items-center gap-1.5 text-xs">
        <span>●●●●</span>
        <span>🔋</span>
      </div>
    </div>
  );
}

function PhoneNotch() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[34px] bg-black rounded-b-[20px] z-50" />
  );
}

function Nav({ title, avatar, back }: { title: string; avatar?: boolean; back?: boolean }) {
  return (
    <div
      className="flex items-center justify-between px-5 pb-3 pt-2 border-b border-[var(--border)]"
      style={{ backdropFilter: 'blur(20px)', background: 'var(--nav-bg)' }}
    >
      {back ? <span className="text-[22px] text-[var(--text-sub)]">&larr;</span> : <div className="w-8" />}
      <span className="font-serif text-xl text-[var(--text)]">{title}</span>
      {avatar ? (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold text-white" style={{ background: 'var(--accent-gradient)' }}>M</div>
      ) : <div className="w-8" />}
    </div>
  );
}

function BottomNavBar({ active }: { active: string }) {
  const tabs = [
    { icon: '🏠', label: 'Projects' },
    { icon: '🔧', label: 'Toolbox' },
    { icon: '📋', label: 'Logbook' },
    { icon: '👤', label: 'Profile' },
  ];
  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex justify-around pt-2.5 pb-7 border-t border-[var(--border)]"
      style={{ backdropFilter: 'blur(20px)', background: 'var(--bottom-nav-bg)' }}
    >
      {tabs.map(t => (
        <div key={t.label} className={`flex flex-col items-center gap-0.5 text-[10px] font-medium ${active === t.label ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}`}>
          <span className="text-xl leading-none">{t.icon}</span>
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}

function GlassCard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`rounded-2xl border border-[var(--glass-border)] transition-all duration-300 hover:border-[var(--glass-border-hover)] ${className}`}
      style={{ background: 'var(--glass)', backdropFilter: 'blur(12px)', ...style }}
    >
      {children}
    </div>
  );
}

function BadgePill({ children, color }: { children: React.ReactNode; color: string }) {
  const map: Record<string, { bg: string; fg: string }> = {
    emerald: { bg: 'var(--emerald-soft)', fg: 'var(--emerald)' },
    gold: { bg: 'var(--gold-soft)', fg: 'var(--gold)' },
    danger: { bg: 'var(--danger-soft)', fg: 'var(--danger)' },
  };
  const c = map[color] || map.emerald;
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap" style={{ background: c.bg, color: c.fg }}>
      {children}
    </span>
  );
}

// ─── Screens ───────────────────────────────────────────────

function LandingScreen() {
  return (
    <>
      <StatusBar />
      <div className="overflow-y-auto h-[calc(812px-54px)] scrollbar-hide">
        {/* Landing nav */}
        <div className="flex items-center justify-between px-5 pb-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-[22px]">🏠</span>
            <span className="font-serif text-lg">HomeProjectIQ</span>
          </div>
          <span className="text-[13px] font-semibold text-[var(--accent)]">Log In</span>
        </div>

        {/* Hero */}
        <div className="text-center px-5 py-8 relative">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, var(--hero-glow-sm) 0%, transparent 70%)' }} />
          <div className="text-[56px] mb-4 relative">🏠</div>
          <h1 className="font-serif text-[32px] leading-[1.15] text-[var(--text)] mb-3 relative">Know before<br />you build.</h1>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed mb-6 relative">HomeProjectIQ tells you in 60 seconds whether to DIY or hire a pro — with exact steps, tools, and parts.</p>
          <button className="w-full py-3 px-6 rounded-[10px] text-sm font-semibold text-white mb-2.5 relative" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 16px var(--accent-glow)' }}>Try a Project Free</button>
          <button className="w-full py-3 px-6 rounded-[10px] text-sm font-semibold text-[var(--text)] border border-[var(--glass-border)] relative" style={{ background: 'var(--glass)' }}>See How It Works</button>
        </div>

        {/* Value Cards */}
        <div className="px-5 space-y-2.5">
          {[
            { icon: '⚡', bg: 'var(--accent-soft)', title: 'Instant DIY Verdict', desc: 'Answer 3-5 questions and get a confidence score in seconds.' },
            { icon: '📋', bg: 'var(--emerald-soft)', title: 'Step-by-Step Plans', desc: 'Detailed instructions with timing, tips, and safety notes.' },
            { icon: '🛒', bg: 'var(--gold-soft)', title: 'Exact Materials & Costs', desc: 'Real product SKUs with current pricing from top retailers.' },
          ].map(v => (
            <GlassCard key={v.title} className="p-4">
              <div className="flex gap-3.5 items-start">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: v.bg }}>{v.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{v.title}</div>
                  <div className="text-xs text-[var(--text-dim)] mt-0.5">{v.desc}</div>
                </div>
              </div>
            </GlassCard>
          ))}

          {/* Social Stats */}
          <div className="flex justify-around py-5 my-5 border-t border-b border-[var(--border)]">
            {[
              { val: '$680', label: 'Avg savings/year' },
              { val: '12', label: 'Categories' },
              { val: '100%', label: 'Free' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-extrabold text-[var(--accent)]">{s.val}</div>
                <div className="text-[11px] text-[var(--text-dim)] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center py-6 pb-10">
            <h3 className="font-serif text-xl mb-1.5">Free forever for homeowners.</h3>
            <p className="text-[13px] text-[var(--text-dim)] mb-4">No credit card required.</p>
            <button className="w-full py-3 px-6 rounded-[10px] text-sm font-semibold text-white" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 16px var(--accent-glow)' }}>Sign Up Free</button>
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardScreen() {
  return (
    <>
      <StatusBar />
      <div className="overflow-y-auto h-[calc(812px-54px)] scrollbar-hide">
        <Nav title="HomeProjectIQ" avatar />
        <div className="px-5 py-4 pb-24 space-y-4">
          {/* AI CTA */}
          <div className="rounded-[20px] p-5 text-center" style={{
            background: 'linear-gradient(135deg, rgba(var(--accent-rgb, 249,115,22),0.15), rgba(251,191,36,0.1))',
            border: '1px solid rgba(var(--accent-rgb, 249,115,22),0.2)',
          }}>
            <div className="text-[32px] mb-2">📸</div>
            <h3 className="font-serif text-lg mb-1.5">AI Photo Assessment</h3>
            <p className="text-xs text-[var(--text-sub)] mb-3.5">Snap a photo of any issue for instant diagnosis</p>
            <button className="py-2.5 px-5 rounded-[10px] text-[13px] font-semibold text-white mx-auto" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 16px var(--accent-glow)' }}>Try AI Assess</button>
          </div>

          {/* Stats Row */}
          <div className="flex gap-2.5 overflow-x-auto -mx-5 px-5 pb-2 scrollbar-hide">
            {[
              { label: 'Level', value: '3', sub: 'Handy', color: 'var(--accent)' },
              { label: 'XP', value: '385', sub: null, color: 'var(--text)', xp: true },
              { label: 'Savings', value: '$420', sub: null, color: 'var(--emerald)' },
              { label: 'Streak', value: '7', sub: 'days 🔥', color: 'var(--gold)' },
            ].map(s => (
              <div key={s.label} className="min-w-[120px] shrink-0 rounded-2xl border border-[var(--glass-border)] p-3.5" style={{ background: 'var(--glass)', backdropFilter: 'blur(12px)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-1.5">{s.label}</div>
                <div className="text-[26px] font-extrabold leading-tight" style={{ color: s.color }}>{s.value}</div>
                {s.sub && <div className="text-[11px] text-[var(--text-dim)] mt-0.5">{s.sub}</div>}
                {s.xp && (
                  <div className="mt-1.5 h-[5px] rounded-full overflow-hidden" style={{ background: 'var(--xp-bar-bg)' }}>
                    <div className="h-full rounded-full" style={{ width: '28%', background: 'var(--xp-gradient)', boxShadow: '0 0 12px var(--accent-glow)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* XP Progress */}
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <h3 className="font-serif text-lg">Level 3: Handy</h3>
              <span className="text-xs text-[var(--text-dim)]">385 XP</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--xp-bar-bg)' }}>
              <div className="h-full rounded-full" style={{ width: '28%', background: 'var(--xp-gradient)', boxShadow: '0 0 12px var(--accent-glow)' }} />
            </div>
            <div className="text-[11px] text-[var(--text-dim)] mt-1.5">215 XP to Skilled</div>
          </div>

          {/* Recent Projects */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-serif text-lg">Recent Projects</h3>
              <span className="text-xs font-semibold text-[var(--accent)]">See All</span>
            </div>
            <div className="space-y-2">
              {PROJECTS.map(p => (
                <div key={p.title} className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--glass-border)] cursor-pointer transition-all hover:border-[var(--glass-border-hover)] hover:bg-[var(--card-hover)]" style={{ background: 'var(--glass)' }}>
                  <div className="text-[28px] w-11 h-11 flex items-center justify-center rounded-xl" style={{ background: 'var(--icon-bg)' }}>{p.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[var(--text)] truncate">{p.title}</div>
                    <div className="text-[11px] text-[var(--text-dim)] mt-0.5">{p.date}</div>
                  </div>
                  <BadgePill color={p.badgeColor}>{p.badge}</BadgePill>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-serif text-lg">Start a New Project</h3>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORIES.map(c => (
                <div key={c.label} className="relative overflow-hidden rounded-2xl border border-[var(--glass-border)] p-3.5 cursor-pointer transition-all hover:border-[var(--glass-border-hover)] hover:-translate-y-0.5" style={{ background: 'var(--glass)' }}>
                  <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: c.color }} />
                  <div className="text-[26px] leading-none">{c.icon}</div>
                  <div className="text-[13px] font-semibold text-[var(--text)] mt-1.5">{c.label}</div>
                  <div className="text-[11px] text-[var(--text-dim)] leading-snug">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <BottomNavBar active="Projects" />
    </>
  );
}

function AssessmentScreen() {
  const [tab, setTab] = useState(0);
  const tabs = ['Summary', 'Steps', 'Tools', 'Shop', 'Hire Pro'];
  return (
    <>
      <StatusBar />
      <div className="overflow-y-auto h-[calc(812px-54px)] scrollbar-hide">
        <Nav title="Leaky Faucet Repair" back />
        <div className="px-5 py-4 pb-24">
          {/* Tabs */}
          <div className="flex gap-[2px] p-1 rounded-xl mb-4 overflow-x-auto" style={{ background: 'var(--tab-bg)' }}>
            {tabs.map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${i === tab ? 'text-white' : 'text-[var(--text-dim)]'}`}
                style={i === tab ? { background: 'var(--accent)', boxShadow: '0 2px 8px var(--accent-glow)' } : {}}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 0 && (
            <div className="space-y-3">
              {/* Gauge */}
              <div className="flex flex-col items-center gap-3 py-6">
                <svg width="200" height="120" viewBox="0 0 200 120">
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--xp-bar-bg)" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="var(--emerald)" strokeWidth="10" strokeLinecap="round" strokeDasharray="251.3" strokeDashoffset="37.7" />
                </svg>
                <div className="-mt-[70px] text-center">
                  <div className="text-5xl font-extrabold" style={{ color: 'var(--emerald)' }}>85</div>
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-semibold" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)', boxShadow: '0 0 20px var(--emerald-glow)' }}>
                  ✅ DIY Easy
                </div>
              </div>

              {/* Why */}
              <GlassCard className="p-4">
                <p className="text-[13px] text-[var(--text-sub)] leading-relaxed">
                  Standard faucet cartridge replacement — a common fix well within beginner skill level. No special tools required beyond basic pliers.
                </p>
              </GlassCard>

              {/* Cost Table */}
              <GlassCard className="p-4">
                <h4 className="font-serif text-base mb-3">Cost Comparison</h4>
                {[
                  { label: '🛠 DIY', value: '$15 – $45', color: 'var(--emerald)' },
                  { label: '👷 Hire Pro', value: '$150 – $300', color: 'var(--info)' },
                  { label: '💰 Potential Savings', value: '$135', color: 'var(--accent)', bold: true },
                ].map((r, i) => (
                  <div key={i} className={`flex justify-between items-center py-3 ${i < 2 ? 'border-b border-[var(--border)]' : ''}`}>
                    <span className="text-[13px] font-semibold" style={{ color: r.color }}>{r.label}</span>
                    <span className={`text-sm font-semibold tabular-nums ${r.bold ? '' : ''}`} style={r.bold ? { color: r.color } : {}}>{r.value}</span>
                  </div>
                ))}
              </GlassCard>

              {/* Time & Difficulty */}
              <div className="grid grid-cols-2 gap-2.5">
                <GlassCard className="p-3 text-center">
                  <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">Est. Time</div>
                  <div className="text-base font-bold text-[var(--text)] mt-1">1-2 hrs</div>
                </GlassCard>
                <GlassCard className="p-3 text-center">
                  <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">Difficulty</div>
                  <div className="text-base font-bold mt-1" style={{ color: 'var(--emerald)' }}>Beginner</div>
                </GlassCard>
              </div>

              {/* Tools */}
              <div>
                <h4 className="font-serif text-base mb-2.5">Tools Needed</h4>
                <div className="flex flex-wrap gap-1.5">
                  {['Adjustable Wrench', 'Pliers'].map(t => (
                    <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border" style={{ borderColor: 'rgba(var(--accent-rgb, 249,115,22),0.3)', background: 'var(--accent-soft)', color: 'var(--accent)' }}>✅ {t}</span>
                  ))}
                  {['Channel Lock Pliers', 'Screwdriver Set'].map(t => (
                    <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--chip-border)]" style={{ background: 'var(--chip-bg)', color: 'var(--chip-text)' }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 mt-5">
                <button className="flex-1 py-3 px-6 rounded-[10px] text-sm font-semibold text-[var(--text)] border border-[var(--glass-border)]" style={{ background: 'var(--glass)' }}>Start Over</button>
                <button className="flex-1 py-3 px-6 rounded-[10px] text-sm font-semibold text-white" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 16px var(--accent-glow)' }}>Mark Complete</button>
              </div>
            </div>
          )}

          {tab === 1 && (
            <div className="space-y-2">
              {[
                { step: 1, title: 'Turn off water supply', detail: 'Locate shutoff valves under the sink. Turn both clockwise until fully closed.', tip: 'Open the faucet after shutting off to release pressure.' },
                { step: 2, title: 'Remove the handle', detail: 'Pop off the decorative cap. Use an Allen wrench or Phillips screwdriver to remove the handle screw.', tip: null },
                { step: 3, title: 'Extract the cartridge', detail: 'Use pliers to pull the old cartridge straight out. Note orientation for the replacement.', tip: 'Take a photo before removing for reference.' },
                { step: 4, title: 'Install new cartridge', detail: 'Insert the new cartridge in the same orientation. Push firmly until seated.', tip: null },
                { step: 5, title: 'Reassemble & test', detail: 'Replace handle, turn on water supply slowly, and check for leaks.', tip: 'Run water for 30 seconds to flush any debris.' },
              ].map(s => (
                <div key={s.step} className="flex gap-3 p-3.5 rounded-2xl border border-[var(--glass-border)]" style={{ background: 'var(--glass)' }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>{s.step}</div>
                  <div>
                    <div className="text-[13px] font-semibold text-[var(--text)]">{s.title}</div>
                    <div className="text-xs text-[var(--text-dim)] leading-snug mt-0.5">{s.detail}</div>
                    {s.tip && <div className="text-[11px] mt-1" style={{ color: 'var(--gold)' }}>💡 {s.tip}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 2 && (
            <div className="space-y-2">
              {[
                { emoji: '🔧', name: 'Adjustable Wrench', req: 'Essential', tip: 'Any 8" or 10" wrench will work.' },
                { emoji: '🪛', name: 'Pliers', req: 'Essential', tip: null },
                { emoji: '🔩', name: 'Allen Wrench Set', req: 'Essential', tip: 'Usually comes with replacement cartridge.' },
                { emoji: '📏', name: 'Screwdriver Set', req: 'Helpful', tip: null },
                { emoji: '🧤', name: 'Work Towel', req: 'Helpful', tip: 'Place under work area to catch drips.' },
              ].map((t, i) => (
                <GlassCard key={i} className="p-3">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{t.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{t.name}</span>
                        <BadgePill color={t.req === 'Essential' ? 'danger' : 'gold'}>{t.req}</BadgePill>
                      </div>
                      {t.tip && <p className="text-xs text-[var(--text-sub)] mt-0.5">{t.tip}</p>}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {tab === 3 && (
            <div className="space-y-2">
              {[
                { name: 'Moen 1225 Cartridge', size: '1-pack', store: 'Home Depot', sku: 'HD-1225', price: '$24.97', stock: 'In Stock' },
                { name: 'Plumber\'s Grease', size: '1 oz tube', store: 'Lowe\'s', sku: 'LW-9912', price: '$5.98', stock: 'In Stock' },
                { name: 'Teflon Tape', size: '1/2" × 520"', store: 'Home Depot', sku: 'HD-0088', price: '$1.28', stock: 'In Stock' },
              ].map((item, i) => (
                <GlassCard key={i} className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-[var(--text-dim)]">{item.size}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <BadgePill color="emerald">{item.store}</BadgePill>
                        <span className="text-[10px] text-[var(--text-dim)] font-mono">SKU: {item.sku}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm font-semibold">{item.price}</p>
                      <p className="text-[10px] text-[var(--emerald)]">{item.stock}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
              <GlassCard className="p-3 mt-4" style={{ background: 'var(--accent-soft)' }}>
                <p className="text-sm font-semibold text-[var(--accent)]">Estimated Materials: $32.23</p>
              </GlassCard>
            </div>
          )}

          {tab === 4 && (
            <div className="space-y-4">
              <GlassCard className="p-4">
                <h3 className="font-serif text-base font-semibold mb-2">Call Script</h3>
                <p className="text-sm text-[var(--text-sub)] whitespace-pre-line leading-relaxed">
                  {`Hi, I'm looking for help with a leaky kitchen faucet. It's a Moen single-handle model that's been dripping from the spout when turned off. I've already turned off the water supply. Can you provide a quote for replacing the cartridge? I'd also like to know your availability this week.`}
                </p>
                <button className="mt-3 py-1.5 px-4 rounded-[10px] text-[13px] font-semibold text-[var(--text)] border border-[var(--glass-border)]" style={{ background: 'var(--glass)' }}>Copy Script</button>
              </GlassCard>
              <GlassCard className="p-4">
                <h3 className="text-sm font-semibold mb-1">Expected Cost</h3>
                <p className="font-mono text-lg">$150 – $300</p>
                <p className="text-xs text-[var(--text-sub)] mt-1">1-2 hours including travel</p>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function LogbookScreen() {
  return (
    <>
      <StatusBar />
      <div className="overflow-y-auto h-[calc(812px-54px)] scrollbar-hide">
        <Nav title="Logbook" avatar />
        <div className="px-5 py-4 pb-24">
          <div className="font-serif text-[15px] font-semibold text-[var(--text-sub)] mb-2.5">March 2026</div>
          <div className="space-y-2">
            {LOG_MARCH.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--glass-border)]" style={{ background: 'var(--glass)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: e.bg }}>{e.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text)]">{e.title}</div>
                  <div className="text-[11px] text-[var(--text-dim)] mt-0.5">{e.meta}</div>
                </div>
                <div className="text-[13px] font-semibold tabular-nums text-[var(--emerald)] shrink-0">{e.cost}</div>
              </div>
            ))}
          </div>

          <div className="font-serif text-[15px] font-semibold text-[var(--text-sub)] mb-2.5 mt-5">February 2026</div>
          <div className="space-y-2">
            {LOG_FEB.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3.5 rounded-2xl border border-[var(--glass-border)]" style={{ background: 'var(--glass)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ background: e.bg }}>{e.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-[var(--text)]">{e.title}</div>
                  <div className="text-[11px] text-[var(--text-dim)] mt-0.5">{e.meta}</div>
                </div>
                <div className="text-[13px] font-semibold tabular-nums text-[var(--emerald)] shrink-0">{e.cost}</div>
              </div>
            ))}
          </div>

          {/* Total */}
          <GlassCard className="p-5 text-center mt-5">
            <div className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mb-1">Total DIY Savings</div>
            <div className="text-[32px] font-extrabold" style={{ color: 'var(--emerald)' }}>$420</div>
            <div className="text-xs text-[var(--text-dim)] mt-1">6 entries · All DIY</div>
          </GlassCard>
        </div>
      </div>
      {/* FAB */}
      <div className="absolute bottom-[90px] right-5 w-[52px] h-[52px] rounded-full flex items-center justify-center text-2xl text-white cursor-pointer z-10" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 20px var(--accent-glow)' }}>+</div>
      <BottomNavBar active="Logbook" />
    </>
  );
}

function ToolboxScreen() {
  return (
    <>
      <StatusBar />
      <div className="overflow-y-auto h-[calc(812px-54px)] scrollbar-hide">
        <Nav title="My Toolbox" avatar />
        <div className="px-5 py-4 pb-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-lg">8 Tools</h3>
            <button className="py-2 px-4 rounded-[10px] text-[13px] font-semibold text-white" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 16px var(--accent-glow)' }}>+ Add Tool</button>
          </div>
          <div className="space-y-2">
            {TOOLS.map(t => (
              <div key={t.name} className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-[var(--glass-border)]" style={{ background: 'var(--glass)' }}>
                <div className="text-[28px] w-11 h-11 flex items-center justify-center rounded-xl shrink-0" style={{ background: 'var(--icon-bg)' }}>{t.emoji}</div>
                <div>
                  <div className="text-sm font-semibold text-[var(--text)]">{t.name}</div>
                  <div className="text-[11px] text-[var(--text-dim)] mt-0.5">{t.cat}</div>
                </div>
                <div className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-sm" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>✓</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNavBar active="Toolbox" />
    </>
  );
}

function AIPhotoScreen() {
  return (
    <>
      <StatusBar />
      <div className="overflow-y-auto h-[calc(812px-54px)] scrollbar-hide">
        <Nav title="AI Assessment" back />
        <div className="px-5 py-4 pb-24">
          <div className="text-center mb-5">
            <h2 className="font-serif text-[22px] mb-1">AI Photo Assessment</h2>
            <p className="text-[13px] text-[var(--text-sub)]">Upload a photo for an instant AI diagnosis</p>
          </div>

          {/* Photo Upload */}
          <div className="border-2 border-dashed rounded-[20px] p-10 text-center cursor-pointer transition-all hover:border-[var(--accent)] hover:bg-[var(--accent-soft)]" style={{ borderColor: 'var(--dashed-border, rgba(255,255,255,0.1))', background: 'var(--input-bg)' }}>
            <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>📷</div>
            <div className="text-sm font-semibold text-[var(--text)] mb-1">Upload a photo of the issue</div>
            <div className="text-xs text-[var(--text-dim)]">Drag & drop, click to browse, or take a photo</div>
            <div className="text-[11px] text-[var(--text-dim)] mt-1">JPG, PNG, WebP up to 10MB</div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="text-[13px] font-semibold block mb-1.5">Describe the issue</label>
            <div className="rounded-[10px] p-3 min-h-[80px] border border-[var(--glass-border)]" style={{ background: 'var(--input-bg)' }}>
              <span className="text-[13px] text-[var(--text-dim)]">e.g. There&apos;s a crack in the drywall above my door frame...</span>
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-4">
            <label className="text-[13px] font-semibold block mb-2">Category (optional)</label>
            <div className="flex flex-wrap gap-1.5">
              {CHIP_CATS.map(c => (
                <span
                  key={c.label}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${c.active ? 'font-semibold' : ''}`}
                  style={c.active
                    ? { borderColor: 'rgba(var(--accent-rgb, 249,115,22),0.3)', background: 'var(--accent-soft)', color: 'var(--accent)' }
                    : { borderColor: 'var(--chip-border)', background: 'var(--chip-bg)', color: 'var(--chip-text)' }
                  }
                >
                  {c.emoji} {c.label}
                </span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2.5 mt-6">
            <button className="flex-1 py-3 px-6 rounded-[10px] text-sm font-semibold text-[var(--text)] border border-[var(--glass-border)]" style={{ background: 'var(--glass)' }}>Add Details</button>
            <button className="flex-1 py-3 px-6 rounded-[10px] text-sm font-semibold text-white" style={{ background: 'var(--accent-gradient)', boxShadow: '0 4px 16px var(--accent-glow)' }}>Analyze Now</button>
          </div>

          {/* Analyzing Preview */}
          <div className="mt-10 pt-8 border-t border-[var(--border)]">
            <div className="text-center text-[11px] text-[var(--text-dim)] uppercase tracking-widest mb-6">Analysis Preview</div>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full mx-auto flex items-center justify-center relative" style={{ background: 'var(--accent-soft)' }}>
                <div className="absolute inset-[-8px] rounded-full border-2 border-transparent border-t-[var(--accent)] animate-spin" />
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                </div>
              </div>
              <h3 className="font-serif text-xl mt-5">Analyzing your photo</h3>
              <p className="text-[13px] text-[var(--text-sub)] mt-2">Identifying the issue...</p>
              <div className="flex gap-2 justify-center mt-6">
                {[true, true, true, false, false, false].map((active, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-all"
                    style={active
                      ? { background: 'var(--accent)', boxShadow: '0 0 8px var(--accent-glow)' }
                      : { background: 'var(--xp-bar-bg)' }
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Demo Page ────────────────────────────────────────

export default function DemoPage() {
  const [activeScreen, setActiveScreen] = useState<Screen>('Landing');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Landing': return <LandingScreen />;
      case 'Dashboard': return <DashboardScreen />;
      case 'Assessment': return <AssessmentScreen />;
      case 'Logbook': return <LogbookScreen />;
      case 'Toolbox': return <ToolboxScreen />;
      case 'AI Photo': return <AIPhotoScreen />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 transition-all duration-500" style={{ background: 'var(--bg-page, var(--bg))' }}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-2 rounded-full border border-[var(--glass-border)] cursor-pointer transition-all hover:border-[var(--glass-border-hover)] hover:-translate-y-0.5"
        style={{ background: 'var(--glass)', backdropFilter: 'blur(20px)', boxShadow: 'var(--shadow)' }}
      >
        <span className="text-lg">{theme === 'dark' ? '🌛' : '☀️'}</span>
        <span className="text-[13px] font-semibold text-[var(--text)]">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
      </button>

      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute -top-[200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, var(--hero-glow, rgba(249,115,22,0.08)) 0%, transparent 70%)' }} />
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-semibold text-[var(--accent)] mb-6 border" style={{ background: 'var(--accent-soft)', borderColor: 'rgba(124,58,237,0.2)' }}>
          <span className="animate-pulse">✨</span> Interactive Demo
        </div>
        <h1 className="font-serif text-4xl md:text-5xl mb-2 bg-gradient-to-br from-[var(--text)] to-[var(--text-dim)] bg-clip-text text-transparent">HomeProjectIQ</h1>
        <p className="text-[var(--text-sub)] text-sm mb-4">Toggle between screens — no login required</p>
        <a
          href="/demo/dashboard"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5"
          style={{ background: 'var(--accent-gradient)', backgroundImage: 'var(--accent-gradient)', boxShadow: '0 4px 20px var(--accent-glow)' }}
        >
          Try the Live Demo &rarr;
        </a>
      </div>

      {/* Screen Switcher */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-8 p-1.5 rounded-2xl max-w-2xl" style={{ background: 'var(--tab-bg)' }}>
        {SCREENS.map(s => (
          <button
            key={s}
            onClick={() => setActiveScreen(s)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${activeScreen === s ? 'text-white' : 'text-[var(--text-dim)] hover:text-[var(--text-sub)]'}`}
            style={activeScreen === s ? { background: 'var(--accent)', boxShadow: '0 2px 12px var(--accent-glow)' } : {}}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Phone Frame */}
      <div
        className="w-[375px] min-h-[812px] rounded-[44px] border-[3px] overflow-hidden relative shrink-0 transition-all duration-500"
        style={{
          background: 'var(--bg)',
          borderColor: 'var(--phone-border, var(--surface-3, #1F2937))',
          boxShadow: 'var(--phone-shadow, 0 25px 80px rgba(0,0,0,0.5))',
        }}
      >
        <PhoneNotch />
        {renderScreen()}
      </div>

      {/* Footer */}
      <p className="text-[var(--text-dim)] text-xs mt-8">HomeProjectIQ — Interactive Demo</p>
    </div>
  );
}
