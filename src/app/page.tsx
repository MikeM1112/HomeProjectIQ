'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { PhoneMockup } from '@/components/landing/PhoneMockup';
import { AppStoreBadge, GooglePlayBadge } from '@/components/landing/AppStoreBadges';
import { DashboardScreen } from '@/components/landing/screens/DashboardScreen';
import { AssessmentScreen } from '@/components/landing/screens/AssessmentScreen';
import { PlannerScreen } from '@/components/landing/screens/PlannerScreen';
import { BrandIcon } from '@/components/brand/BrandIcon';
import type { BrandIconName } from '@/components/brand/BrandIcon';

/* ── Scroll reveal hook (respects prefers-reduced-motion) ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Skip animation entirely for users who prefer reduced motion
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

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* [A11Y] Skip to content link for keyboard navigation (WCAG 2.4.1) */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
        style={{ background: 'var(--accent)', color: 'white' }}
      >
        Skip to main content
      </a>

      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full opacity-[0.12] blur-[180px]" style={{ background: 'var(--accent)' }} />
        <div className="absolute top-[40%] right-[-200px] w-[600px] h-[600px] rounded-full opacity-[0.06] blur-[160px]" style={{ background: 'var(--accent)' }} />
        <div className="absolute bottom-[-250px] left-[-150px] w-[700px] h-[700px] rounded-full opacity-[0.05] blur-[140px]" style={{ background: 'var(--emerald)' }} />
      </div>

      {/* ═══════════ NAV ═══════════ */}
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.2)' : 'none',
          borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(26,127,232,0.06)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Image
              src="/brand/app-icon.png"
              alt="HomeProjectIQ"
              width={36}
              height={36}
              className="rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105"
            />
            <span className="text-[15px] text-[var(--text)] font-bold tracking-tight">
              HomeProject<span style={{ color: 'var(--accent)' }}>IQ</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-8">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Use Cases', href: '#use-cases' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-[13px] font-medium text-[var(--text-sub)] hover:text-[var(--text)] transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <Link
              href="/signup"
              className="text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_var(--accent-glow)] min-h-[44px] flex items-center"
              style={{
                backgroundImage: 'var(--accent-gradient)',
                color: 'white',
                boxShadow: '0 2px 16px var(--accent-glow)',
                letterSpacing: '0.02em',
              }}
            >
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section id="hero" aria-labelledby="hero-heading" className="relative pt-24 sm:pt-40 pb-16 sm:pb-32 px-5">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle, var(--hero-glow-sm) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[11px] font-bold tracking-widest uppercase"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--glass-border)' }}
              >
                <span style={{ fontSize: '8px' }} aria-hidden="true">&#9679;</span>
                AI-Powered Home Intelligence
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="hidden sm:flex items-end gap-5 justify-center lg:justify-start mb-4 sm:mb-6">
                <Image
                  src="/brand/mascot-tools.png"
                  alt=""
                  role="presentation"
                  width={180}
                  height={156}
                  className="object-contain drop-shadow-xl motion-safe:animate-float w-[120px] h-auto sm:w-[180px]"
                  priority
                />
              </div>
            </Reveal>

            <Reveal delay={160}>
              <h1 id="hero-heading" className="text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] font-bold mb-6 leading-[1.08] tracking-tight">
                <span className="gradient-text">Know Before</span>
                <br />
                <span className="gradient-text">You Build.</span>
                <br />
                <span className="gradient-text">Know Before</span>
                <br />
                <span className="gradient-text">You Hire.</span>
              </h1>
            </Reveal>

            <Reveal delay={240}>
              <p className="text-[var(--text-sub)] text-base sm:text-xl mb-6 sm:mb-10 max-w-[480px] mx-auto lg:mx-0 leading-[1.6]">
                Snap a photo of any home issue. Get an instant diagnosis, cost estimate, and step-by-step plan &mdash; so you never overpay a contractor or start a project you can&rsquo;t finish.
              </p>
            </Reveal>

            <Reveal delay={320}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-full text-[15px] font-bold tap transition-all duration-200 hover:-translate-y-1"
                  style={{
                    backgroundImage: 'var(--accent-gradient)',
                    boxShadow: '0 6px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
                    letterSpacing: '0.01em',
                  }}
                >
                  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  Start Free &mdash; No Card Needed
                </Link>
                <Link
                  href="/demo/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-[13px] font-semibold tap text-[var(--text-sub)] transition-all duration-200 hover:text-[var(--text)] hover:-translate-y-0.5"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--glass-border)',
                  }}
                >
                  See it in action
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <p className="text-[12px] text-[var(--text-dim)] text-center lg:text-left mt-1">
                Available on iOS and Android
              </p>
            </Reveal>
          </div>

          <Reveal delay={200} className="flex justify-center lg:justify-end">
            <PhoneMockup tilt="right" glow>
              <DashboardScreen />
            </PhoneMockup>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" aria-labelledby="features-heading" className="px-5 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                Features
              </span>
              <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] tracking-tight">
                One photo. Total clarity.
              </h2>
              <p className="text-[var(--text-sub)] text-base max-w-md mx-auto leading-relaxed">
                From &ldquo;what is that?&rdquo; to a complete action plan &mdash; diagnosis, cost, and next steps in seconds.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {([
              { brandIcon: 'diagnose' as BrandIconName, title: 'Instant Photo Diagnosis', desc: 'Snap a photo of any issue \u2014 get a plain-English diagnosis, cost range, and action plan in under 60 seconds.' },
              { brandIcon: 'tools' as BrandIconName, title: 'DIY or Call a Pro?', desc: 'AI matches the project to your skill level and tells you honestly: tackle it yourself, or save time and hire out.' },
              { brandIcon: 'plan-fix' as BrandIconName, title: 'Home Health Score', desc: 'One number that tracks every major system \u2014 HVAC, plumbing, roof, electrical \u2014 so nothing sneaks up on you.' },
              { brandIcon: 'cost-savings' as BrandIconName, title: 'Project Planner', desc: 'See the full cost before you commit. Set savings goals, track timelines, and avoid mid-project budget surprises.' },
              { brandIcon: 'time' as BrandIconName, title: 'Seasonal Alerts', desc: 'Get reminders timed to your region and weather \u2014 like winterizing pipes before the first freeze, not after.' },
              { brandIcon: 'hire-pro' as BrandIconName, title: 'Pro Marketplace', desc: 'When a project needs a pro, get live bids from verified local contractors \u2014 no cold-calling, no guesswork.' },
            ]).map((feature, i) => (
              <Reveal key={feature.title} delay={i * 80}>
                <div
                  className="group relative rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-1.5 h-full"
                  style={{
                    background: 'var(--glass)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--card-shadow, 0 2px 16px rgba(0,0,0,0.06))',
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: '0 8px 40px rgba(26,127,232,0.12), inset 0 0 0 1px var(--glass-border-hover)' }}
                  />
                  {/* Top accent bar on hover */}
                  <div
                    className="absolute top-0 left-[10%] right-[10%] h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ backgroundImage: 'var(--accent-gradient)' }}
                  />
                  <div className="relative">
                    <div className="w-16 h-16 flex items-center justify-center mb-5">
                      <BrandIcon name={feature.brandIcon} size={64} />
                    </div>
                    <h3 className="text-[17px] font-bold text-[var(--text)] mb-2 tracking-tight">{feature.title}</h3>
                    <p className="text-sm text-[var(--text-sub)] leading-[1.65]">{feature.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section id="how-it-works" aria-labelledby="how-it-works-heading" className="px-5 py-24 sm:py-32 relative">
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{ background: 'radial-gradient(ellipse at 50% 30%, var(--hero-glow) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}
              >
                How It Works
              </span>
              <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] tracking-tight">
                Three steps. Sixty seconds.
              </h2>
              <p className="text-[var(--text-sub)] text-base">From photo to action plan — it&apos;s that simple.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6 relative">
            <div className="hidden md:block absolute top-[130px] left-[20%] right-[20%] h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, var(--glass-border), var(--glass-border), transparent)' }} aria-hidden="true" />

            {[
              { step: 1, title: 'Snap a Photo', desc: 'Take a photo of any home issue — a crack, a leak, a wall you want to remove.', phone: <AssessmentScreen /> },
              { step: 2, title: 'Get Your Diagnosis', desc: 'AI identifies the issue, estimates cost, and tells you if it\'s DIY-safe or needs a pro.', phone: <DashboardScreen /> },
              { step: 3, title: 'DIY or Hire a Pro', desc: 'Get step-by-step instructions for DIY, or receive live bids from verified contractors.', phone: <PlannerScreen /> },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 120}>
                <div className="text-center">
                  <div className="flex justify-center mb-6 sm:mb-8">
                    <PhoneMockup className="scale-[0.68] sm:scale-[0.88]">
                      {item.phone}
                    </PhoneMockup>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-[15px] font-bold relative z-10"
                    style={{ backgroundImage: 'var(--accent-gradient)', color: 'white', boxShadow: '0 4px 20px var(--accent-glow)' }}
                  >
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)] mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-sm text-[var(--text-sub)] max-w-[260px] mx-auto leading-[1.65]">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DEEP DIVES ═══════════ */}
      {([
        {
          badge: 'AI Vision', badgeBg: 'var(--accent-soft)', badgeColor: 'var(--accent)',
          title: 'AI That Sees What You Can\u2019t',
          points: [
            'Identifies mold vs soap scum, structural vs cosmetic cracks, termite vs water damage',
            'Detects load-bearing walls and hidden obstacles behind drywall',
            'Provides confidence scores so you know when to trust the diagnosis',
          ],
          pointColor: 'var(--accent)',
          phone: <AssessmentScreen />, tilt: 'left' as const, reverse: false,
        },
        {
          badge: 'Planning', badgeBg: 'var(--gold-soft)', badgeColor: 'var(--gold)',
          title: 'See the Full Cost Before You Commit',
          points: [
            'Know exact material costs upfront \u2014 no more sticker shock at the hardware store',
            'Compare DIY vs. hiring a pro side-by-side, including your time and tools',
            'Set a savings goal and track your progress so the project starts when you\u0027re ready',
          ],
          pointColor: 'var(--gold)',
          phone: <PlannerScreen />, tilt: 'right' as const, reverse: true,
        },
        {
          badge: 'Intelligence', badgeBg: 'var(--emerald-soft)', badgeColor: 'var(--emerald)',
          title: 'Catch Small Problems Before They Get Expensive',
          points: [
            'One health score tracks every major system \u2014 HVAC, plumbing, roof, electrical \u2014 at a glance',
            'Get maintenance alerts before a $50 fix turns into a $5,000 emergency',
            'Photo-verified assessments build a history, so you always know where things stand',
          ],
          pointColor: 'var(--emerald)',
          phone: <DashboardScreen />, tilt: 'left' as const, reverse: false,
        },
      ]).map((dive) => (
        <section key={dive.title} className="px-5 py-20 sm:py-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
            <Reveal className={dive.reverse ? 'flex justify-center' : 'flex justify-center order-1 lg:order-2'}>
              <PhoneMockup tilt={dive.tilt} glow>
                {dive.phone}
              </PhoneMockup>
            </Reveal>
            <Reveal delay={100} className={dive.reverse ? '' : 'order-2 lg:order-1'}>
              <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full mb-5 inline-block"
                style={{ background: dive.badgeBg, color: dive.badgeColor }}
              >
                {dive.badge}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-[var(--text)] tracking-tight">
                {dive.title}
              </h2>
              <div className="space-y-5">
                {dive.points.map((point) => (
                  <div key={point} className="flex items-start gap-3.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: dive.badgeBg }}
                    >
                      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={dive.pointColor} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p className="text-[15px] text-[var(--text-sub)] leading-[1.6]">{point}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      {/* ═══════════ SOCIAL PROOF ═══════════ */}
      <section className="px-5 py-16">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-[24px] p-6 sm:p-12 relative overflow-hidden"
              style={{
                background: 'var(--glass)',
                backdropFilter: 'blur(24px) saturate(1.1)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.1)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--card-shadow, 0 2px 20px rgba(0,0,0,0.06))',
              }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'var(--accent-gradient)' }}
              />
              <div className="relative">
                <p className="text-center text-[13px] font-bold text-[var(--text-sub)] mb-8 tracking-wide uppercase">
                  Why homeowners choose HomeProjectIQ
                </p>
                <div className="grid grid-cols-3 gap-3 sm:gap-6 text-center">
                  {[
                    { stat: '60s', label: 'Photo to action plan' },
                    { stat: '50+', label: 'Home issues identified' },
                    { stat: '$0', label: 'Free to start' },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-3xl sm:text-[2.75rem] font-[800] tracking-tight gradient-text leading-none">{item.stat}</p>
                      <p className="text-xs text-[var(--text-dim)] mt-1.5 font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ USE CASES ═══════════ */}
      <section id="use-cases" aria-labelledby="use-cases-heading" className="px-5 py-24 sm:py-32">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <span className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}
              >
                Use Cases
              </span>
              <h2 id="use-cases-heading" className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] tracking-tight">
                Problems homeowners actually face
              </h2>
              <p className="text-sm text-[var(--text-dim)]">Real scenarios where one photo saves you time, money, or both.</p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {([
              { brandIcon: 'diagnose' as BrandIconName, title: 'Mold vs. Soap Scum', desc: 'AI vision distinguishes dangerous mold from harmless buildup — potentially saving thousands in unnecessary remediation.', tag: 'Bathroom Assessment' },
              { brandIcon: 'plan-fix' as BrandIconName, title: 'Load-Bearing Detection', desc: 'Before you knock down that wall, AI analyzes structural indicators to flag potential load-bearing concerns.', tag: 'Renovation Planning' },
              { brandIcon: 'tools' as BrandIconName, title: 'DIY Step-by-Step', desc: 'Get guided instructions matched to your skill level — from faucet replacement to drywall repair.', tag: 'Guided Repair' },
            ]).map((scenario, i) => (
              <Reveal key={scenario.title} delay={i * 80}>
                <div
                  className="group relative rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-1.5 h-full"
                  style={{
                    background: 'var(--glass)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--card-shadow, 0 2px 16px rgba(0,0,0,0.06))',
                  }}
                >
                  <div
                    className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ boxShadow: '0 8px 40px rgba(26,127,232,0.12), inset 0 0 0 1px var(--glass-border-hover)' }}
                  />
                  <div className="relative">
                    <div className="mb-4">
                      <BrandIcon name={scenario.brandIcon} size={52} />
                    </div>
                    <h3 className="text-[17px] font-bold text-[var(--text)] mb-2 tracking-tight">{scenario.title}</h3>
                    <p className="text-sm text-[var(--text-sub)] leading-[1.65] mb-4">{scenario.desc}</p>
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full tracking-wide"
                      style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                    >
                      {scenario.tag}
                    </span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DOWNLOAD CTA ═══════════ */}
      <section id="download" className="px-5 py-24 sm:py-32 relative">
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle at 50% 50%, var(--hero-glow-sm) 0%, transparent 50%)' }}
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <Reveal className="text-center lg:text-left">
            <Image
              src="/brand/mascot-checklist.png"
              alt="HomeProjectIQ mascot with checklist"
              width={120}
              height={148}
              className="object-contain mx-auto lg:mx-0 mb-6 drop-shadow-lg"
            />
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 text-[var(--text)] tracking-tight">
              Stop guessing. Start fixing.
            </h2>
            <p className="text-[var(--text-sub)] text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Snap a photo of any home issue and get an instant diagnosis with cost estimates. Free to start, no credit card required.
            </p>
            <div className="flex gap-3 justify-center lg:justify-start mb-6">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
            <Link
              href="/demo/dashboard"
              className="text-sm font-bold transition-all hover:brightness-110 inline-flex items-center gap-1.5"
              style={{ color: 'var(--accent)' }}
            >
              Or try the interactive demo
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </Reveal>

          <Reveal delay={150} className="flex justify-center lg:justify-end">
            <PhoneMockup tilt="left" glow>
              <DashboardScreen />
            </PhoneMockup>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="px-5 py-14" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/brand/app-icon.png" alt="HomeProjectIQ" width={32} height={32} className="rounded-lg" />
                <span className="text-[15px] text-[var(--text)] font-bold tracking-tight">
                  HomeProject<span style={{ color: 'var(--accent)' }}>IQ</span>
                </span>
              </div>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">Know before you build. Know before you hire.</p>
            </div>

            {[
              { title: 'Product', links: [
                { label: 'Features', href: '#features' },
                { label: 'Demo', href: '/demo/dashboard', isLink: true },
                { label: 'Pricing', href: '#' },
              ]},
              { title: 'Company', links: [
                { label: 'About', href: '#' },
                { label: 'Blog', href: '#' },
                { label: 'Careers', href: '#' },
              ]},
              { title: 'Legal', links: [
                { label: 'Privacy', href: '/privacy', isLink: true },
                { label: 'Terms', href: '/terms', isLink: true },
              ]},
            ].map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-dim)] mb-4">{col.title}</p>
                <div className="space-y-1">
                  {col.links.map((link) =>
                    'isLink' in link && link.isLink ? (
                      <Link key={link.label} href={link.href} className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors duration-200 py-1.5">{link.label}</Link>
                    ) : (
                      <a key={link.label} href={link.href} className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors duration-200 py-1.5">{link.label}</a>
                    )
                  )}
                </div>
              </nav>
            ))}
          </div>

          <div className="pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs text-[var(--text-dim)] text-center tracking-wide">
              &copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
