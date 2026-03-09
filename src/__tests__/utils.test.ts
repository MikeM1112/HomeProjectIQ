import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  getLevel,
  getXpForNextLevel,
  getVerdictLabel,
  getVerdictColor,
  getConfidenceLabel,
} from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats cents to dollars', () => {
    expect(formatCurrency(15000)).toBe('$150');
    expect(formatCurrency(0)).toBe('$0');
    expect(formatCurrency(99)).toBe('$0.99');
    expect(formatCurrency(100)).toBe('$1');
  });

  it('handles negative values', () => {
    expect(formatCurrency(-5000)).toBe('-$50');
  });

  it('formats fractional amounts', () => {
    expect(formatCurrency(1550)).toBe('$15.5');
    expect(formatCurrency(1599)).toBe('$15.99');
  });
});

describe('getLevel', () => {
  it('returns level 1 for XP < 100', () => {
    expect(getLevel(0)).toBe(1);
    expect(getLevel(99)).toBe(1);
  });

  it('returns level 2 for XP 100-299', () => {
    expect(getLevel(100)).toBe(2);
    expect(getLevel(299)).toBe(2);
  });

  it('returns level 3 for XP 300-599', () => {
    expect(getLevel(300)).toBe(3);
    expect(getLevel(599)).toBe(3);
  });

  it('returns level 4 for XP 600-999', () => {
    expect(getLevel(600)).toBe(4);
    expect(getLevel(999)).toBe(4);
  });

  it('returns level 5 for XP >= 1000', () => {
    expect(getLevel(1000)).toBe(5);
    expect(getLevel(9999)).toBe(5);
  });
});

describe('getXpForNextLevel', () => {
  it('calculates progress within level 1', () => {
    const result = getXpForNextLevel(50);
    expect(result.current).toBe(50);
    expect(result.needed).toBe(100);
    expect(result.progress).toBe(50);
  });

  it('returns 100% progress at max level', () => {
    const result = getXpForNextLevel(1500);
    expect(result.progress).toBe(100);
  });

  it('calculates level 2 progress correctly', () => {
    const result = getXpForNextLevel(200);
    expect(result.current).toBe(100);
    expect(result.needed).toBe(200);
    expect(result.progress).toBe(50);
  });
});

describe('getVerdictLabel', () => {
  it('maps verdict codes to labels', () => {
    expect(getVerdictLabel('diy_easy')).toBe('DIY Easy');
    expect(getVerdictLabel('diy_caution')).toBe('DIY with Caution');
    expect(getVerdictLabel('hire_pro')).toBe('Lean toward Pro');
  });

  it('returns raw string for unknown verdicts', () => {
    expect(getVerdictLabel('unknown')).toBe('unknown');
  });
});

describe('getVerdictColor', () => {
  it('maps verdict codes to colors', () => {
    expect(getVerdictColor('diy_easy')).toBe('#2D8A4E');
    expect(getVerdictColor('diy_caution')).toBe('#F9A825');
    expect(getVerdictColor('hire_pro')).toBe('#D32F2F');
  });

  it('returns gray for unknown', () => {
    expect(getVerdictColor('unknown')).toBe('#6B6B6B');
  });
});

describe('getConfidenceLabel', () => {
  it('returns DIY Easy for confidence >= 85', () => {
    const result = getConfidenceLabel(90);
    expect(result.label).toBe('DIY Easy');
    expect(result.heading).toBe('You Got This!');
  });

  it('returns DIY with Caution for confidence 70-84', () => {
    const result = getConfidenceLabel(75);
    expect(result.label).toBe('DIY with Caution');
    expect(result.heading).toBe('Proceed Carefully');
  });

  it('returns Lean toward Pro for confidence < 70', () => {
    const result = getConfidenceLabel(50);
    expect(result.label).toBe('Lean toward Pro');
    expect(result.heading).toBe('Consider Hiring Help');
  });

  it('handles boundary values', () => {
    expect(getConfidenceLabel(85).label).toBe('DIY Easy');
    expect(getConfidenceLabel(84).label).toBe('DIY with Caution');
    expect(getConfidenceLabel(70).label).toBe('DIY with Caution');
    expect(getConfidenceLabel(69).label).toBe('Lean toward Pro');
  });
});
