import { useCallback } from 'react';
import { usePreferencesStore } from '@/stores/preferencesStore';
import {
  formatLocalCurrency,
  formatCostRange,
  formatLocalDate,
  formatRelativeTime,
  formatLength,
  formatWeight,
  formatTemperature,
  formatArea,
  formatVolume,
  type CurrencyCode,
} from '@/lib/global';

/**
 * Hook that provides locale-aware formatting functions
 * Uses the user's stored preferences for currency, locale, and units
 */
export function useFormatting() {
  const { locale, currency, units } = usePreferencesStore();

  const fmtCurrency = useCallback(
    (amountUSD: number, overrideCurrency?: CurrencyCode) => {
      return formatLocalCurrency(amountUSD, overrideCurrency ?? currency, locale);
    },
    [locale, currency]
  );

  const fmtCostRange = useCallback(
    (loUSD: number, hiUSD: number, overrideCurrency?: CurrencyCode) => {
      return formatCostRange(loUSD, hiUSD, overrideCurrency ?? currency, locale);
    },
    [locale, currency]
  );

  const fmtDate = useCallback(
    (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
      return formatLocalDate(date, locale, options);
    },
    [locale]
  );

  const fmtRelative = useCallback(
    (date: string | Date) => {
      return formatRelativeTime(date, locale);
    },
    [locale]
  );

  const fmtLength = useCallback(
    (meters: number) => formatLength(meters, units),
    [units]
  );

  const fmtWeight = useCallback(
    (kg: number) => formatWeight(kg, units),
    [units]
  );

  const fmtTemp = useCallback(
    (celsius: number) => formatTemperature(celsius, units),
    [units]
  );

  const fmtArea = useCallback(
    (sqMeters: number) => formatArea(sqMeters, units),
    [units]
  );

  const fmtVolume = useCallback(
    (liters: number) => formatVolume(liters, units),
    [units]
  );

  return {
    locale,
    currency,
    units,
    fmtCurrency,
    fmtCostRange,
    fmtDate,
    fmtRelative,
    fmtLength,
    fmtWeight,
    fmtTemp,
    fmtArea,
    fmtVolume,
  };
}
