'use client';

import { useState, useTransition, useRef, useEffect } from 'react';
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@/lib/global';
import { cn } from '@/lib/utils';

interface CurrencySelectorProps {
  value: CurrencyCode;
  onChange: (currency: CurrencyCode) => void;
}

export function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, startTransition] = useTransition();
  const selected = SUPPORTED_CURRENCIES.find((c) => c.code === value);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between px-3 py-2 rounded-lg border',
          'text-sm text-[var(--ink)]',
          'bg-[var(--surface)] border-[var(--border)]',
          'hover:border-[var(--border-focus)] transition-colors'
        )}
      >
        <span>
          {selected?.symbol} {selected?.code} — {selected?.name}
        </span>
        <svg
          className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-lg border',
            'bg-[var(--surface)] border-[var(--border)] shadow-lg'
          )}
        >
          {SUPPORTED_CURRENCIES.map((currency) => (
            <button
              key={currency.code}
              type="button"
              onClick={() => {
                startTransition(() => {
                  onChange(currency.code as CurrencyCode);
                  setIsOpen(false);
                });
              }}
              className={cn(
                'w-full text-left px-3 py-2 text-sm hover:bg-[var(--muted)] transition-colors',
                currency.code === value && 'bg-[var(--accent-lt)] text-[var(--accent)] font-medium'
              )}
            >
              {currency.symbol} {currency.code} — {currency.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
