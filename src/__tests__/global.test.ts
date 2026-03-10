import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_CURRENCIES,
  formatLocalCurrency,
  formatCostRange,
  convertCurrency,
  formatLength,
  formatWeight,
  formatTemperature,
  formatArea,
  formatVolume,
  getDateLocale,
} from '@/lib/global';

describe('SUPPORTED_CURRENCIES', () => {
  it('has 26 currencies', () => {
    expect(SUPPORTED_CURRENCIES).toHaveLength(26);
  });

  it('includes major currencies', () => {
    const codes = SUPPORTED_CURRENCIES.map((c) => c.code);
    expect(codes).toContain('USD');
    expect(codes).toContain('EUR');
    expect(codes).toContain('GBP');
    expect(codes).toContain('JPY');
    expect(codes).toContain('CAD');
  });

  it('all currencies have required fields', () => {
    for (const currency of SUPPORTED_CURRENCIES) {
      expect(currency.code).toBeTruthy();
      expect(currency.symbol).toBeTruthy();
      expect(currency.name).toBeTruthy();
      expect(currency.locale).toBeTruthy();
    }
  });

  it('currency codes are unique', () => {
    const codes = SUPPORTED_CURRENCIES.map((c) => c.code);
    expect(new Set(codes).size).toBe(codes.length);
  });
});

describe('convertCurrency', () => {
  it('returns same amount for USD', () => {
    expect(convertCurrency(100, 'USD')).toBe(100);
  });

  it('converts to other currencies', () => {
    const eur = convertCurrency(100, 'EUR');
    expect(eur).toBe(92); // 100 * 0.92 rounded
  });

  it('handles JPY (high rate)', () => {
    const jpy = convertCurrency(100, 'JPY');
    expect(jpy).toBe(14950); // 100 * 149.5 rounded
  });
});

describe('formatLocalCurrency', () => {
  it('formats USD correctly', () => {
    const result = formatLocalCurrency(100, 'USD');
    expect(result).toContain('100');
    expect(result).toContain('$');
  });

  it('formats EUR correctly', () => {
    const result = formatLocalCurrency(100, 'EUR');
    expect(result).toBeTruthy();
  });
});

describe('formatCostRange', () => {
  it('formats a range', () => {
    const result = formatCostRange(50, 150, 'USD');
    expect(result).toContain('–');
  });
});

describe('formatLength', () => {
  it('formats in imperial (feet)', () => {
    expect(formatLength(3, 'imperial')).toContain('ft');
  });

  it('formats small imperial as inches', () => {
    expect(formatLength(0.2, 'imperial')).toContain('in');
  });

  it('formats in metric (meters)', () => {
    expect(formatLength(3, 'metric')).toContain('m');
  });

  it('formats small metric as centimeters', () => {
    expect(formatLength(0.5, 'metric')).toContain('cm');
  });
});

describe('formatWeight', () => {
  it('formats in imperial (lbs)', () => {
    expect(formatWeight(10, 'imperial')).toContain('lbs');
  });

  it('formats small imperial as ounces', () => {
    expect(formatWeight(0.3, 'imperial')).toContain('oz');
  });

  it('formats in metric (kg)', () => {
    expect(formatWeight(10, 'metric')).toContain('kg');
  });

  it('formats small metric as grams', () => {
    expect(formatWeight(0.5, 'metric')).toContain('g');
  });
});

describe('formatTemperature', () => {
  it('converts to Fahrenheit for imperial', () => {
    const result = formatTemperature(0, 'imperial');
    expect(result).toBe('32°F');
  });

  it('converts to Fahrenheit correctly', () => {
    const result = formatTemperature(100, 'imperial');
    expect(result).toBe('212°F');
  });

  it('displays Celsius for metric', () => {
    const result = formatTemperature(25, 'metric');
    expect(result).toBe('25°C');
  });
});

describe('formatArea', () => {
  it('formats in sq ft for imperial', () => {
    const result = formatArea(10, 'imperial');
    expect(result).toContain('sq ft');
  });

  it('formats in m² for metric', () => {
    const result = formatArea(10, 'metric');
    expect(result).toContain('m²');
  });
});

describe('formatVolume', () => {
  it('formats in gallons for imperial', () => {
    const result = formatVolume(10, 'imperial');
    expect(result).toContain('gal');
  });

  it('formats small imperial as fl oz', () => {
    const result = formatVolume(0.5, 'imperial');
    expect(result).toContain('fl oz');
  });

  it('formats in liters for metric', () => {
    const result = formatVolume(10, 'metric');
    expect(result).toContain('L');
  });

  it('formats small metric as mL', () => {
    const result = formatVolume(0.5, 'metric');
    expect(result).toContain('mL');
  });
});

describe('getDateLocale', () => {
  it('maps common locales', () => {
    expect(getDateLocale('en')).toBe('en-US');
    expect(getDateLocale('es')).toBe('es-ES');
    expect(getDateLocale('fr')).toBe('fr-FR');
    expect(getDateLocale('ja')).toBe('ja-JP');
  });

  it('defaults to en-US for unknown', () => {
    expect(getDateLocale('xx')).toBe('en-US');
  });
});
