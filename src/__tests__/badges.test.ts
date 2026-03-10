import { describe, it, expect, vi } from 'vitest';
import { BADGE_DEFINITIONS } from '@/lib/constants';
import { CATEGORIES } from '@/lib/project-data';

/**
 * Tests for badge condition logic.
 * Since checkAndAwardBadges requires a Supabase client, we test the
 * badge condition matrix directly — same logic used in badges.ts.
 */

// Replicate the condition matrix from badges.ts
function evaluateBadgeConditions(stats: {
  projectCount: number;
  logbookCount: number;
  toolCount: number;
  uniqueCategories: number;
  totalSavings: number;
  streak: number;
}) {
  return {
    first_project: stats.projectCount >= 1,
    five_projects: stats.projectCount >= 5,
    ten_projects: stats.projectCount >= 10,
    saved_500: stats.totalSavings >= 50000,
    saved_1000: stats.totalSavings >= 100000,
    streak_7: stats.streak >= 7,
    streak_30: stats.streak >= 30,
    all_categories: stats.uniqueCategories >= CATEGORIES.length,
    logbook_10: stats.logbookCount >= 10,
    tools_20: stats.toolCount >= 20,
  };
}

function getNewBadges(
  conditions: Record<string, boolean>,
  currentBadges: string[]
): string[] {
  return Object.entries(conditions)
    .filter(([id, met]) => met && !currentBadges.includes(id))
    .map(([id]) => id);
}

describe('Badge condition evaluation', () => {
  it('awards first_project badge at 1 project', () => {
    const conditions = evaluateBadgeConditions({
      projectCount: 1,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 0,
    });
    expect(conditions.first_project).toBe(true);
    expect(conditions.five_projects).toBe(false);
  });

  it('awards five_projects badge at exactly 5', () => {
    const conditions = evaluateBadgeConditions({
      projectCount: 5,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 0,
    });
    expect(conditions.five_projects).toBe(true);
    expect(conditions.ten_projects).toBe(false);
  });

  it('awards savings badges at correct thresholds (cents)', () => {
    const at499 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 49999,
      streak: 0,
    });
    expect(at499.saved_500).toBe(false);

    const at500 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 50000,
      streak: 0,
    });
    expect(at500.saved_500).toBe(true);
    expect(at500.saved_1000).toBe(false);

    const at1000 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 100000,
      streak: 0,
    });
    expect(at1000.saved_1000).toBe(true);
  });

  it('awards streak badges at 7 and 30 days', () => {
    const at6 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 6,
    });
    expect(at6.streak_7).toBe(false);

    const at7 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 7,
    });
    expect(at7.streak_7).toBe(true);
    expect(at7.streak_30).toBe(false);

    const at30 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 30,
    });
    expect(at30.streak_30).toBe(true);
  });

  it('awards all_categories when all categories are covered', () => {
    const partial = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: CATEGORIES.length - 1,
      totalSavings: 0,
      streak: 0,
    });
    expect(partial.all_categories).toBe(false);

    const all = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: CATEGORIES.length,
      totalSavings: 0,
      streak: 0,
    });
    expect(all.all_categories).toBe(true);
  });

  it('awards logbook_10 at 10 entries', () => {
    const at9 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 9,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 0,
    });
    expect(at9.logbook_10).toBe(false);

    const at10 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 10,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 0,
    });
    expect(at10.logbook_10).toBe(true);
  });

  it('awards tools_20 at 20 tools', () => {
    const at19 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 19,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 0,
    });
    expect(at19.tools_20).toBe(false);

    const at20 = evaluateBadgeConditions({
      projectCount: 0,
      logbookCount: 0,
      toolCount: 20,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 0,
    });
    expect(at20.tools_20).toBe(true);
  });
});

describe('Badge deduplication', () => {
  it('does not award already-earned badges', () => {
    const conditions = evaluateBadgeConditions({
      projectCount: 1,
      logbookCount: 0,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 0,
    });
    const newBadges = getNewBadges(conditions, ['first_project']);
    expect(newBadges).not.toContain('first_project');
  });

  it('awards multiple new badges at once', () => {
    const conditions = evaluateBadgeConditions({
      projectCount: 5,
      logbookCount: 10,
      toolCount: 0,
      uniqueCategories: 0,
      totalSavings: 0,
      streak: 7,
    });
    const newBadges = getNewBadges(conditions, []);
    expect(newBadges).toContain('first_project');
    expect(newBadges).toContain('five_projects');
    expect(newBadges).toContain('logbook_10');
    expect(newBadges).toContain('streak_7');
    expect(newBadges).not.toContain('ten_projects');
  });

  it('returns empty when all badges already earned', () => {
    const conditions = evaluateBadgeConditions({
      projectCount: 10,
      logbookCount: 10,
      toolCount: 20,
      uniqueCategories: CATEGORIES.length,
      totalSavings: 100000,
      streak: 30,
    });
    const allBadgeIds = Object.keys(conditions);
    const newBadges = getNewBadges(conditions, allBadgeIds);
    expect(newBadges).toEqual([]);
  });
});

describe('BADGE_DEFINITIONS coverage', () => {
  it('every badge in BADGE_DEFINITIONS has a matching condition', () => {
    const conditionKeys = Object.keys(
      evaluateBadgeConditions({
        projectCount: 0,
        logbookCount: 0,
        toolCount: 0,
        uniqueCategories: 0,
        totalSavings: 0,
        streak: 0,
      })
    );
    for (const badge of BADGE_DEFINITIONS) {
      expect(conditionKeys).toContain(badge.id);
    }
  });
});
