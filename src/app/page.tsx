'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/settings/ThemeToggle';
import { PhoneMockup } from '@/components/landing/PhoneMockup';
import { AppStoreBadge, GooglePlayBadge } from '@/components/landing/AppStoreBadges';
import { DashboardScreen } from '@/components/landing/screens/DashboardScreen';
import { AssessmentScreen } from '@/components/landing/screens/AssessmentScreen';
import { PlannerScreen } from '@/components/landing/screens/PlannerScreen';
import { Mascot } from '@/components/brand/Mascot';
import { BrandIcon } from '@/components/brand/BrandIcon';
import type { BrandIconName } from '@/components/brand/BrandIcon';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Background ice-blue ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-250px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-[0.10] blur-[160px]" style={{ background: 'var(--accent)' }} />
        <div className="absolute top-1/3 right-[-200px] w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[140px]" style={{ background: 'var(--accent)' }} />
        <div className="absolute bottom-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px]" style={{ background: 'var(--emerald)' }} />
      </div>

      {/* ═══════════ 1. NAV BAR ═══════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'var(--nav-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--glass-border)' : '1px solid transparent',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Mascot mode="default" size="sm" />
            <span className="font-serif text-base text-[var(--text)] font-semibold">HomeProjectIQ</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            {[
              { label: 'Features', href: '#features' },
              { label: 'How It Works', href: '#how-it-works' },
              { label: 'Reviews', href: '#reviews' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-[var(--text-sub)] hover:text-[var(--text)] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle compact />
            <a
              href="#download"
              className="text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: 'var(--accent-gradient)',
                backgroundImage: 'var(--accent-gradient)',
                color: 'white',
                boxShadow: '0 2px 12px var(--accent-glow)',
              }}
            >
              Download
            </a>
          </div>
        </div>
      </nav>

      {/* ═══════════ 2. HERO ═══════════ */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 px-5">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle, var(--hero-glow-sm) 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
              <Mascot mode="default" size="lg" />
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-5 leading-[1.1]">
              <span className="gradient-text">Your Home&apos;s</span>
              <br />
              <span className="gradient-text">AI Co-Pilot</span>
            </h1>
            <p className="text-[var(--text-sub)] text-lg sm:text-xl mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              AI-powered home assessment that tells you exactly what to fix, whether to DIY or hire a pro, and how much it&apos;ll cost.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
              <Link
                href="/signup"
                className="btn bg-[image:var(--accent-gradient)] text-white px-8 py-3.5 rounded-full text-base font-semibold tap shadow-[0_4px_20px_var(--accent-glow)] hover:shadow-[0_8px_32px_var(--accent-glow)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Download Free
              </Link>
              <Link
                href="/demo/dashboard"
                className="btn bg-[var(--glass)] backdrop-blur-[12px] border border-[var(--glass-border)] px-8 py-3.5 rounded-full text-base font-semibold tap text-[var(--text)] hover:border-[var(--glass-border-hover)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Try the Demo &rarr;
              </Link>
            </div>

            <div className="flex gap-3 justify-center lg:justify-start">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </div>

          {/* Right: phone mockup */}
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup tilt="right" glow>
              <DashboardScreen />
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* ═══════════ 3. FEATURE GRID ═══════════ */}
      <section id="features" className="px-5 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl mb-3 text-[var(--text)]">
              Everything your home needs
            </h2>
            <p className="text-[var(--text-sub)] text-base max-w-md mx-auto">
              From diagnosis to completion — one app for every home project.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {([
              { brandIcon: 'diagnose' as BrandIconName, title: 'AI Photo Assessment', desc: 'Snap a photo of any issue — get a diagnosis, cost estimate, and action plan in seconds.' },
              { brandIcon: 'tools' as BrandIconName, title: 'DIY Feasibility', desc: 'AI matches your skill level to every project and tells you honestly when to hire a pro.' },
              { brandIcon: 'plan-fix' as BrandIconName, title: 'Home Health Score', desc: 'Track every system in your home — HVAC, plumbing, roof, electrical — with one score.' },
              { brandIcon: 'cost-savings' as BrandIconName, title: 'Project Planner', desc: 'Budget and save for future projects with automatic savings goals and timeline tracking.' },
              { brandIcon: 'time' as BrandIconName, title: 'Smart Insights', desc: 'Weather-aware tips and seasonal reminders personalized to your home and your region.' },
              { brandIcon: 'hire-pro' as BrandIconName, title: 'Pro Marketplace', desc: 'Get live bids from verified contractors when a project is beyond your skill level.' },
            ]).map((feature) => (
              <div
                key={feature.title}
                className="rounded-[20px] bg-[var(--glass)] backdrop-blur-[16px] border border-[var(--glass-border)] shadow-[var(--card-shadow,_0_2px_16px_rgba(0,0,0,0.08))] p-6 transition-all duration-300 hover:border-[var(--glass-border-hover)] hover:-translate-y-1"
              >
                <div className="w-14 h-14 flex items-center justify-center mb-4">
                  <BrandIcon name={feature.brandIcon} size={56} />
                </div>
                <h3 className="font-serif text-lg text-[var(--text)] mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-sub)] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 4. HOW IT WORKS ═══════════ */}
      <section id="how-it-works" className="px-5 py-20 sm:py-28 relative">
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle at 50% 50%, var(--hero-glow) 0%, transparent 50%)' }}
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl mb-3 text-[var(--text)]">
              How it works
            </h2>
            <p className="text-[var(--text-sub)] text-base">Three steps. Sixty seconds. Done.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-4 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-[120px] left-[16.7%] right-[16.7%] h-[2px]" style={{ background: 'var(--glass-border)' }} aria-hidden="true" />

            {[
              {
                step: 1,
                title: 'Snap a Photo',
                desc: 'Take a photo of any home issue — a crack, a leak, a wall you want to remove.',
                phone: <AssessmentScreen />,
              },
              {
                step: 2,
                title: 'Get Your Diagnosis',
                desc: 'AI identifies the issue, estimates cost, and tells you if it\'s DIY-safe or needs a pro.',
                phone: <DashboardScreen />,
              },
              {
                step: 3,
                title: 'DIY or Hire a Pro',
                desc: 'Get step-by-step instructions for DIY, or receive live bids from verified contractors.',
                phone: <PlannerScreen />,
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="flex justify-center mb-6">
                  <PhoneMockup className="scale-[0.85] sm:scale-90">
                    {item.phone}
                  </PhoneMockup>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 text-base font-bold relative z-10"
                  style={{ background: 'var(--accent-gradient)', backgroundImage: 'var(--accent-gradient)', color: 'white', boxShadow: '0 4px 16px var(--accent-glow)' }}
                >
                  {item.step}
                </div>
                <h3 className="font-serif text-xl text-[var(--text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--text-sub)] max-w-[260px] mx-auto leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 5. FEATURE DEEP DIVES ═══════════ */}
      {/* Deep Dive A: AI Assessment */}
      <section className="px-5 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
              AI Vision
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl mb-4 text-[var(--text)]">
              AI That Sees What You Can&apos;t
            </h2>
            <div className="space-y-3 mb-6">
              {[
                'Identifies mold vs soap scum, structural vs cosmetic cracks, termite vs water damage',
                'Detects load-bearing walls and hidden obstacles behind drywall',
                'Provides confidence scores so you know when to trust the diagnosis',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="text-xs mt-0.5" style={{ color: 'var(--accent)' }}>&#10003;</span>
                  <p className="text-sm text-[var(--text-sub)] leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <PhoneMockup tilt="left" glow>
              <AssessmentScreen />
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* Deep Dive B: Project Planner */}
      <section className="px-5 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <PhoneMockup tilt="right" glow>
              <PlannerScreen />
            </PhoneMockup>
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'var(--gold-soft)', color: 'var(--gold)' }}>
              Planning
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl mb-4 text-[var(--text)]">
              Plan It. Budget It. Build It.
            </h2>
            <div className="space-y-3 mb-6">
              {[
                'Set savings goals for future projects with automatic monthly tracking',
                'See exactly what materials cost before you commit to a project',
                'Compare DIY vs pro costs side-by-side for every project',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="text-xs mt-0.5" style={{ color: 'var(--gold)' }}>&#10003;</span>
                  <p className="text-sm text-[var(--text-sub)] leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deep Dive C: Home Health */}
      <section className="px-5 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4 inline-block" style={{ background: 'var(--emerald-soft)', color: 'var(--emerald)' }}>
              Intelligence
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl mb-4 text-[var(--text)]">
              Your Home&apos;s Health Dashboard
            </h2>
            <div className="space-y-3 mb-6">
              {[
                'Track every system — HVAC, plumbing, roof, electrical — with a single health score',
                'Get maintenance reminders before small issues become expensive repairs',
                'Photo-verified system assessments with AI-powered condition tracking',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="text-xs mt-0.5" style={{ color: 'var(--emerald)' }}>&#10003;</span>
                  <p className="text-sm text-[var(--text-sub)] leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 flex justify-center">
            <PhoneMockup tilt="left" glow>
              <DashboardScreen />
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* ═══════════ 6. SOCIAL PROOF BAR ═══════════ */}
      <section className="px-5 py-16">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-[20px] bg-[var(--glass)] backdrop-blur-[16px] border border-[var(--glass-border)] shadow-[var(--card-shadow,_0_2px_16px_rgba(0,0,0,0.08))] p-8 sm:p-10"
          >
            <p className="text-center text-sm font-semibold text-[var(--text-sub)] mb-6">
              Built for homeowners who want to do it right
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { stat: 'AI-Powered', label: 'Smart diagnostics' },
                { stat: 'Every Project', label: 'Simplified' },
                { stat: 'DIY or Pro', label: 'Guided decisions' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-2xl sm:text-3xl font-[800]" style={{ color: 'var(--accent)' }}>{item.stat}</p>
                  <p className="text-xs text-[var(--text-dim)] mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ 7. USE CASES ═══════════ */}
      <section id="reviews" className="px-5 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl mb-3 text-[var(--text)]">
              Real scenarios, real savings
            </h2>
            <p className="text-sm text-[var(--text-dim)]">See what HomeProjectIQ can do</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {([
              {
                brandIcon: 'diagnose' as BrandIconName,
                title: 'Mold vs. Soap Scum',
                desc: 'AI vision distinguishes dangerous mold from harmless buildup — potentially saving thousands in unnecessary remediation.',
                tag: 'Bathroom Assessment',
              },
              {
                brandIcon: 'plan-fix' as BrandIconName,
                title: 'Load-Bearing Detection',
                desc: 'Before you knock down that wall, AI analyzes structural indicators to flag potential load-bearing concerns.',
                tag: 'Renovation Planning',
              },
              {
                brandIcon: 'tools' as BrandIconName,
                title: 'DIY Step-by-Step',
                desc: 'Get guided instructions matched to your skill level — from faucet replacement to drywall repair.',
                tag: 'Guided Repair',
              },
            ]).map((scenario) => (
              <div
                key={scenario.title}
                className="rounded-[20px] bg-[var(--glass)] backdrop-blur-[16px] border border-[var(--glass-border)] shadow-[var(--card-shadow,_0_2px_16px_rgba(0,0,0,0.08))] p-6 transition-all duration-300 hover:border-[var(--glass-border-hover)]"
              >
                <div className="mb-3">
                  <BrandIcon name={scenario.brandIcon} size={44} />
                </div>
                <h3 className="font-serif text-lg text-[var(--text)] mb-2">{scenario.title}</h3>
                <p className="text-sm text-[var(--text-sub)] leading-relaxed mb-4">
                  {scenario.desc}
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}>
                  {scenario.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 8. DOWNLOAD CTA ═══════════ */}
      <section id="download" className="px-5 py-20 sm:py-28 relative">
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle at 50% 50%, var(--hero-glow-sm) 0%, transparent 50%)' }}
          aria-hidden="true"
        />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="font-serif text-3xl sm:text-4xl mb-4 text-[var(--text)]">
              Ready to get started?
            </h2>
            <p className="text-[var(--text-sub)] text-lg mb-8 max-w-md mx-auto lg:mx-0">
              Download HomeProjectIQ free. No credit card required. Start your first project in 60 seconds.
            </p>
            <div className="flex gap-3 justify-center lg:justify-start mb-6">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
            <Link
              href="/demo/dashboard"
              className="text-sm font-semibold transition-colors hover:brightness-110"
              style={{ color: 'var(--accent)' }}
            >
              Or try the interactive demo &rarr;
            </Link>
          </div>
          <div className="flex justify-center lg:justify-end">
            <PhoneMockup tilt="left" glow>
              <DashboardScreen />
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* ═══════════ 9. FOOTER ═══════════ */}
      <footer className="border-t border-[var(--border)] px-5 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-10">
            {/* Logo */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mascot mode="default" size="sm" />
                <span className="font-serif text-base text-[var(--text)] font-semibold">HomeProjectIQ</span>
              </div>
              <p className="text-sm text-[var(--text-dim)]">Know before you build.</p>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-3">Product</p>
              <div className="space-y-2">
                <a href="#features" className="block text-sm text-[var(--text-sub)] hover:text-[var(--text)] transition-colors">Features</a>
                <Link href="/demo/dashboard" className="block text-sm text-[var(--text-sub)] hover:text-[var(--text)] transition-colors">Demo</Link>
                <a href="#" className="block text-sm text-[var(--text-sub)] hover:text-[var(--text)] transition-colors">Pricing</a>
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-3">Company</p>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-[var(--text-sub)] hover:text-[var(--text)] transition-colors">About</a>
                <a href="#" className="block text-sm text-[var(--text-sub)] hover:text-[var(--text)] transition-colors">Blog</a>
                <a href="#" className="block text-sm text-[var(--text-sub)] hover:text-[var(--text)] transition-colors">Careers</a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-dim)] mb-3">Legal</p>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-sm text-[var(--text-sub)] hover:text-[var(--text)] transition-colors">Privacy</Link>
                <Link href="/terms" className="block text-sm text-[var(--text-sub)] hover:text-[var(--text)] transition-colors">Terms</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-6">
            <p className="text-xs text-[var(--text-dim)] text-center">
              &copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
