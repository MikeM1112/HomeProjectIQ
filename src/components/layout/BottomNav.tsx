'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Camera,
  ClipboardList,
  Wrench,
  Telescope,
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
  { href: '/diagnose', icon: Camera, label: 'Diagnose', center: true },
  { href: '/scope', icon: Telescope, label: 'Scope' },
  { href: '/toolbox', icon: Wrench, label: 'Tools' },
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

            /* ── Center circular "Diagnose" hero button ── */
            if (tab.center) {
              return (
                <Link
                  key={tab.label}
                  href={href}
                  className="flex flex-col items-center gap-0.5 -mt-7 tap relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-[60px] h-[60px] rounded-full flex items-center justify-center motion-safe:animate-[breathe_3s_ease-in-out_infinite]"
                    style={{
                      background: 'var(--glass)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      border: '1.5px solid rgba(6,156,168,0.35)',
                      boxShadow: isActive
                        ? '0 0 28px var(--accent-glow), 0 0 60px rgba(6,156,168,0.20), 0 0 0 3px var(--accent-soft)'
                        : '0 0 16px var(--accent-glow), 0 0 40px rgba(6,156,168,0.12)',
                    }}
                  >
                    <Icon
                      className="w-7 h-7"
                      strokeWidth={2}
                      style={{ color: 'var(--accent)' }}
                    />
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
