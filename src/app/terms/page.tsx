import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | HomeProjectIQ',
  description: 'HomeProjectIQ terms of service — rules and guidelines for using our platform.',
};

export default function TermsPage() {
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
        <h1 className="font-serif text-3xl" style={{ color: 'var(--text)' }}>Terms of Service</h1>
        <p className="text-sm" style={{ color: 'var(--text-sub)' }}>Last updated: March 10, 2026</p>

        <section className="space-y-3">
          <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            By accessing or using HomeProjectIQ, you agree to be bound by these Terms of Service.
            If you do not agree, do not use the service. We may update these terms from time to time,
            and continued use constitutes acceptance of any changes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>2. Description of Service</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            HomeProjectIQ provides AI-powered home project assessment, guidance, and maintenance
            tracking tools. Our AI assessments are informational only and should not be relied upon
            as a substitute for professional inspection, engineering advice, or contractor consultation.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>3. User Accounts</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            You are responsible for maintaining the confidentiality of your account credentials.
            You must provide accurate information when creating an account. You may not share your
            account or use another person&apos;s account without permission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>4. AI Assessment Disclaimer</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            HomeProjectIQ uses artificial intelligence to analyze photos and provide guidance.
            AI assessments are estimates and may not be accurate in all cases. Always consult
            a licensed professional for structural, electrical, plumbing, or safety-critical work.
            HomeProjectIQ is not liable for decisions made based on AI recommendations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>5. User Content</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            You retain ownership of photos and content you upload. By uploading content, you grant
            HomeProjectIQ a limited license to process it for the purpose of providing the service.
            Photos are processed by our AI provider and are not retained after analysis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>6. Prohibited Uses</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            You may not use HomeProjectIQ to: violate any laws or regulations; upload harmful,
            offensive, or illegal content; attempt to reverse-engineer or exploit the service;
            use automated tools to scrape or access the service; or interfere with other users&apos;
            use of the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>7. Limitation of Liability</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            HomeProjectIQ is provided &ldquo;as is&rdquo; without warranties of any kind. We are not
            liable for any damages arising from your use of the service, including but not limited
            to property damage, personal injury, or financial loss resulting from reliance on
            AI assessments or recommendations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>8. Termination</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            We may suspend or terminate your account at any time for violation of these terms.
            You may delete your account at any time from the Account Settings page, which will
            permanently remove your data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl" style={{ color: 'var(--text)' }}>9. Contact</h2>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
            For questions about these terms, contact us at legal@homeprojectiq.com.
          </p>
        </section>
      </div>

      <footer className="px-4 py-6 text-center border-t" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
          &copy; {new Date().getFullYear()} HomeProjectIQ. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
