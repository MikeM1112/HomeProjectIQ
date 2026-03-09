'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-surface-base flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <span className="text-5xl">⚠️</span>
        <h1 className="font-serif text-2xl mt-4 mb-2 text-ink">Something went wrong</h1>
        <p className="text-sm text-ink-sub mb-6">An unexpected error occurred. Please try again.</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Link href="/dashboard">
            <Button variant="secondary">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
