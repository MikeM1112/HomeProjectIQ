'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  compact?: boolean;
}

const OPTIONS = [
  { value: 'light', icon: '☀️', label: 'Light' },
  { value: 'dark', icon: '🌙', label: 'Dark' },
  { value: 'system', icon: '💻', label: 'System' },
] as const;

export function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return compact ? <div className="w-11 h-11" /> : <div className="h-10" />;
  }

  if (compact) {
    return (
      <button
        onClick={() => {
          const order = ['light', 'dark', 'system'] as const;
          const idx = order.indexOf(theme as typeof order[number]);
          setTheme(order[(idx + 1) % order.length]);
        }}
        className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-[var(--muted)] transition-colors text-base"
        aria-label={`Theme: ${theme}`}
      >
        {theme === 'dark' ? '🌙' : theme === 'light' ? '☀️' : '💻'}
      </button>
    );
  }

  return (
    <div className="flex items-center glass rounded-full p-1 gap-0.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setTheme(opt.value)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all',
            theme === opt.value
              ? 'gradient-accent text-white shadow-sm'
              : 'text-[var(--ink-sub)] hover:text-[var(--ink)]'
          )}
        >
          <span className="text-sm">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}
