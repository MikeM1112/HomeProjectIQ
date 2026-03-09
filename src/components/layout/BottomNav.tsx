'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/dashboard', icon: '🏠', label: 'Projects' },
  { href: '/toolbox', icon: '🔧', label: 'Toolbox' },
  { href: '/logbook', icon: '📋', label: 'Logbook' },
  { href: '/settings/account', icon: '👤', label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-[var(--glass-border)] pb-safe-bottom">
      <div className="max-w-[480px] mx-auto flex items-center justify-around h-16">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 tap relative',
                isActive ? 'text-[var(--accent)]' : 'text-[var(--ink-dim)]'
              )}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-normal')}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-1 rounded-full gradient-accent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
