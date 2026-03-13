'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PhoneMockup } from '@/components/landing/PhoneMockup';
import { DashboardScreen } from '@/components/landing/screens/DashboardScreen';
import { AssessmentScreen } from '@/components/landing/screens/AssessmentScreen';
import { PlannerScreen } from '@/components/landing/screens/PlannerScreen';
import {
  DiagnoseScreen,
  GuidedRepairScreen,
  ToolboxScreen,
  RiskRadarScreen,
  CapabilityScreen,
  TimelineScreen,
} from '@/components/landing/screens/ShowcaseScreens';
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
      { threshold: 0.12 }
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
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Coming Soon Pill ── */
function ComingSoonPill({ store }: { store: 'apple' | 'google' }) {
  return (
    <div
      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-[13px] font-medium"
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--glass-border)',
        color: 'var(--text-sub)',
      }}
    >
      <span className="text-base">{store === 'apple' ? '🍎' : '▶️'}</span>
      Coming Soon to {store === 'apple' ? 'App Store' : 'Google Play'}
    </div>
  );
}

/* ── Section heading reusable ── */
function SectionHeading({
  tag,
  tagColor = 'var(--accent)',
  tagBg = 'var(--accent-soft)',
  title,
  subtitle,
}: {
  tag: string;
  tagColor?: string;
  tagBg?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-14 sm:mb-20">
      <span
        className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5"
        style={{ background: tagBg, color: tagColor }}
      >
        {tag}
      </span>
      <h2 className="text-3xl sm:text-[2.75rem] lg:text-5xl font-bold text-[var(--text)] tracking-tight leading-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[var(--text-sub)] text-base sm:text-lg max-w-xl mx-auto leading-relaxed">{subtitle}</p>
      )}
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

/* ── Screen showcase data ── */
const SHOWCASE_SCREENS = [
  { label: 'Dashboard', component: <DashboardScreen /> },
  { label: 'Diagnose', component: <DiagnoseScreen /> },
  { label: 'Assessment', component: <AssessmentScreen /> },
  { label: 'Guided Repair', component: <GuidedRepairScreen /> },
  { label: 'Toolbox', component: <ToolboxScreen /> },
  { label: 'Risk Radar', component: <RiskRadarScreen /> },
  { label: 'Capability Score', component: <CapabilityScreen /> },
  { label: 'Timeline', component: <TimelineScreen /> },
  { label: 'Project Planner', component: <PlannerScreen /> },
];

/* ── Feature data ── */
const FEATURES = [
  {
    tag: 'AI Diagnosis',
    tagBg: 'var(--accent-soft)',
    tagColor: 'var(--accent)',
    headline: <>See what&rsquo;s wrong <span className="gradient-text">fast</span></>,
    copy: 'Upload a photo or describe the issue and get a clear, structured diagnosis with severity, urgency, and next steps.',
    points: [
      'AI-powered photo analysis identifies problems in seconds',
      'Severity rating with urgency classification',
      'Immediate safety warnings for hazardous issues',
    ],
    screen: <DiagnoseScreen />,
    tilt: 'right' as const,
    reversed: false,
  },
  {
    tag: 'DIY vs Pro',
    tagBg: 'var(--emerald-soft)',
    tagColor: 'var(--emerald)',
    headline: <>Know if DIY makes sense <span className="gradient-text">before you start</span></>,
    copy: 'Compare DIY cost, tools, time, and professional pricing so you can make the right call for your situation.',
    points: [
      'Side-by-side cost comparison: DIY vs. hiring a pro',
      'Tool availability check against your toolbox',
      'Time estimate based on your skill level',
    ],
    screen: <AssessmentScreen />,
    tilt: 'left' as const,
    reversed: true,
  },
  {
    tag: 'Guided Repair',
    tagBg: 'var(--gold-soft)',
    tagColor: 'var(--gold)',
    headline: <>Repair with <span className="gradient-text">GPS-style guidance</span></>,
    copy: 'HomeProjectIQ stays with you through the project, letting you upload progress photos and get feedback as you go.',
    points: [
      'Step-by-step repair instructions with photo checkpoints',
      'AI validates your progress at each step',
      'Pro tips and safety warnings throughout',
    ],
    screen: <GuidedRepairScreen />,
    tilt: 'right' as const,
    reversed: false,
  },
  {
    tag: 'Risk Intelligence',
    tagBg: 'var(--accent-soft)',
    tagColor: 'var(--accent)',
    headline: <>Track what&rsquo;s most likely to <span className="gradient-text">fail next</span></>,
    copy: 'See your home\u2019s risk radar, capability score, active issues, and next best move in one clean command center.',
    points: [
      'System-by-system risk visualization',
      'Proactive alerts before small issues become expensive',
      'Home Capability Score tracks your readiness',
    ],
    screen: <RiskRadarScreen />,
    tilt: 'left' as const,
    reversed: true,
  },
  {
    tag: 'Smart Toolbox',
    tagBg: 'var(--emerald-soft)',
    tagColor: 'var(--emerald)',
    headline: <>Your toolbox, your readiness, <span className="gradient-text">your network</span></>,
    copy: 'Track tools, compare what a project needs, and see when a friend\u2019s tool makes DIY worth it.',
    points: [
      'Digital tool inventory with condition tracking',
      'Project-to-tool matching tells you what you need',
      'Borrow from friends to avoid unnecessary purchases',
    ],
    screen: <ToolboxScreen />,
    tilt: 'right' as const,
    reversed: false,
  },
];

/* ═══════════════════════════════════════════════════════════════════
   LANDING PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Skip link */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
        style={{ background: 'var(--accent)', color: 'white' }}
      >
        Skip to main content
      </a>

      {/* ═══════ Ambient glow ═══════ */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.06] blur-[200px]" style={{ background: '#069CA8' }} />
        <div className="absolute top-[55%] right-[-250px] w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[180px]" style={{ background: '#069CA8' }} />
        <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] rounded-full opacity-[0.03] blur-[150px]" style={{ background: '#0B5491' }} />
      </div>

      {/* ═══════════════════════════════════════════════════════════
          TOP NAVIGATION
         ═══════════════════════════════════════════════════════════ */}
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
          {/* Logo */}
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

          {/* Center links — desktop only */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Screens', href: '#screens' },
              { label: 'Coming Soon', href: '#coming-soon' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[var(--text-sub)] hover:text-[var(--text)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right CTA cluster */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/demo/dashboard"
              className="text-sm font-medium text-[var(--text-sub)] hover:text-[var(--text)] transition-colors px-3 py-2"
            >
              Demo
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-[var(--text-sub)] hover:text-[var(--text)] transition-colors px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 min-h-[44px] flex items-center"
              style={{
                backgroundImage: 'var(--accent-gradient)',
                color: 'white',
                boxShadow: '0 2px 16px var(--accent-glow)',
              }}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
            style={{ color: 'var(--text)' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileMenu ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenu && (
          <div
            className="sm:hidden px-5 pb-6 pt-2 space-y-2"
            style={{
              background: 'var(--nav-bg)',
              backdropFilter: 'blur(24px)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            {[
              { label: 'Features', href: '#features' },
              { label: 'Screens', href: '#screens' },
              { label: 'Coming Soon', href: '#coming-soon' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenu(false)}
                className="block text-sm font-medium py-2 text-[var(--text-sub)] hover:text-[var(--text)]"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--border)' }}>
              <Link
                href="/demo/dashboard"
                className="block text-sm font-medium py-2 text-center rounded-xl"
                style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text)' }}
                onClick={() => setMobileMenu(false)}
              >
                View Demo
              </Link>
              <Link
                href="/signup"
                className="block text-sm font-bold py-3 text-center rounded-xl text-white"
                style={{ backgroundImage: 'var(--accent-gradient)' }}
                onClick={() => setMobileMenu(false)}
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="block text-sm font-medium py-2 text-center text-[var(--text-sub)]"
                onClick={() => setMobileMenu(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
         ═══════════════════════════════════════════════════════════ */}
      <section id="hero" aria-labelledby="hero-heading" className="relative pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-20 px-5">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle, var(--hero-glow-sm) 0%, transparent 60%)' }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column — text */}
          <div className="text-center lg:text-left">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-bold tracking-widest uppercase" style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--glass-border)' }}>
                <span className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                AI-Powered Home Intelligence
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1
                id="hero-heading"
                className="font-serif text-[2.5rem] sm:text-[3.25rem] lg:text-[3.75rem] font-normal leading-[1.08] tracking-tight text-[var(--text)] mb-6"
              >
                Know what&rsquo;s wrong.<br />
                Know what to do.<br />
                <span className="gradient-text">Know if DIY is worth it.</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="text-[var(--text-sub)] text-base sm:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                HomeProjectIQ helps homeowners diagnose issues, compare DIY vs pro, track tools, follow guided repairs, and stay ahead of home risk.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-6">
                <Link
                  href="/demo/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 min-h-[48px]"
                  style={{
                    border: '1.5px solid var(--glass-border)',
                    color: 'var(--text)',
                    background: 'var(--glass)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  View Demo
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center text-white px-8 py-4 rounded-full text-[15px] font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] min-h-[48px]"
                  style={{
                    backgroundImage: 'var(--accent-gradient)',
                    boxShadow: '0 6px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  Sign Up Free
                </Link>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <p className="text-xs text-[var(--text-dim)] mb-6">
                Already have an account?{' '}
                <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--accent)' }}>
                  Sign In
                </Link>
              </p>
            </Reveal>

            <Reveal delay={360}>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <ComingSoonPill store="apple" />
                <ComingSoonPill store="google" />
              </div>
            </Reveal>
          </div>

          {/* Right column — phone stack */}
          <Reveal delay={200} className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Back phone — left */}
              <div className="absolute -left-8 sm:-left-12 top-8 sm:top-12 z-0 opacity-80 scale-[0.7] sm:scale-[0.78]">
                <PhoneMockup tilt="left">
                  <DashboardScreen />
                </PhoneMockup>
              </div>

              {/* Center phone — main */}
              <div className="relative z-10">
                <PhoneMockup glow>
                  <AssessmentScreen />
                </PhoneMockup>
              </div>

              {/* Back phone — right */}
              <div className="absolute -right-8 sm:-right-12 top-8 sm:top-12 z-0 opacity-80 scale-[0.7] sm:scale-[0.78]">
                <PhoneMockup tilt="right">
                  <GuidedRepairScreen />
                </PhoneMockup>
              </div>

              {/* Floating glass callouts */}
              <div
                className="absolute -left-4 sm:left-0 top-[55%] z-20 rounded-xl px-3 py-2 hidden sm:flex items-center gap-2"
                style={{
                  background: 'var(--glass)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--emerald-soft)' }}>
                  <span className="text-xs">✅</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold" style={{ color: 'var(--text)' }}>DIY Worth It</p>
                  <p className="text-[7px]" style={{ color: 'var(--text-dim)' }}>Save $1,200</p>
                </div>
              </div>

              <div
                className="absolute -right-4 sm:right-0 top-[35%] z-20 rounded-xl px-3 py-2 hidden sm:flex items-center gap-2"
                style={{
                  background: 'var(--glass)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-soft)' }}>
                  <span className="text-xs">🏠</span>
                </div>
                <div>
                  <p className="text-[9px] font-bold" style={{ color: 'var(--text)' }}>Home Score</p>
                  <p className="text-[7px]" style={{ color: 'var(--accent)' }}>82 / B+</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════
          PROOF SECTION — See the App in Action
         ═══════════════════════════════════════════════════════════ */}
      <section id="screens" className="px-5 py-24 sm:py-32 relative">
        <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse at 50% 30%, var(--hero-glow) 0%, transparent 55%)' }} aria-hidden="true" />

        <Reveal>
          <SectionHeading
            tag="App Screens"
            title={<>See how HomeProjectIQ <span className="gradient-text">works</span></>}
            subtitle="Real screens from the app — every feature designed for clarity and speed."
          />
        </Reveal>

        {/* Horizontal scrollable screen showcase */}
        <Reveal delay={100}>
          <div className="relative -mx-5">
            <div className="flex gap-8 overflow-x-auto px-5 pb-6 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {SHOWCASE_SCREENS.map((screen, i) => (
                <div key={screen.label} className="flex-none snap-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="scale-[0.72] sm:scale-[0.82] origin-top">
                      <PhoneMockup glow={i === 0}>{screen.component}</PhoneMockup>
                    </div>
                    <span
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: 'var(--glass)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-sub)',
                      }}
                    >
                      {screen.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* View Full Demo CTA */}
        <Reveal delay={200}>
          <div className="text-center mt-8">
            <Link
              href="/demo/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                backgroundImage: 'var(--accent-gradient)',
                color: 'white',
                boxShadow: '0 4px 20px var(--accent-glow)',
              }}
            >
              View Full Demo
              <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════
          FEATURE SECTIONS (5)
         ═══════════════════════════════════════════════════════════ */}
      <div id="features">
        {FEATURES.map((feat, idx) => (
          <section key={feat.tag} className="px-5 py-20 sm:py-28">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text column */}
              <Reveal className={feat.reversed ? 'order-1 lg:order-2' : ''}>
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="inline-block text-[11px] font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
                      style={{ background: feat.tagBg, color: feat.tagColor }}
                    >
                      {feat.tag}
                    </span>
                    {idx === 0 && <Mascot size="sm" mode="diagnostic" animate={false} />}
                    {idx === 2 && <Mascot size="sm" mode="checklist" animate={false} />}
                  </div>
                  <h2 className="text-3xl sm:text-[2.5rem] font-bold mb-5 text-[var(--text)] tracking-tight leading-tight">
                    {feat.headline}
                  </h2>
                  <p className="text-[var(--text-sub)] text-base mb-8 leading-relaxed max-w-lg">
                    {feat.copy}
                  </p>
                  <div className="space-y-4">
                    {feat.points.map((point) => (
                      <div key={point} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: feat.tagBg }}>
                          <Check />
                        </div>
                        <p className="text-sm text-[var(--text-sub)] leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              {/* Phone column */}
              <Reveal
                delay={150}
                className={`flex justify-center ${feat.reversed ? 'order-2 lg:order-1 lg:justify-start' : 'lg:justify-end'}`}
              >
                <PhoneMockup tilt={feat.tilt} glow>{feat.screen}</PhoneMockup>
              </Reveal>
            </div>

            {idx < FEATURES.length - 1 && <div className="section-divider mt-20 sm:mt-28" aria-hidden="true" />}
          </section>
        ))}
      </div>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════
          DEMO CTA SECTION
         ═══════════════════════════════════════════════════════════ */}
      <section className="px-5 py-24 sm:py-32 relative">
        <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(ellipse at 50% 50%, var(--hero-glow) 0%, transparent 50%)' }} aria-hidden="true" />
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Mascot size="xl" mode="celebrate" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-4">
              See it in action
            </h2>
            <p className="text-[var(--text-sub)] text-base mb-8 max-w-md mx-auto leading-relaxed">
              Explore the full HomeProjectIQ experience. Browse every screen, every feature, every detail.
            </p>
            <Link
              href="/demo/dashboard"
              className="inline-flex items-center justify-center gap-2 text-white px-10 py-4 rounded-full text-[15px] font-bold transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
              style={{
                backgroundImage: 'var(--accent-gradient)',
                boxShadow: '0 6px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              Explore Full Demo
            </Link>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════
          COMING SOON SECTION
         ═══════════════════════════════════════════════════════════ */}
      <section id="coming-soon" className="px-5 py-24 sm:py-32">
        <Reveal>
          <div
            className="max-w-3xl mx-auto rounded-[28px] p-8 sm:p-14 text-center relative overflow-hidden"
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            {/* Ambient glow inside card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-[0.08] blur-[80px] pointer-events-none -z-10" style={{ background: 'var(--accent)' }} aria-hidden="true" />

            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight mb-4">
              Coming soon to <span className="gradient-text">iPhone and Android</span>
            </h2>
            <p className="text-[var(--text-sub)] text-base mb-8 max-w-md mx-auto leading-relaxed">
              Be first to know when HomeProjectIQ launches on the Apple App Store and Google Play.
            </p>

            <div className="flex flex-wrap gap-3 justify-center mb-8">
              <ComingSoonPill store="apple" />
              <ComingSoonPill store="google" />
            </div>

            {/* Notify Me — email capture */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-3 rounded-full text-sm outline-none transition-all focus:ring-2"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              />
              <button
                className="px-6 py-3 rounded-full text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] shrink-0"
                style={{
                  backgroundImage: 'var(--accent-gradient)',
                  boxShadow: '0 4px 16px var(--accent-glow)',
                }}
              >
                Notify Me
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════════════════════════════════════════════════════
          SIGN UP / SIGN IN CTA BAND
         ═══════════════════════════════════════════════════════════ */}
      <section className="px-5 py-24 sm:py-32 relative">
        <div className="absolute inset-0 pointer-events-none -z-10" style={{ background: 'radial-gradient(circle at 50% 50%, var(--hero-glow-sm) 0%, transparent 50%)' }} aria-hidden="true" />
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] mb-4 tracking-tight">
              Get early access to<br />
              <span className="gradient-text">HomeProjectIQ</span>
            </h2>
            <p className="text-[var(--text-sub)] text-base mb-8 max-w-md mx-auto leading-relaxed">
              Start diagnosing issues, planning projects, and building your home intelligence today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center text-white px-10 py-4 rounded-full text-[15px] font-bold transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
                style={{
                  backgroundImage: 'var(--accent-gradient)',
                  boxShadow: '0 6px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                Sign Up Free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  border: '1.5px solid var(--glass-border)',
                  color: 'var(--text)',
                  background: 'var(--glass)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                Sign In
              </Link>
            </div>
            <p className="text-xs text-[var(--text-dim)] mt-4">
              Already exploring the platform? Sign in to continue.
            </p>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
         ═══════════════════════════════════════════════════════════ */}
      <footer className="px-5 py-14" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mb-12">
            {/* Brand column */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/brand/app-icon.png" alt="HomeProjectIQ" width={32} height={32} className="rounded-lg" />
                <span className="text-[15px] text-[var(--text)] font-bold tracking-tight">
                  HomeProject<span style={{ color: 'var(--accent)' }}>IQ</span>
                </span>
              </div>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-4">
                The AI-powered operating system for home repair readiness.
              </p>
              <div className="flex items-center gap-2">
                <Mascot size="sm" mode="default" animate={false} />
                <span className="text-xs text-[var(--text-dim)]">Built for homeowners.</span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[var(--text-dim)]">Product</h4>
              <div className="space-y-3">
                <a href="#features" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Features</a>
                <a href="#screens" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Screens</a>
                <Link href="/demo/dashboard" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Demo</Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[var(--text-dim)]">Account</h4>
              <div className="space-y-3">
                <Link href="/signup" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Sign Up</Link>
                <Link href="/login" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Sign In</Link>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[var(--text-dim)]">Legal</h4>
              <div className="space-y-3">
                <Link href="/privacy" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Privacy</Link>
                <Link href="/terms" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Terms</Link>
                <a href="mailto:support@homeprojectiq.com" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors">Contact</a>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs text-[var(--text-dim)]">&copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.</p>
            <div className="flex gap-4">
              <ComingSoonPill store="apple" />
              <ComingSoonPill store="google" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
