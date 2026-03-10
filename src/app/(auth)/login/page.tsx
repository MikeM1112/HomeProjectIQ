'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <Card padding="lg" className="animate-rise">
      <h2 className="font-serif text-xl text-center mb-6">Log In</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="you@example.com" />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} placeholder="••••••••" />
        {error && <p className="text-sm text-danger text-center">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Log In
        </Button>
      </form>
      <div className="mt-4 text-center space-y-2">
        <Link href="/signup" className="text-sm text-brand hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
        <br />
        <Link href="/forgot-password" className="text-xs text-ink-dim hover:underline">
          Forgot password?
        </Link>
        <br />
        <Link
          href="/demo/dashboard"
          className="text-sm font-semibold hover:brightness-110 transition-all inline-block mt-2"
          style={{ color: 'var(--accent)' }}
        >
          Or try the demo &rarr;
        </Link>
      </div>
    </Card>
  );
}
