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

/* ── Scroll reveal hook (respects prefers-reduced-motion) ── */
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

/* ── Feature card with mouse-tracking glow ── */
function FeatureCard({ icon, title, desc, delay }: { icon: BrandIconName; title: string; desc: string; delay: number }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <Reveal delay={delay}>
      <div
        onMouseMove={handleMouseMove}
        className="group relative rounded-[20px] p-6 transition-all duration-300 hover:-translate-y-1 h-full cursor-default"
        style={{
          background: 'linear-gradient(160deg, rgba(59,158,255,0.04) 0%, var(--glass) 40%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--card-shadow)',
          transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--glass-border-hover)';
          e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--glass-border)';
          e.currentTarget.style.boxShadow = 'var(--card-shadow)';
        }}
      >
        {/* Mouse-tracking radial glow */}
        <div
          className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: 'radial-gradient(300px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59,158,255,0.08), transparent 60%)',
          }}
        />
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-[15%] right-[15%] h-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ backgroundImage: 'var(--accent-gradient)' }}
        />
        <div className="relative">
          <div className="w-14 h-14 flex items-center justify-center mb-4">
            <BrandIcon name={icon} size={56} />
          </div>
          <h3 className="text-lg font-bold text-[var(--text)] mb-2 tracking-tight">{title}</h3>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">{desc}</p>
        </div>
      </div>
    </Reveal>
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
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg-gradient, var(--bg))' }}>
      {/* [A11Y] Skip to content link */}
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
        <div className="absolute bottom-[-250px] left-[-150px] w-[700px] h-[700px] rounded-full opacity-[0.05] blur-[140px]" style={{ background: 'var(--emerald)' }} />
      </div>

      {/* ═══════════ NAV ═══════════ */}
      <nav
        aria-label="Main navigation"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(1.4)' : 'none',
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
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="nav-link text-sm font-medium text-[var(--text-sub)] hover:text-[var(--text)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex text-sm font-medium text-[var(--text-sub)] hover:text-[var(--text)] transition-colors px-3 py-2"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-bold px-5 py-2.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 hover:shadow-[0_8px_24px_var(--accent-glow)] active:shadow-[0_2px_8px_var(--accent-glow)] min-h-[44px] flex items-center"
              style={{
                backgroundImage: 'var(--accent-gradient)',
                color: 'white',
                boxShadow: '0 2px 16px var(--accent-glow)',
              }}
            >
              Try Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section id="hero" aria-labelledby="hero-heading" className="relative pt-28 sm:pt-40 pb-8 sm:pb-16 px-5">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle, var(--hero-glow-sm) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest uppercase"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)', border: '1px solid var(--glass-border)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full motion-safe:animate-pulse"
                style={{ background: 'var(--accent)' }}
                aria-hidden="true"
              />
              AI-Powered Home Intelligence
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1
              id="hero-heading"
              className="font-serif text-[2.75rem] sm:text-[3.5rem] lg:text-[4rem] font-normal mb-6 leading-[1.08] tracking-tight text-[var(--text)]"
            >
              Snap a Photo.<br />
              <span className="gradient-text">Skip the Guesswork.</span>
            </h1>
          </Reveal>

          <Reveal delay={180}>
            <p className="text-[var(--text-sub)] text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              One photo gives you a diagnosis, cost estimate, and step-by-step plan&mdash;so
              you never overpay a contractor or start a project blind.
            </p>
          </Reveal>

          <Reveal delay={260}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center text-white px-8 py-4 rounded-full text-[15px] font-bold tap transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
                style={{
                  backgroundImage: 'var(--accent-gradient)',
                  boxShadow: '0 6px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                Get Your First Diagnosis Free
              </Link>
              <Link
                href="/demo/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tap text-[var(--text-sub)] transition-all duration-200 hover:text-[var(--text)] hover:-translate-y-0.5"
                style={{ border: '1px solid var(--glass-border)' }}
              >
                See it in action
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={340}>
            <p className="text-xs text-[var(--text-dim)]">Free forever. No credit card required.</p>
          </Reveal>

          <Reveal delay={400} className="mt-12 sm:mt-16 flex justify-center">
            <PhoneMockup glow>
              <AssessmentScreen />
            </PhoneMockup>
          </Reveal>
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
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}
              >
                How It Works
              </span>
              <h2 id="how-it-works-heading" className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] tracking-tight">
                Three steps. Sixty seconds.
              </h2>
              <p className="text-[var(--text-sub)] text-base">From photo to action plan&mdash;it&apos;s that simple.</p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6 relative">
            {/* Connecting line */}
            <div
              className="hidden md:block absolute top-[130px] left-[20%] right-[20%] h-[2px]"
              style={{ background: 'linear-gradient(90deg, transparent, var(--glass-border), var(--glass-border), transparent)' }}
              aria-hidden="true"
            />

            {[
              { step: 1, label: 'Snap', title: 'Take a Photo', desc: 'Point your camera at any home issue\u2014a crack, a leak, a stain, or a wall you want to remove.', phone: <AssessmentScreen /> },
              { step: 2, label: 'Know', title: 'Get Your Diagnosis', desc: 'AI identifies the problem, estimates the cost, and tells you if it\u2019s safe to DIY or needs a pro.', phone: <DashboardScreen /> },
              { step: 3, label: 'Act', title: 'Fix It or Hire Out', desc: 'Follow step-by-step instructions yourself, or get live bids from verified local contractors.', phone: <PlannerScreen /> },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 120}>
                <div className="text-center">
                  <div className="flex justify-center mb-6">
                    <PhoneMockup className="scale-[0.65] sm:scale-[0.85]">
                      {item.phone}
                    </PhoneMockup>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold relative z-10"
                    style={{ backgroundImage: 'var(--accent-gradient)', color: 'white', boxShadow: '0 4px 20px var(--accent-glow)' }}
                  >
                    {item.step}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>
                    {item.label}
                  </p>
                  <h3 className="text-lg font-bold text-[var(--text)] mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-sm text-[var(--text-sub)] max-w-[260px] mx-auto leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ FEATURES ═══════════ */}
      <section id="features" aria-labelledby="features-heading" className="px-5 py-24 sm:py-32">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-14">
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
              >
                Features
              </span>
              <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold mb-4 text-[var(--text)] tracking-tight">
                One photo. Total clarity.
              </h2>
              <p className="text-[var(--text-sub)] text-base max-w-md mx-auto leading-relaxed">
                From &ldquo;what is that?&rdquo; to a complete action plan&mdash;diagnosis, cost, and next steps in seconds.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-6">
            <FeatureCard
              icon="diagnose"
              title="60-Second Diagnosis"
              desc="Snap a photo of any issue — get a plain-English diagnosis, severity assessment, and action plan before you call anyone."
              delay={0}
            />
            <FeatureCard
              icon="tools"
              title="DIY or Hire a Pro?"
              desc="AI matches the job to your skill level and tells you honestly: tackle it yourself, or save time and hire out."
              delay={80}
            />
            <FeatureCard
              icon="plan-fix"
              title="Home Health Score"
              desc="One number tracks every major system — HVAC, plumbing, roof, electrical — so nothing sneaks up on you."
              delay={160}
            />
            <FeatureCard
              icon="cost-savings"
              title="Full-Cost Breakdown"
              desc="See the real cost before you commit. Materials, labor, and your time — compared side by side so there are no surprises."
              delay={240}
            />
          </div>
        </div>
      </section>

      <div className="section-divider" aria-hidden="true" />

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="px-5 py-24 sm:py-32 relative">
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle at 50% 50%, var(--hero-glow-sm) 0%, transparent 50%)' }}
          aria-hidden="true"
        />
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text)] mb-4 tracking-tight">
              Your home has questions.<br />
              <span className="gradient-text">Now you have answers.</span>
            </h2>
            <p className="text-[var(--text-sub)] text-base mb-8 max-w-md mx-auto leading-relaxed">
              Stop Googling, stop guessing, stop overpaying. One photo is all it takes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center text-white px-8 py-4 rounded-full text-[15px] font-bold tap transition-all duration-200 hover:-translate-y-1 active:scale-[0.98]"
                style={{
                  backgroundImage: 'var(--accent-gradient)',
                  boxShadow: '0 6px 28px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
              >
                Get Started Free
              </Link>
              <Link
                href="/demo/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-semibold tap text-[var(--text-sub)] transition-all duration-200 hover:text-[var(--text)] hover:-translate-y-0.5"
                style={{ border: '1px solid var(--glass-border)' }}
              >
                Try the demo
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="px-5 py-14" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <Image src="/brand/app-icon.png" alt="HomeProjectIQ" width={32} height={32} className="rounded-lg" />
                <span className="text-[15px] text-[var(--text)] font-bold tracking-tight">
                  HomeProject<span style={{ color: 'var(--accent)' }}>IQ</span>
                </span>
              </div>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">Snap a photo. Skip the guesswork.</p>
            </div>

            <nav aria-label="Product">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-dim)] mb-4">Product</p>
              <div className="space-y-1">
                <a href="#features" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors py-1.5">Features</a>
                <a href="#how-it-works" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors py-1.5">How It Works</a>
                <Link href="/demo/dashboard" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors py-1.5">Demo</Link>
              </div>
            </nav>

            <nav aria-label="Legal">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-dim)] mb-4">Legal</p>
              <div className="space-y-1">
                <Link href="/privacy" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors py-1.5">Privacy</Link>
                <Link href="/terms" className="block text-sm text-[var(--text-sub)] hover:text-[var(--accent)] transition-colors py-1.5">Terms</Link>
              </div>
            </nav>
          </div>

          <div className="pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs text-[var(--text-dim)] text-center">
              &copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
