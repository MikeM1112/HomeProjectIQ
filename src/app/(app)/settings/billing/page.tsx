import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Card } from '@/components/ui/Card';

export default function BillingPage() {
  return (
    <>
      <Navbar title="Billing" showBack backHref="/settings/account" />
      <PageWrapper>
        <Card padding="lg" className="text-center">
          <span className="text-4xl">🎉</span>
          <h2 className="font-serif text-xl mt-4 mb-2">HomeProjectIQ is Free Forever</h2>
          <p className="text-sm text-ink-sub">
            No subscription required for homeowners. Enjoy unlimited access to all features.
          </p>
          <ul className="text-sm text-ink-sub text-left mt-4 space-y-1">
            <li>✓ Unlimited project diagnoses</li>
            <li>✓ Full step-by-step guides</li>
            <li>✓ Tool & material shopping lists</li>
            <li>✓ Logbook & toolbox tracking</li>
            <li>✓ XP & achievement system</li>
          </ul>
        </Card>
      </PageWrapper>
    </>
  );
}
