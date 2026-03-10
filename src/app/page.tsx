'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneMockup } from '@/components/landing/PhoneMockup';
import { AssessmentScreen } from '@/components/landing/screens/AssessmentScreen';
import { DashboardScreen } from '@/components/landing/screens/DashboardScreen';
import { PlannerScreen } from '@/components/landing/screens/PlannerScreen';
import { BrandIcon } from '@/components/brand/BrandIcon';
import type { BrandIconName } from '@/components/brand/BrandIcon';
import { Mascot } from '@/components/brand/Mascot';

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Inline check icon ── */
function Check() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      <a href="#hero" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold" style={{ background: 'var(--accent)', color: 'white' }}>
        Skip to main content
      </a>

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.07] blur-[200px]" style={{ background: '#F97316' }} />
        <div className="absolute top-[60%] right-[-200px] w-[500px] h-[500px] rounded-full opacity-[0.04] blur-[150px]" style={{ background: '#F97316' }} />
      </div>

      {/* ═══════════ NAV ═══════════ */}
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image src="/brand/app-icon.png" alt="HomeProjectIQ" width={36} height={36} className="rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105" />
            <span className="text-[15px] text-[var(--text)] font-bold tracking-tight">
              HomeProject<span style={{ color: 'var(--accent)' }}>IQ</span>
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-8">
            {[{ label: 'Features', href: '#features' }, { label: 'How It Works', href: '#how-it-works' }].map((link) => (
              <a key={link.label} href={link.href} className="nav-link text-sm font-medium text-[var(--text-sub)] hover:text-[var(--text)] transition-colors">{link.label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-[var(--text-sub)] hover:text-[var(--text)] transition-colors px-3 py-2">Log in</Link>
            <Link
              href="/signup"
              className="text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 min-h-[44px] flex items-center"
              style={{ backgroundImage: 'var(--accent-gradient)', color: 'white', boxShadow: '0 2px 16px var(--accent-glow)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section id="hero" aria-labelledby="hero-heading" className="relative pt-28 sm:pt-40 pb-8 sm:pb-16 px-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none -z-10" style={{ background: 'radial-gradient(circle, var(--hero-glow-sm) 0%, transparent 65%)' }} aria-hidden="true" />
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--glass-border)' }}>
              <span className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse" style={{ background: 'var(--accent)' }} aria-hidden="true" />
              AI-Powered Home Intelligence
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="flex items-center justify-center gap-4 mb-2">
              <Mascot size="xxl" mode="celebrate" className="hidden sm:inline-flex shrink-0" />
              <h1 id="hero-heading" className="font-serif text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] font-normal leading-[1.08] tracking-tight text-[var(--text)]">
                Your Home&rsquo;s<br /><span className="gradient-text">Smartest Upgrade</span>
              </h1>
            </div>
            <div className="flex justify-center sm:hidden mb-2">
              <Mascot size="xl" mode="celebrate" />
            </div>
          </Reveal>

          <Reveal delay={180}>
            <p className="text-[var(--text-sub)] text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              AI-powered photo assessment that tells you exactly what to fix, whether to DIY or hire a pro, and how much it&rsquo;ll actually cost.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <Link href="/signup" className="inline-flex items-center justify-center text-white px-8 py-4 rounded-full text-[15px] font-bold tap transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]" style={{ backgroundImage: 'var(--accent-gradient)', boxShadow: '0 6px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
                Get Started Free
              </Link>
              <Link href="/demo/dashboard" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tap text-[var(--text-sub)] transition-all duration-200 hover:text-[var(--text)] hover:-translate-y-0.5" style={{ border: '1px solid var(--glass-border)' }}>
                Try the Demo
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Link>
            </div>
          </Reveal>

          {/* Stats row */}
          <Reveal delay={320}>
            <div className="flex items-center justify-center gap-6 sm:gap-10 text-center mb-12">
              {[
                { value: '$2,200', label: 'Avg savings per fix' },
                { value: '50+', label: 'Issues diagnosed' },
                { value: '4.9', label: 'App Store rating' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-lg sm:text-xl font-bold gradient-text">{s.value}</p>
                  <p className="text-[11px] text-[var(--text-dim)] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={400} className="flex justify-center">
            <PhoneMockup glow>
              <AssessmentScreen />
            </PhoneMockup>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" aria-labelledby="hiw-heading" className="px-5 py-24 sm:py-32 relative">
        <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse at 50% 30%, var(--hero-glow) 0%, transparent 60%)' }} aria-hidden="true" />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                How It Works
              </span>
              <h2 id="hiw-heading" className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] tracking-tight">
                Up and running in <span className="gradient-text">60 seconds</span>
              </h2>
              <p className="text-[var(--text-sub)] text-base max-w-md mx-auto">Three taps&mdash;that&rsquo;s it. Take a photo, let AI do its thing, and see exactly what to do next.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6 relative">
            <div className="hidden md:block absolute top-[130px] left-[20%] right-[20%] h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, var(--border), var(--border), transparent)' }} aria-hidden="true" />
            {([
              { step: 1, label: 'Snap', title: 'Take a Photo', desc: 'Point your camera at any home issue\u2014a crack, a leak, a stain, a wall.', phone: <AssessmentScreen />, mascotMode: 'diagnostic' as const },
              { step: 2, label: 'Know', title: 'AI Diagnoses It', desc: 'Identifies the problem, estimates cost, tells you DIY-safe or needs a pro.', phone: <DashboardScreen />, mascotMode: 'tool' as const },
              { step: 3, label: 'Act', title: 'Get Your Plan', desc: 'Step-by-step DIY instructions or live bids from verified local contractors.', phone: <PlannerScreen />, mascotMode: 'celebrate' as const },
            ]).map((item, i) => (
              <Reveal key={item.step} delay={i * 120}>
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <PhoneMockup className="scale-[0.65] sm:scale-[0.85]">{item.phone}</PhoneMockup>
                  </div>
                  <div className="flex justify-center mb-3">
                    <Mascot size="sm" mode={item.mascotMode} animate={false} />
                  </div>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold relative z-10" style={{ backgroundImage: 'var(--accent-gradient)', color: 'white', boxShadow: '0 4px 20px var(--accent-glow)' }}>
                    {item.step}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>{item.label}</p>
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-sm text-[var(--text-sub)] max-w-[260px] mx-auto leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ COMMAND CENTER ═══════════ */}
      <section id="features" className="px-5 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>Dashboard</span>
                <Mascot size="sm" mode="checklist" animate={false} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-[var(--text)] tracking-tight">
                Your home&rsquo;s <span className="gradient-text">command center</span>
              </h2>
              <p className="text-[var(--text-sub)] text-base mb-8 leading-relaxed">
                AI-powered hub. Real-time diagnostics, smart cost tracking, proactive maintenance. One dashboard for all of it.
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {['AI Diagnostics', 'Cost Tracking', 'Maintenance Alerts', 'Health Score'].map((tag) => (
                  <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-sub)', border: '1px solid var(--border)' }}>{tag}</span>
                ))}
              </div>
              <div className="space-y-4">
                {[
                  'Track every system at a glance\u2014HVAC, plumbing, roof, electrical',
                  'Smart alerts before a $50 fix becomes a $5,000 emergency',
                  'Photo-verified history so you always know where things stand',
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--accent-soft)' }}><Check /></div>
                    <p className="text-sm text-[var(--text-sub)] leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={150} className="flex justify-center lg:justify-end">
            <PhoneMockup tilt="right" glow><DashboardScreen /></PhoneMockup>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ AI VISION ═══════════ */}
      <section className="px-5 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal className="flex justify-center lg:justify-start order-2 lg:order-1">
            <PhoneMockup tilt="left" glow><AssessmentScreen /></PhoneMockup>
          </Reveal>
          <Reveal delay={150} className="order-1 lg:order-2">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>AI Vision</span>
                <Mascot size="sm" mode="diagnostic" animate={false} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-[var(--text)] tracking-tight">
                AI that sees <span className="gradient-text">what you can&rsquo;t</span>
              </h2>
              <p className="text-[var(--text-sub)] text-base mb-8 leading-relaxed">
                Advanced computer vision identifies problems humans often miss. Trained on thousands of real home issues.
              </p>
              <div className="space-y-4">
                {[
                  { title: 'Surface Pattern Analysis', desc: 'Distinguishes mold from soap scum, structural from cosmetic cracks' },
                  { title: 'Damage Classification', desc: 'Separates termite damage from water damage at a glance' },
                  { title: 'Material Identification', desc: 'Detects load-bearing walls and hidden obstacles behind drywall' },
                  { title: 'Risk Assessment', desc: 'Confidence scores so you know when to trust the diagnosis' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--accent-soft)' }}><Check /></div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">{item.title}</p>
                      <p className="text-xs text-[var(--text-dim)] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ TAKE ACTION ═══════════ */}
      <section className="px-5 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4" style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}>Cost Planning</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] tracking-tight">
                Everything you need to <span className="gradient-text">take action</span>
              </h2>
              <p className="text-[var(--text-sub)] text-base max-w-lg mx-auto leading-relaxed">
                Each diagnosis delivers a complete action plan&mdash;materials, estimated cost, timeline, and whether you should DIY or hire a pro.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6">
            <Reveal>
              <div className="rounded-[20px] p-6 sm:p-8 h-full" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--accent-soft)' }}>
                  <BrandIcon name="tools" size={24} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--accent)' }}>DIY Estimate</p>
                <p className="text-3xl sm:text-4xl font-bold gradient-text mb-3">$25&ndash;$600</p>
                <p className="text-sm text-[var(--text-sub)] leading-relaxed">Materials, tools, and your time. Step-by-step instructions matched to your skill level.</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-[20px] p-6 sm:p-8 h-full" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--emerald-soft)' }}>
                  <BrandIcon name="hire-pro" size={24} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--emerald)' }}>Pro Estimate</p>
                <p className="text-3xl sm:text-4xl font-bold gradient-text mb-3">$150&ndash;$3,000</p>
                <p className="text-sm text-[var(--text-sub)] leading-relaxed">Licensed contractor, fully insured. Live bids from verified local pros.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ MAINTENANCE RECORD ═══════════ */}
      <section className="px-5 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>Logbook</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-[var(--text)] tracking-tight">
                Your home&rsquo;s <span className="gradient-text">maintenance record</span>
              </h2>
              <p className="text-[var(--text-sub)] text-base mb-8 leading-relaxed">
                Every repair, every diagnosis, every cost&mdash;auto-logged. Build a complete maintenance history that adds real value.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Auto-Logged', 'Before & After', 'Cost History', 'Seasonal Alerts'].map((tag) => (
                  <span key={tag} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--text-sub)', border: '1px solid var(--border)' }}>{tag}</span>
                ))}
              </div>
            </div>
          </Reveal>
          <Reveal delay={150} className="flex justify-center lg:justify-end">
            <PhoneMockup tilt="right" glow><PlannerScreen /></PhoneMockup>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ LEVEL UP ═══════════ */}
      <section className="px-5 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <span className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4" style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}>Gamification</span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] tracking-tight">
              Level up your <span className="gradient-text">home skills</span>
            </h2>
            <p className="text-[var(--text-sub)] text-base max-w-lg mx-auto mb-10 leading-relaxed">
              Earn XP with every project. Unlock badges as you master plumbing, electrical, painting, and more.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 max-w-md sm:max-w-xl mx-auto mb-8">
              {['🔧','🔨','🪚','🪛','💡','🎨','🪠','🔩','🧱','🏆','⚡','🛠️','📐','🧰','🪜','🔑','🚿','❄️','🔥','🌱'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="rounded-[20px] p-5 inline-flex items-center gap-4" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
              <div className="text-left">
                <p className="text-xs text-[var(--text-dim)]">Your level</p>
                <p className="text-sm font-bold text-[var(--text)]">Level 3 &middot; Handy</p>
              </div>
              <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: 'var(--xp-bar-bg)' }}>
                <div className="h-full rounded-full w-[65%]" style={{ backgroundImage: 'var(--xp-gradient)' }} />
              </div>
              <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>650 XP</p>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ SOCIAL PROOF ═══════════ */}
      <section className="px-5 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
                True. Grit. Then <span className="font-serif italic gradient-text">expertise.</span>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
              {[
                { value: '$2,200', label: 'Average DIY savings' },
                { value: '60s', label: 'Photo to action plan' },
                { value: '$0', label: 'Free to start' },
                { value: '$23,100', label: 'Total user savings' },
              ].map((s) => (
                <div key={s.label} className="rounded-[16px] p-5" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
                  <p className="text-2xl sm:text-3xl font-bold gradient-text mb-1">{s.value}</p>
                  <p className="text-xs text-[var(--text-dim)]">{s.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="px-5 py-24 sm:py-32 relative">
        <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(circle at 50% 50%, var(--hero-glow-sm) 0%, transparent 50%)' }} aria-hidden="true" />
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Mascot size="xl" mode="celebrate" />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] mb-4 tracking-tight">
              Your home has questions.<br />
              <span className="gradient-text">Now you have answers.</span>
            </h2>
            <p className="text-[var(--text-sub)] text-base mb-8 max-w-md mx-auto leading-relaxed">
              Stop Googling, stop guessing, stop overpaying. One photo is all it takes.
            </p>
            <Link href="/signup" className="inline-flex items-center justify-center text-white px-10 py-4 rounded-full text-[15px] font-bold tap transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]" style={{ backgroundImage: 'var(--accent-gradient)', boxShadow: '0 6px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)' }}>
              Get Started Free
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="px-5 py-14" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-2.5">
              <Image src="/brand/app-icon.png" alt="HomeProjectIQ" width={32} height={32} className="rounded-lg" />
              <span className="text-[15px] text-[var(--text)] font-bold tracking-tight">
                HomeProject<span style={{ color: 'var(--accent)' }}>IQ</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mascot size="sm" mode="default" animate={false} />
              <p className="text-sm text-[var(--text-dim)]">Built for solo homeowners.</p>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Features</a>
              <Link href="/demo/dashboard" className="text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Demo</Link>
              <Link href="/privacy" className="text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Terms</Link>
            </div>
          </div>
          <div className="pt-6" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs text-[var(--text-dim)] text-center">&copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
