'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  ScanLine,
  ClipboardList,
  Wrench,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '@/hooks/useDemo';
import type { LucideIcon } from 'lucide-react';

interface NavTab {
  href: string;
  icon: LucideIcon;
  label: string;
  center?: boolean;
}

const TABS: NavTab[] = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/logbook', icon: ClipboardList, label: 'Projects' },
  { href: '/diagnose', icon: ScanLine, label: 'Diagnose', center: true },
  { href: '/toolbox', icon: Wrench, label: 'Tools' },
  { href: '/settings/account', icon: MoreHorizontal, label: 'More' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isDemo } = useDemo();
  const prefix = isDemo ? '/demo' : '';

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
    >
      {/* Frosted glass bar */}
      <div
        className="rounded-t-3xl border-t pb-safe-bottom"
        style={{
          background: 'var(--bottom-nav-bg)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          borderColor: 'var(--glass-border)',
          boxShadow:
            '0 -8px 32px rgba(0,0,0,0.12), 0 -2px 8px rgba(6,156,168,0.06)',
        }}
      >
        <div className="max-w-[520px] mx-auto flex items-end justify-around h-16 px-2">
          {TABS.map((tab) => {
            const href = `${prefix}${tab.href}`;
            const isActive =
              pathname === href || pathname.startsWith(href + '/');
            const Icon = tab.icon;

            /* ── Center elevated "Diagnose" button ── */
            if (tab.center) {
              return (
                <Link
                  key={tab.label}
                  href={href}
                  className="flex flex-col items-center gap-0.5 -mt-5 tap relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                    style={{
                      background: 'var(--accent-gradient)',
                      boxShadow: isActive
                        ? '0 6px 28px var(--accent-glow), 0 0 0 3px var(--accent-soft)'
                        : '0 4px 20px var(--accent-glow)',
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
                  </motion.div>
                  <span
                    className="text-[10px] font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    {tab.label}
                  </span>
                </Link>
              );
            }

            /* ── Standard tab ── */
            return (
              <Link
                key={tab.label}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 tap relative transition-colors min-w-[52px]',
                  isActive
                    ? 'text-[var(--accent)]'
                    : 'text-[var(--text-dim)]'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive
                      ? 'text-[var(--accent)]'
                      : 'text-[var(--text-dim)]'
                  )}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span
                  className={cn(
                    'text-[10px]',
                    isActive ? 'font-semibold' : 'font-normal'
                  )}
                >
                  {tab.label}
                </span>

                {/* Animated active indicator */}
                {isActive && (
                  <motion.span
                    layoutId="bottomnav-indicator"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-5 h-[2.5px] rounded-full"
                    style={{ background: 'var(--accent-gradient)' }}
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
