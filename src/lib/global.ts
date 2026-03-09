// Global infrastructure: currency, units, and regional support

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'KRW', symbol: '₩', name: 'Korean Won', locale: 'ko-KR' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso', locale: 'es-MX' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', locale: 'pl-PL' },
  { code: 'COP', symbol: 'COL$', name: 'Colombian Peso', locale: 'es-CO' },
  { code: 'CLP', symbol: 'CL$', name: 'Chilean Peso', locale: 'es-CL' },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', locale: 'es-PE' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]['code'];

export type UnitSystem = 'metric' | 'imperial';

// Approximate exchange rates relative to USD (updated periodically)
// In production, these would come from an API
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  JPY: 149.5,
  CNY: 7.24,
  KRW: 1320,
  BRL: 4.97,
  MXN: 17.15,
  INR: 83.1,
  SEK: 10.42,
  NOK: 10.55,
  DKK: 6.88,
  CHF: 0.88,
  NZD: 1.63,
  SGD: 1.34,
  ZAR: 18.6,
  AED: 3.67,
  PLN: 3.98,
  COP: 3950,
  CLP: 880,
  PEN: 3.72,
  PHP: 55.8,
  THB: 35.2,
  IDR: 15650,
};

/**
 * Format currency with locale awareness
 */
export function formatLocalCurrency(
  amountUSD: number,
  currency: CurrencyCode = 'USD',
  locale?: string
): string {
  const rate = EXCHANGE_RATES[currency] ?? 1;
  const converted = amountUSD * rate;

  const currencyInfo = SUPPORTED_CURRENCIES.find((c) => c.code === currency);
  const displayLocale = locale ?? currencyInfo?.locale ?? 'en-US';

  return new Intl.NumberFormat(displayLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === 'JPY' || currency === 'KRW' ? 0 : 0,
  }).format(converted);
}

/**
 * Format a cost range in local currency
 */
export function formatCostRange(
  loUSD: number,
  hiUSD: number,
  currency: CurrencyCode = 'USD',
  locale?: string
): string {
  const lo = formatLocalCurrency(loUSD, currency, locale);
  const hi = formatLocalCurrency(hiUSD, currency, locale);
  return `${lo} – ${hi}`;
}

/**
 * Convert USD to local currency (raw number)
 */
export function convertCurrency(amountUSD: number, currency: CurrencyCode): number {
  const rate = EXCHANGE_RATES[currency] ?? 1;
  return Math.round(amountUSD * rate);
}

/**
 * Format distance/length with unit system awareness
 */
export function formatLength(meters: number, units: UnitSystem = 'imperial'): string {
  if (units === 'metric') {
    if (meters < 1) {
      return `${Math.round(meters * 100)} cm`;
    }
    return `${meters.toFixed(1)} m`;
  }
  const feet = meters * 3.28084;
  if (feet < 1) {
    return `${Math.round(feet * 12)} in`;
  }
  return `${feet.toFixed(1)} ft`;
}

/**
 * Format weight with unit system awareness
 */
export function formatWeight(kg: number, units: UnitSystem = 'imperial'): string {
  if (units === 'metric') {
    if (kg < 1) {
      return `${Math.round(kg * 1000)} g`;
    }
    return `${kg.toFixed(1)} kg`;
  }
  const lbs = kg * 2.20462;
  if (lbs < 1) {
    return `${Math.round(lbs * 16)} oz`;
  }
  return `${lbs.toFixed(1)} lbs`;
}

/**
 * Format temperature with unit system awareness
 */
export function formatTemperature(celsius: number, units: UnitSystem = 'imperial'): string {
  if (units === 'metric') {
    return `${Math.round(celsius)}°C`;
  }
  const fahrenheit = (celsius * 9) / 5 + 32;
  return `${Math.round(fahrenheit)}°F`;
}

/**
 * Format area with unit system awareness
 */
export function formatArea(sqMeters: number, units: UnitSystem = 'imperial'): string {
  if (units === 'metric') {
    return `${sqMeters.toFixed(1)} m²`;
  }
  const sqFeet = sqMeters * 10.7639;
  return `${Math.round(sqFeet)} sq ft`;
}

/**
 * Format volume with unit system awareness
 */
export function formatVolume(liters: number, units: UnitSystem = 'imperial'): string {
  if (units === 'metric') {
    if (liters < 1) {
      return `${Math.round(liters * 1000)} mL`;
    }
    return `${liters.toFixed(1)} L`;
  }
  const gallons = liters * 0.264172;
  if (gallons < 0.25) {
    const oz = liters * 33.814;
    return `${Math.round(oz)} fl oz`;
  }
  return `${gallons.toFixed(1)} gal`;
}

/**
 * Get the best locale for date formatting based on user settings
 */
export function getDateLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    pt: 'pt-BR',
    ja: 'ja-JP',
    zh: 'zh-CN',
    ko: 'ko-KR',
    it: 'it-IT',
    nl: 'nl-NL',
  };
  return localeMap[locale] ?? 'en-US';
}

/**
 * Format date with locale awareness
 */
export function formatLocalDate(
  date: string | Date,
  locale: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateLocale = getDateLocale(locale);
  return d.toLocaleDateString(
    dateLocale,
    options ?? {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date, locale: string = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  const dateLocale = getDateLocale(locale);
  const rtf = new Intl.RelativeTimeFormat(dateLocale, { numeric: 'auto' });

  if (diffDays > 30) {
    return formatLocalDate(d, locale);
  }
  if (diffDays > 0) {
    return rtf.format(-diffDays, 'day');
  }
  if (diffHours > 0) {
    return rtf.format(-diffHours, 'hour');
  }
  if (diffMins > 0) {
    return rtf.format(-diffMins, 'minute');
  }
  return rtf.format(-diffSecs, 'second');
}

/**
 * Detect user's likely currency from their locale/timezone
 */
export function detectCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'USD';

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const lang = navigator.language;

  // Timezone-based detection
  if (tz.startsWith('Europe/London') || tz.startsWith('Europe/Belfast')) return 'GBP';
  if (tz.startsWith('Europe/') && !tz.startsWith('Europe/London')) {
    // Most of Europe uses EUR, with exceptions
    if (tz.includes('Zurich') || tz.includes('Bern')) return 'CHF';
    if (tz.includes('Warsaw')) return 'PLN';
    if (tz.includes('Stockholm')) return 'SEK';
    if (tz.includes('Oslo')) return 'NOK';
    if (tz.includes('Copenhagen')) return 'DKK';
    return 'EUR';
  }
  if (tz.startsWith('Asia/Tokyo')) return 'JPY';
  if (tz.startsWith('Asia/Shanghai') || tz.startsWith('Asia/Hong_Kong')) return 'CNY';
  if (tz.startsWith('Asia/Seoul')) return 'KRW';
  if (tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta')) return 'INR';
  if (tz.startsWith('Asia/Singapore')) return 'SGD';
  if (tz.startsWith('Asia/Bangkok')) return 'THB';
  if (tz.startsWith('Asia/Jakarta')) return 'IDR';
  if (tz.startsWith('Asia/Manila')) return 'PHP';
  if (tz.startsWith('Asia/Dubai')) return 'AED';
  if (tz.startsWith('Australia/')) return 'AUD';
  if (tz.startsWith('Pacific/Auckland')) return 'NZD';
  if (tz.startsWith('Africa/Johannesburg')) return 'ZAR';
  if (tz.startsWith('America/Sao_Paulo') || tz.startsWith('America/Fortaleza')) return 'BRL';
  if (tz.startsWith('America/Mexico_City') || tz.startsWith('America/Cancun')) return 'MXN';
  if (tz.startsWith('America/Bogota')) return 'COP';
  if (tz.startsWith('America/Santiago')) return 'CLP';
  if (tz.startsWith('America/Lima')) return 'PEN';
  if (tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver')) return 'CAD';

  // Language-based fallback
  if (lang.startsWith('ja')) return 'JPY';
  if (lang.startsWith('zh')) return 'CNY';
  if (lang.startsWith('ko')) return 'KRW';
  if (lang.startsWith('pt-BR')) return 'BRL';
  if (lang.startsWith('en-GB')) return 'GBP';
  if (lang.startsWith('en-AU')) return 'AUD';
  if (lang.startsWith('en-CA')) return 'CAD';

  return 'USD';
}

/**
 * Detect user's likely unit system
 */
export function detectUnitSystem(): UnitSystem {
  if (typeof window === 'undefined') return 'imperial';

  // Only US, Liberia, and Myanmar officially use imperial
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.startsWith('America/') && !tz.startsWith('America/Sao_Paulo') &&
      !tz.startsWith('America/Fortaleza') && !tz.startsWith('America/Buenos_Aires') &&
      !tz.startsWith('America/Santiago') && !tz.startsWith('America/Bogota') &&
      !tz.startsWith('America/Lima') && !tz.startsWith('America/Mexico_City') &&
      !tz.startsWith('America/Cancun')) {
    // US/Canada timezone range — but Canada uses metric
    if (tz.startsWith('America/Toronto') || tz.startsWith('America/Vancouver') ||
        tz.startsWith('America/Edmonton') || tz.startsWith('America/Winnipeg') ||
        tz.startsWith('America/Halifax') || tz.startsWith('America/Montreal')) {
      return 'metric';
    }
    return 'imperial';
  }

  return 'metric';
}

/**
 * Detect user's likely locale from browser
 */
export function detectLocale(): string {
  if (typeof window === 'undefined') return 'en';
  const lang = navigator.language.split('-')[0];
  const supported = ['en', 'es', 'fr', 'de', 'pt', 'ja', 'zh', 'ko', 'it', 'nl'];
  return supported.includes(lang) ? lang : 'en';
}
