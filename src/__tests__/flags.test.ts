import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { flags, isEnabled } from '@/lib/flags';
import type { FlagName } from '@/lib/flags';

describe('flags', () => {
  it('has all 8 feature flags defined', () => {
    const flagNames = Object.keys(flags);
    expect(flagNames).toHaveLength(8);
    expect(flagNames).toContain('ENABLE_AFFILIATE_LINKS');
    expect(flagNames).toContain('ENABLE_FEATURED_PROS');
    expect(flagNames).toContain('ENABLE_CATEGORY_SPONSORS');
    expect(flagNames).toContain('ENABLE_PRO_LEAD_GEN');
    expect(flagNames).toContain('ENABLE_BUSINESS_SUBSCRIPTIONS');
    expect(flagNames).toContain('ENABLE_ANALYTICS_EXPORT');
    expect(flagNames).toContain('ENABLE_API_PARTNER_ACCESS');
    expect(flagNames).toContain('ENABLE_AGGREGATE_INSIGHTS');
  });

  it('defaults all flags to false', () => {
    for (const value of Object.values(flags)) {
      expect(value).toBe(false);
    }
  });
});

describe('isEnabled', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns false for all flags by default', () => {
    const flagNames = Object.keys(flags) as FlagName[];
    for (const flag of flagNames) {
      expect(isEnabled(flag)).toBe(false);
    }
  });

  it('returns true when env var is set to "true"', () => {
    process.env.NEXT_PUBLIC_FLAG_ENABLE_AFFILIATE_LINKS = 'true';
    expect(isEnabled('ENABLE_AFFILIATE_LINKS')).toBe(true);
  });

  it('returns false when env var is set to "false"', () => {
    process.env.NEXT_PUBLIC_FLAG_ENABLE_AFFILIATE_LINKS = 'false';
    expect(isEnabled('ENABLE_AFFILIATE_LINKS')).toBe(false);
  });

  it('falls back to default when env var is not set', () => {
    delete process.env.NEXT_PUBLIC_FLAG_ENABLE_FEATURED_PROS;
    expect(isEnabled('ENABLE_FEATURED_PROS')).toBe(false);
  });

  it('ignores non-boolean env values', () => {
    process.env.NEXT_PUBLIC_FLAG_ENABLE_AFFILIATE_LINKS = 'yes';
    // Should fall back to default (false) since "yes" is not "true" or "false"
    expect(isEnabled('ENABLE_AFFILIATE_LINKS')).toBe(false);
  });
});
