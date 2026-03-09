'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [cooldown, setCooldown] = useState(0);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cooldown > 0) {
      const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      setError('No email address available. Please sign up again.');
      return;
    }
    setError('');
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({ type: 'signup', email });
    if (resendError) {
      setError(resendError.message);
    } else {
      setCooldown(60);
      setSent(true);
    }
  };

  return (
    <Card padding="lg" className="text-center animate-rise">
      <span className="text-5xl">📬</span>
      <h2 className="font-serif text-xl mt-4 mb-2">Check Your Inbox</h2>
      <p className="text-sm text-ink-sub mb-6">
        We sent a confirmation link to{' '}
        {email ? <strong>{email}</strong> : 'your email'}. Click it to activate your account.
      </p>
      {error && <p className="text-sm text-danger mb-3">{error}</p>}
      <Button variant="secondary" onClick={handleResend} disabled={cooldown > 0 || !email} className="w-full">
        {cooldown > 0 ? `Resend in ${cooldown}s` : sent ? 'Resent!' : 'Resend Email'}
      </Button>
      <Link href="/login" className="block mt-4 text-sm text-brand hover:underline">
        Back to login
      </Link>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <Card padding="lg" className="text-center">
        <Spinner size="lg" />
      </Card>
    }>
      <VerifyContent />
    </Suspense>
  );
}
