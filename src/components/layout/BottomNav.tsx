'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useDemo } from '@/hooks/useDemo';

const LEFT_TABS = [
  { href: '/dashboard', icon: '🏠', label: 'Home' },
  { href: '/maintenance', icon: '🔧', label: 'Maintain' },
];

const RIGHT_TABS = [
  { href: '/logbook', icon: '📋', label: 'Logbook' },
  { href: '/toolbox', icon: '🧰', label: 'Toolbox' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isDemo } = useDemo();
  const prefix = isDemo ? '/demo' : '';

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 border-t pb-safe-bottom"
      style={{
        background: 'var(--bottom-nav-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'var(--border)',
        boxShadow: '0 -4px 24px rgba(249,115,22,0.06)',
      }}
    >
      <div className="max-w-[480px] mx-auto flex items-center justify-around h-16">
        {LEFT_TABS.map((tab) => {
          const href = `${prefix}${tab.href}`;
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={tab.label}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 tap relative transition-colors',
                isActive ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'
              )}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-normal')}>
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full"
                  style={{ background: 'var(--accent-gradient)' }}
                />
              )}
            </Link>
          );
        })}

        {/* Center Scan/Assess Button */}
        <Link
          href={`${prefix}/dashboard`}
          onClick={() => {
            // Dispatch custom event to trigger photo assessment (dashboard listens)
            window.dispatchEvent(new CustomEvent('homeiq:start-assessment'));
          }}
          className="flex flex-col items-center gap-0.5 -mt-5 tap"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden"
            style={{
              boxShadow: '0 4px 20px var(--accent-glow)',
            }}
          >
            <Image
              src="/brand/app-icon.png"
              alt="Scan"
              width={56}
              height={56}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="text-[10px] font-semibold" style={{ color: 'var(--accent)' }}>
            Scan
          </span>
        </Link>

        {RIGHT_TABS.map((tab) => {
          const href = `${prefix}${tab.href}`;
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={tab.label}
              href={href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center gap-0.5 px-2 py-1 tap relative transition-colors',
                isActive ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'
              )}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className={cn('text-[10px]', isActive ? 'font-semibold' : 'font-normal')}>
                {tab.label}
              </span>
              {isActive && (
                <span
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-[2px] rounded-full"
                  style={{ background: 'var(--accent-gradient)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
