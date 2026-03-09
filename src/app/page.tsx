import Link from 'next/link';
import { CATEGORIES } from '@/lib/project-data';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface-base">
      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏠</span>
          <span className="font-serif text-lg text-ink">HomeProjectIQ</span>
        </div>
        <Link href="/login" className="text-sm font-semibold text-brand hover:text-brand-medium transition-colors">
          Log In
        </Link>
      </header>

      {/* Hero */}
      <section className="relative dot-grid px-4 pt-12 pb-20 text-center">
        <div className="max-w-lg mx-auto">
          <span className="text-5xl">🏠</span>
          <h1 className="font-serif text-4xl sm:text-5xl mt-4 mb-4 text-ink leading-tight">
            Know before you build.<br />Know before you hire.
          </h1>
          <p className="text-ink-sub text-lg mb-8 max-w-md mx-auto">
            HomeProjectIQ tells you in 60 seconds whether to DIY or hire a pro — with exact steps, tools, and parts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signup"
              className="btn bg-brand text-white px-8 py-3 rounded-lg text-base font-semibold tap"
            >
              Try a Project Free
            </Link>
            <a
              href="#how-it-works"
              className="btn bg-white text-ink border border-border px-8 py-3 rounded-lg text-base font-semibold tap"
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
            <div key={prop.title} className="bg-white rounded-xl p-5 border border-border shadow-sm">
              <span className="text-3xl">{prop.icon}</span>
              <h3 className="font-serif text-lg mt-2 mb-1">{prop.title}</h3>
              <p className="text-sm text-ink-sub">{prop.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category Preview */}
      <section className="px-4 py-16 bg-white border-y border-border">
        <div className="max-w-lg mx-auto">
          <h2 className="font-serif text-2xl text-center mb-6">12 Repair Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <div key={cat.id} className="text-center p-3 rounded-lg bg-surface-base">
                <span className="text-2xl">{cat.icon}</span>
                <p className="text-xs font-medium mt-1">{cat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-ink-sub mt-4">...and 6 more categories</p>
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
              <p className="font-serif text-2xl text-brand">{item.stat}</p>
              <p className="text-xs text-ink-sub">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-16 text-center bg-brand-light">
        <div className="max-w-md mx-auto">
          <h2 className="font-serif text-2xl mb-2">Free forever for homeowners.</h2>
          <p className="text-ink-sub mb-6">No credit card required.</p>
          <Link
            href="/signup"
            className="btn bg-brand text-white px-8 py-3 rounded-lg text-base font-semibold tap inline-block"
          >
            Sign Up Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 text-center border-t border-border">
        <p className="text-xs text-ink-dim">
          &copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
