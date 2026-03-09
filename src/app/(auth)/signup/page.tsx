'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, type SignupInput } from '@/lib/validations/auth';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

function getStrength(pw: string): { score: number; label: string; color: string } {
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^a-zA-Z0-9]/.test(pw)) s++;
  if (s <= 1) return { score: 20, label: 'Weak', color: 'bg-danger' };
  if (s <= 3) return { score: 60, label: 'Fair', color: 'bg-warning' };
  return { score: 100, label: 'Strong', color: 'bg-success' };
}

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');
  const strength = useMemo(() => getStrength(password), [password]);

  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { display_name: data.display_name } },
    });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    }
  };

  return (
    <Card padding="lg" className="animate-rise">
      <h2 className="font-serif text-xl text-center mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Display Name" {...register('display_name')} error={errors.display_name?.message} placeholder="Your name" />
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="you@example.com" />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} placeholder="Min 8 characters" />
        {password.length > 0 && (
          <div className="space-y-1">
            <Progress value={strength.score} color={strength.color} animated={false} />
            <p className="text-xs text-ink-sub">{strength.label}</p>
          </div>
        )}
        {error && <p className="text-sm text-danger text-center">{error}</p>}
        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>
      </form>
      <div className="mt-4 text-center">
        <Link href="/login" className="text-sm text-brand hover:underline">
          Already have an account? Log in
        </Link>
      </div>
    </Card>
  );
}
