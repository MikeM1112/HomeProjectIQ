'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { useUser } from '@/hooks/useUser';
import { useDemo } from '@/hooks/useDemo';
import { ThemeToggle } from '@/components/settings/ThemeToggle';

interface NavbarProps {
  title: string;
  showBack?: boolean;
  backHref?: string;
  onBack?: () => void;
}

export function Navbar({ title, showBack = false, backHref, onBack }: NavbarProps) {
  const router = useRouter();
  const { user } = useUser();
  const { isDemo } = useDemo();
  const prefix = isDemo ? '/demo' : '';

  const handleBack = () => {
    if (onBack) return onBack();
    if (backHref) return router.push(isDemo ? `/demo${backHref}` : backHref);
    router.back();
  };

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 border-b"
      style={{
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="w-10">
        {(showBack || onBack) && (
          <button
            onClick={handleBack}
            className="text-[var(--text)] hover:text-[var(--accent)] text-xl transition-colors"
            aria-label="Go back"
          >
            &larr;
          </button>
        )}
      </div>
      <h1
        className="text-[20px] font-semibold truncate"
        style={{ fontFamily: "var(--font-instrument-serif, 'Instrument Serif', serif)", color: 'var(--text)' }}
      >
        {title}
      </h1>
      <div className="flex items-center gap-2">
        <ThemeToggle compact />
        <Link href={`${prefix}/settings/account`}>
          <Avatar src={user?.avatar_url} name={user?.display_name ?? ''} size="sm" />
        </Link>
      </div>
    </header>
  );
}
