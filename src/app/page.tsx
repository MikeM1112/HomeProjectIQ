import Link from 'next/link';
import { CATEGORIES } from '@/lib/project-data';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] relative overflow-hidden">
      {/* Background gradient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]" style={{ background: 'var(--accent)' }} />
      </div>

      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="font-serif text-lg text-[var(--ink)]">HomeProjectIQ</span>
        </div>
        <Link href="/login" className="text-sm font-semibold text-[var(--accent)] hover:brightness-110 transition-all">
          Log In
        </Link>
      </header>

      {/* Hero */}
      <section className="relative px-4 pt-12 pb-20 text-center">
        <div className="max-w-lg mx-auto">
          <span className="text-5xl animate-float inline-block">🏠</span>
          <h1 className="font-serif text-4xl sm:text-5xl mt-4 mb-4 leading-tight">
            <span className="gradient-text">Know before you build.</span>
            <br />
            <span className="gradient-text">Know before you hire.</span>
          </h1>
          <p className="text-[var(--ink-sub)] text-lg mb-8 max-w-md mx-auto">
            HomeProjectIQ tells you in 60 seconds whether to DIY or hire a pro — with exact steps, tools, and parts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="btn gradient-accent text-white px-8 py-3 rounded-full text-base font-semibold tap shadow-lg hover:shadow-xl transition-shadow"
            >
              Try a Project Free
            </Link>
            <a
              href="#how-it-works"
              className="btn glass px-8 py-3 rounded-full text-base font-semibold tap text-[var(--ink)]"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section id="how-it-works" className="px-4 py-16 max-w-lg mx-auto">
        <div className="grid gap-4">
          {[
            { icon: '⚡', title: 'Instant DIY Verdict', desc: 'Answer 3-5 questions and get a confidence score in seconds.' },
            { icon: '📋', title: 'Step-by-Step Plans', desc: 'Detailed instructions with timing, tips, and safety notes.' },
            { icon: '🛒', title: 'Exact Materials & Costs', desc: 'Real product SKUs from Home Depot & Lowe\'s with current pricing.' },
          ].map((prop) => (
            <div key={prop.title} className="glass glass-hover rounded-2xl p-5">
              <span className="text-3xl">{prop.icon}</span>
              <h3 className="font-serif text-lg mt-2 mb-1 text-[var(--ink)]">{prop.title}</h3>
              <p className="text-sm text-[var(--ink-sub)]">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Preview */}
      <section className="px-4 py-16 glass border-y border-[var(--glass-border)]">
        <div className="max-w-lg mx-auto">
          <h2 className="font-serif text-2xl text-center mb-6 text-[var(--ink)]">12 Repair Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <div key={cat.id} className="text-center p-3 rounded-xl bg-[var(--muted)]">
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-xs font-medium mt-1 text-[var(--ink)]">{cat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[var(--ink-sub)] mt-4">...and 6 more categories</p>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-12 max-w-lg mx-auto">
        <div className="flex flex-wrap justify-center gap-6 text-center">
          {[
            { stat: '$680', label: 'Average savings per year' },
            { stat: '12', label: 'Repair categories' },
            { stat: '100%', label: 'Free for homeowners' },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-serif text-2xl gradient-text">{item.stat}</p>
              <p className="text-xs text-[var(--ink-sub)]">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-16 text-center" style={{ background: 'var(--accent-lt)' }}>
        <div className="max-w-md mx-auto">
          <h2 className="font-serif text-2xl mb-2 text-[var(--ink)]">Free forever for homeowners.</h2>
          <p className="text-[var(--ink-sub)] mb-6">No credit card required.</p>
          <Link
            href="/signup"
            className="btn gradient-accent text-white px-8 py-3 rounded-full text-base font-semibold tap inline-block shadow-lg"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 text-center border-t border-[var(--border)]">
        <p className="text-xs text-[var(--ink-dim)]">
          &copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
