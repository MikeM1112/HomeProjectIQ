import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | HomeProjectIQ',
  description: 'HomeProjectIQ privacy policy — how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--glass)' }}>
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="font-serif text-lg" style={{ color: 'var(--text)' }}>HomeProjectIQ</span>
          </Link>
          <Link href="/login" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
            Sign In
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-serif text-3xl" style={{ color: 'var(--text)' }}>Privacy Policy</h1>
        <p className="text-sm" style={{ color: 'var(--text-sub)' }}>Last updated: March 9, 2026</p>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--text)]">1. Information We Collect</h2>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">
            When you use HomeProjectIQ, we collect information you provide directly:
            your email address, display name, project assessments, logbook entries,
            toolbox inventory, and photos you upload for AI analysis.
          </p>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">
            We also collect usage data such as pages visited and features used to
            improve the service. We do not sell your personal data to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--text)]">2. How We Use Your Information</h2>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">
            We use your information to provide the HomeProjectIQ service, including
            generating AI-powered assessments, tracking your project history, and
            personalizing your experience. Photos uploaded for AI assessment are
            processed by our AI provider (Anthropic) and are not stored after
            analysis is complete.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--text)]">3. Data Storage & Security</h2>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">
            Your data is stored securely using Supabase (PostgreSQL) with
            row-level security policies. All data is encrypted in transit (TLS)
            and at rest. We implement industry-standard security measures
            to protect your information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--text)]">4. Your Rights</h2>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">
            You have the right to access, correct, or delete your personal data
            at any time. You can delete your account and all associated data
            from the Account Settings page. You may also request a copy of
            your data by contacting us.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--text)]">5. Third-Party Services</h2>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">
            We use the following third-party services to operate HomeProjectIQ:
          </p>
          <ul className="text-sm text-[var(--text-sub)] leading-relaxed list-disc pl-5 space-y-1">
            <li>Supabase — database, authentication, and file storage</li>
            <li>Anthropic (Claude) — AI-powered photo assessment analysis</li>
            <li>Vercel — hosting and deployment</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--text)]">6. Cookies</h2>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">
            We use essential cookies for authentication and session management.
            We do not use tracking or advertising cookies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl text-[var(--text)]">7. Contact</h2>
          <p className="text-sm text-[var(--text-sub)] leading-relaxed">
            If you have questions about this privacy policy or your data, please
            contact us at privacy@homeprojectiq.com.
          </p>
        </section>
      </div>

      <footer className="px-4 py-6 text-center border-t border-[var(--border)]">
        <p className="text-xs text-[var(--text-dim)]">
          &copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
