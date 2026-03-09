'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim());

    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <Card padding="lg" className="text-center animate-rise">
        <span className="text-5xl">📬</span>
        <h2 className="font-serif text-xl mt-4 mb-2">Check Your Email</h2>
        <p className="text-sm text-ink-sub mb-6">
          If an account exists for <strong>{email}</strong>, we sent a password reset link.
        </p>
        <Link href="/login" className="text-sm text-brand hover:underline">
          Back to login
        </Link>
      </Card>
    );
  }

  return (
    <Card padding="lg" className="animate-rise">
      <h2 className="font-serif text-xl text-center mb-6">Reset Password</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {error && <p className="text-sm text-danger text-center">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Send Reset Link
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-brand hover:underline">
          Back to login
        </Link>
      </div>
    </Card>
  );
}
