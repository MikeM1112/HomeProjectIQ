'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ScanLine,
  ClipboardList,
  Wrench,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Clock,
  FileText,
  Lightbulb,
  Users,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '@/hooks/useDemo';
import type { LucideIcon } from 'lucide-react';

interface SidebarLink {
  href: string;
  icon: LucideIcon;
  label: string;
  section?: string;
}

const SIDEBAR_LINKS: SidebarLink[] = [
  { href: '/dashboard', icon: Home, label: 'Overview', section: 'main' },
  { href: '/diagnose', icon: ScanLine, label: 'Diagnose', section: 'main' },
  { href: '/logbook', icon: ClipboardList, label: 'Projects', section: 'main' },
  { href: '/toolbox', icon: Wrench, label: 'Toolbox', section: 'main' },
  { href: '/property', icon: Building2, label: 'Systems', section: 'manage' },
  { href: '/timeline', icon: Clock, label: 'Timeline', section: 'manage' },
  { href: '/maintenance', icon: FileText, label: 'Documents', section: 'manage' },
  { href: '/intelligence', icon: Lightbulb, label: 'Insights', section: 'manage' },
  { href: '/social', icon: Users, label: 'Network', section: 'manage' },
  { href: '/settings/account', icon: Settings, label: 'Settings', section: 'settings' },
];

const SECTION_LABELS: Record<string, string> = {
  main: 'Main',
  manage: 'Manage',
  settings: 'Account',
};

export function DesktopSidebar() {
  const pathname = usePathname();
  const { isDemo } = useDemo();
  const prefix = isDemo ? '/demo' : '';
  const [collapsed, setCollapsed] = useState(false);

  const sections = ['main', 'manage', 'settings'];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-50 border-r"
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderColor: 'var(--glass-border)',
      }}
    >
      {/* Brand logo area */}
      <div className="flex items-center gap-3 px-4 h-16 border-b" style={{ borderColor: 'var(--border)' }}>
        <Image
          src="/brand/app-icon.png"
          alt="HomeProjectIQ"
          width={36}
          height={36}
          className="rounded-xl flex-shrink-0"
        />
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm font-bold whitespace-nowrap overflow-hidden"
              style={{
                fontFamily: "var(--font-instrument-serif, 'Instrument Serif', serif)",
                color: 'var(--text)',
              }}
            >
              HomeProjectIQ
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-hide" aria-label="Desktop navigation">
        {sections.map((section) => {
          const links = SIDEBAR_LINKS.filter((l) => l.section === section);
          if (links.length === 0) return null;

          return (
            <div key={section} className="mb-4">
              {/* Section label */}
              <AnimatePresence>
                {!collapsed && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[10px] uppercase tracking-wider font-semibold px-3 mb-1.5"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    {SECTION_LABELS[section]}
                  </motion.p>
                )}
              </AnimatePresence>

              {links.map((link) => {
                const href = `${prefix}${link.href}`;
                const isActive =
                  pathname === href || pathname.startsWith(href + '/');
                const Icon = link.icon;

                return (
                  <Link
                    key={link.label}
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-3 py-2.5 mb-0.5 transition-all duration-200 relative group',
                      collapsed && 'justify-center px-0',
                      isActive
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--text-sub)] hover:text-[var(--text)] hover:bg-[var(--accent-soft)]'
                    )}
                    style={
                      isActive
                        ? {
                            background: 'var(--accent-soft)',
                            boxShadow: '0 0 20px var(--accent-glow)',
                          }
                        : undefined
                    }
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                        style={{ background: 'var(--accent-gradient)' }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}

                    <Icon
                      className={cn(
                        'w-5 h-5 flex-shrink-0',
                        isActive
                          ? 'text-[var(--accent)]'
                          : 'text-[var(--text-dim)] group-hover:text-[var(--text-sub)]'
                      )}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            'text-sm whitespace-nowrap overflow-hidden',
                            isActive ? 'font-semibold' : 'font-medium'
                          )}
                        >
                          {link.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Tooltip for collapsed mode */}
                    {collapsed && (
                      <div
                        className="absolute left-full ml-2 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50"
                        style={{
                          background: 'var(--surface-2)',
                          color: 'var(--text)',
                          border: '1px solid var(--glass-border)',
                          boxShadow: 'var(--card-shadow)',
                        }}
                      >
                        {link.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t transition-colors hover:bg-[var(--accent-soft)]"
        style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </motion.aside>
  );
}
