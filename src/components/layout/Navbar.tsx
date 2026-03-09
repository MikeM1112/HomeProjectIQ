'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { useUser } from '@/hooks/useUser';
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

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 glass border-b border-[var(--glass-border)]">
      <div className="w-10">
        {(showBack || onBack) && (
          <button
            onClick={() => onBack ? onBack() : (backHref ? router.push(backHref) : router.back())}
            className="text-[var(--ink)] hover:text-[var(--accent)] text-xl"
            aria-label="Go back"
          >
            &larr;
          </button>
        )}
      </div>
      <h1 className="font-serif text-lg font-semibold text-[var(--ink)] truncate">{title}</h1>
      <div className="flex items-center gap-2">
        <ThemeToggle compact />
        <Link href="/settings/account">
          <Avatar src={user?.avatar_url} name={user?.display_name ?? ''} size="sm" />
        </Link>
      </div>
    </header>
  );
}
