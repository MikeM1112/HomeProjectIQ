import Link from 'next/link';
import { CATEGORIES } from '@/lib/project-data';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]" style={{ background: 'var(--accent)' }} />
      </div>

      {/* Header */}
      <header className="px-5 py-4 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">🏠</span>
          <span className="font-serif text-lg text-[var(--text)]">HomeProjectIQ</span>
        </div>
        <Link href="/login" className="text-sm font-semibold text-[var(--accent)] hover:brightness-110 transition-all">
          Log In
        </Link>
      </header>

      {/* Hero */}
      <section className="relative px-5 pt-16 pb-24 text-center">
        {/* Radial glow behind hero */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle, var(--hero-glow-sm) 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div className="max-w-lg mx-auto">
          <span className="text-[56px] leading-none animate-float inline-block mb-6">🏠</span>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4 leading-[1.15]">
            <span className="gradient-text">Know before you build.</span>
          </h1>
          <p className="text-[var(--text-sub)] text-lg mb-10 max-w-sm mx-auto leading-relaxed">
            HomeProjectIQ tells you in 60 seconds whether to DIY or hire a pro — with exact steps, tools, and parts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="btn bg-[image:var(--accent-gradient)] text-white px-8 py-3.5 rounded-full text-base font-semibold tap shadow-[0_4px_20px_var(--accent-glow)] hover:shadow-[0_8px_32px_var(--accent-glow)] hover:-translate-y-0.5 transition-all duration-200"
            >
              Try a Project Free
            </Link>
            <a
              href="#how-it-works"
              className="btn bg-[var(--glass)] backdrop-blur-[12px] border border-[var(--glass-border)] px-8 py-3.5 rounded-full text-base font-semibold tap text-[var(--text)] hover:border-[var(--glass-border-hover)] transition-all duration-200"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section id="how-it-works" className="px-5 py-16 max-w-lg mx-auto">
        <div className="grid gap-4">
          {[
            {
              icon: '⚡',
              title: 'Instant DIY Verdict',
              desc: 'Answer 3-5 questions and get a confidence score in seconds.',
              iconBg: 'var(--accent-soft)',
              iconColor: 'var(--accent)',
            },
            {
              icon: '📋',
              title: 'Step-by-Step Plans',
              desc: 'Detailed instructions with timing, tips, and safety notes.',
              iconBg: 'var(--emerald-soft)',
              iconColor: 'var(--emerald)',
            },
            {
              icon: '🛒',
              title: 'Exact Materials & Costs',
              desc: 'Real product SKUs from Home Depot & Lowe\'s with current pricing.',
              iconBg: 'var(--gold-soft)',
              iconColor: 'var(--gold)',
            },
          ].map((prop) => (
            <div
              key={prop.title}
              className="rounded-2xl bg-[var(--glass)] backdrop-blur-[12px] border border-[var(--glass-border)] p-5 flex items-start gap-4 transition-all duration-300 hover:border-[var(--glass-border-hover)]"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: prop.iconBg }}
              >
                <span className="text-2xl">{prop.icon}</span>
              </div>
              <div>
                <h3 className="font-serif text-lg text-[var(--text)] mb-1">{prop.title}</h3>
                <p className="text-sm text-[var(--text-sub)] leading-relaxed">{prop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof Stats Bar */}
      <section className="px-5 py-10 max-w-lg mx-auto">
        <div className="border-t border-b border-[var(--border)] py-8">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { stat: '$680', label: 'Avg savings/year' },
              { stat: '12', label: 'Categories' },
              { stat: '100%', label: 'Free' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-[800] text-[var(--accent)]">{item.stat}</p>
                <p className="text-xs text-[var(--text-dim)] mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Preview */}
      <section className="px-5 py-16 max-w-lg mx-auto">
        <h2 className="font-serif text-2xl text-center mb-8 text-[var(--text)]">12 Repair Categories</h2>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div
              key={cat.id}
              className="text-center p-4 rounded-2xl bg-[var(--glass)] backdrop-blur-[12px] border border-[var(--glass-border)] transition-all duration-300 hover:border-[var(--glass-border-hover)]"
            >
              <span className="text-2xl">{cat.icon}</span>
              <p className="text-xs font-medium mt-1.5 text-[var(--text)]">{cat.label}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-[var(--text-sub)] mt-5">...and 6 more categories</p>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-20 text-center relative">
        <div
          className="absolute inset-0 pointer-events-none -z-10"
          style={{ background: 'radial-gradient(circle at 50% 50%, var(--hero-glow-sm) 0%, transparent 60%)' }}
          aria-hidden="true"
        />
        <div className="max-w-md mx-auto">
          <h2 className="font-serif text-2xl mb-2 text-[var(--text)]">Free forever for homeowners.</h2>
          <p className="text-[var(--text-sub)] mb-8">No credit card required.</p>
          <Link
            href="/signup"
            className="btn bg-[image:var(--accent-gradient)] text-white px-8 py-3.5 rounded-full text-base font-semibold tap inline-block shadow-[0_4px_20px_var(--accent-glow)] hover:shadow-[0_8px_32px_var(--accent-glow)] hover:-translate-y-0.5 transition-all duration-200"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 py-6 text-center border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-dim)]">
          &copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
