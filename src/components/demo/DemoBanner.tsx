'use client';

import { useState } from 'react';
import Link from 'next/link';

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="relative z-50 flex items-center justify-center gap-3 px-4 py-2.5"
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
      }}
    >
      <div className="flex items-center gap-2 flex-1 justify-center">
        <span className="text-sm">👀</span>
        <span className="text-xs font-medium text-[var(--text-sub)]">
          You&apos;re viewing a demo
        </span>
        <Link
          href="/signup"
          className="ml-2 text-xs font-bold px-3 py-1 rounded-full text-white"
          style={{ background: 'var(--accent-gradient)', backgroundImage: 'var(--accent-gradient)' }}
        >
          Sign Up Free
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-[var(--text-dim)] hover:text-[var(--text)] text-sm transition-colors shrink-0"
        aria-label="Dismiss demo banner"
      >
        &times;
      </button>
    </div>
  );
}
