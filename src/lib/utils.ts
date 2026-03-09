import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a currency amount. All values in the app are stored in cents.
 * @param cents - Amount in cents (e.g., 15000 = $150.00)
 */
export function formatCurrency(
  cents: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  const dollars = Math.abs(cents) / 100;
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: dollars % 1 === 0 ? 0 : 2,
  }).format(dollars);
  return cents < 0 ? `-${formatted}` : formatted;
}

export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getLevel(xp: number): number {
  if (xp >= 1000) return 5;
  if (xp >= 600) return 4;
  if (xp >= 300) return 3;
  if (xp >= 100) return 2;
  return 1;
}

export function getXpForNextLevel(xp: number): {
  current: number;
  needed: number;
  progress: number;
} {
  const thresholds = [
    { min: 0, max: 99 },
    { min: 100, max: 299 },
    { min: 300, max: 599 },
    { min: 600, max: 999 },
    { min: 1000, max: Infinity },
  ];

  const level = getLevel(xp);
  const tier = thresholds[level - 1];

  if (level === 5) {
    return { current: xp - tier.min, needed: 1, progress: 100 };
  }

  const current = xp - tier.min;
  const needed = tier.max - tier.min + 1;
  const progress = Math.min(100, Math.round((current / needed) * 100));

  return { current, needed, progress };
}

export function getVerdictLabel(verdict: string): string {
  switch (verdict) {
    case 'diy_easy':
      return 'DIY Easy';
    case 'diy_caution':
      return 'DIY with Caution';
    case 'hire_pro':
      return 'Lean toward Pro';
    default:
      return verdict;
  }
}

export function getVerdictColor(verdict: string): string {
  switch (verdict) {
    case 'diy_easy':
      return '#2D8A4E';
    case 'diy_caution':
      return '#F9A825';
    case 'hire_pro':
      return '#D32F2F';
    default:
      return '#6B6B6B';
  }
}

export function getConfidenceLabel(confidence: number): {
  label: string;
  color: string;
  bg: string;
  heading: string;
  body: string;
} {
  if (confidence >= 85) {
    return {
      label: 'DIY Easy',
      color: '#2D8A4E',
      bg: '#E8F5E9',
      heading: 'You Got This!',
      body: 'This is well within your skill range.',
    };
  }
  if (confidence >= 70) {
    return {
      label: 'DIY with Caution',
      color: '#F9A825',
      bg: '#FFF8E1',
      heading: 'Proceed Carefully',
      body: 'Doable, but pay attention to the details.',
    };
  }
  return {
    label: 'Lean toward Pro',
    color: '#D32F2F',
    bg: '#FFEBEE',
    heading: 'Consider Hiring Help',
    body: 'This one has some complexity that might warrant a professional.',
  };
}
