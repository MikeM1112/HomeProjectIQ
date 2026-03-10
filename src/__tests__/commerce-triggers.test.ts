import { describe, it, expect } from 'vitest';
import { getContextualOffers, getCurrentSeason, getSeasonalOffers } from '@/lib/commerce-triggers';
import type { TriggerContext } from '@/lib/commerce-triggers';

describe('getContextualOffers', () => {
  it('returns pro service offers when verdict is hire_pro', () => {
    const context: TriggerContext = { verdict: 'hire_pro' };
    const offers = getContextualOffers(context);
    expect(offers.length).toBeGreaterThan(0);
    expect(offers.some((o) => o.partner === 'Angi' || o.partner === 'Thumbtack')).toBe(true);
  });

  it('returns material offers when verdict is diy_easy', () => {
    const context: TriggerContext = { verdict: 'diy_easy' };
    const offers = getContextualOffers(context);
    expect(offers.length).toBeGreaterThan(0);
    expect(offers.some((o) => o.partner === 'Home Depot' || o.partner === "Lowe's")).toBe(true);
  });

  it('returns material offers when verdict is diy_caution', () => {
    const context: TriggerContext = { verdict: 'diy_caution' };
    const offers = getContextualOffers(context);
    expect(offers.some((o) => o.partner === 'Home Depot')).toBe(true);
  });

  it('includes tool offers when user is missing tools', () => {
    const context: TriggerContext = {
      verdict: 'diy_easy',
      toolsNeeded: ['drill', 'circular_saw', 'level'],
      toolsOwned: ['drill'],
    };
    const offers = getContextualOffers(context);
    expect(offers.some((o) => o.id === 'hd-rental' || o.id === 'milwaukee')).toBe(true);
  });

  it('does not include tool offers when user has all tools', () => {
    const context: TriggerContext = {
      verdict: 'diy_easy',
      toolsNeeded: ['drill'],
      toolsOwned: ['drill'],
    };
    const offers = getContextualOffers(context);
    expect(offers.some((o) => o.id === 'hd-rental')).toBe(false);
  });

  it('includes financing for expensive projects', () => {
    const context: TriggerContext = {
      verdict: 'diy_easy',
      estimatedCostDiy: 500000, // $5,000
    };
    const offers = getContextualOffers(context);
    expect(offers.some((o) => o.partner === 'Affirm' || o.partner === 'SoFi Home Improvement')).toBe(true);
  });

  it('does not include financing for cheap projects', () => {
    const context: TriggerContext = {
      verdict: 'diy_easy',
      estimatedCostDiy: 5000, // $50
    };
    const offers = getContextualOffers(context);
    expect(offers.some((o) => o.partner === 'Affirm')).toBe(false);
  });

  it('includes insurance for expensive pro projects', () => {
    const context: TriggerContext = {
      verdict: 'hire_pro',
      estimatedCostPro: 500000, // $5,000
    };
    const offers = getContextualOffers(context);
    expect(offers.some((o) => o.partner === 'Hippo Insurance' || o.partner === 'American Home Shield')).toBe(true);
  });

  it('includes education offers for beginners when slots are available', () => {
    // Education is medium tier — it shows when not crowded out by higher-priority offers
    const context: TriggerContext = {
      userLevel: 1,
    };
    const offers = getContextualOffers(context);
    // With only userLevel set (no verdict), only education triggers fire
    expect(offers.some((o) => o.partner === 'This Old House')).toBe(true);
  });

  it('limits results to 3 offers', () => {
    const context: TriggerContext = {
      verdict: 'hire_pro',
      estimatedCostPro: 500000,
      estimatedCostDiy: 300000,
      userLevel: 1,
    };
    const offers = getContextualOffers(context);
    expect(offers.length).toBeLessThanOrEqual(3);
  });

  it('deduplicates offers', () => {
    const context: TriggerContext = {
      verdict: 'hire_pro',
      categoryId: 'electric',
    };
    const offers = getContextualOffers(context);
    const ids = offers.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('prioritizes high-tier offers', () => {
    const context: TriggerContext = {
      verdict: 'hire_pro',
      estimatedCostPro: 500000,
    };
    const offers = getContextualOffers(context);
    if (offers.length >= 2) {
      const tierOrder = { high: 0, medium: 1, standard: 2 };
      for (let i = 1; i < offers.length; i++) {
        expect(tierOrder[offers[i].tier]).toBeGreaterThanOrEqual(tierOrder[offers[i - 1].tier]);
      }
    }
  });

  it('adds pro/insurance for electrical category', () => {
    const context: TriggerContext = {
      verdict: 'diy_easy',
      categoryId: 'electric',
    };
    const offers = getContextualOffers(context);
    expect(offers.some((o) => o.id === 'angi')).toBe(true);
  });

  it('returns empty array for empty context', () => {
    const context: TriggerContext = {};
    const offers = getContextualOffers(context);
    expect(offers).toEqual([]);
  });
});

describe('getCurrentSeason', () => {
  it('returns a valid season', () => {
    const season = getCurrentSeason();
    expect(['spring', 'summer', 'fall', 'winter']).toContain(season);
  });
});

describe('getSeasonalOffers', () => {
  it('returns offers for each season', () => {
    const seasons = ['spring', 'summer', 'fall', 'winter'] as const;
    for (const season of seasons) {
      const offers = getSeasonalOffers(season);
      expect(offers.length).toBeGreaterThan(0);
      expect(offers[0].partner).toBeTruthy();
      expect(offers[0].headline).toBeTruthy();
    }
  });
});
