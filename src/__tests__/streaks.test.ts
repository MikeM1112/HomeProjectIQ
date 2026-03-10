import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Tests for streak calculation logic.
 * Extracted from streaks.ts to test the pure date math without Supabase.
 */

// Pure streak logic extracted from streaks.ts
function calculateNewStreak(
  currentStreak: number,
  lastActiveAt: string | null,
  now: Date
): { newStreak: number; isNoOp: boolean } {
  const todayStr = now.toISOString().slice(0, 10);
  const lastActiveStr = lastActiveAt
    ? new Date(lastActiveAt).toISOString().slice(0, 10)
    : null;

  // Same day — no-op
  if (lastActiveStr === todayStr) {
    return { newStreak: currentStreak, isNoOp: true };
  }

  if (lastActiveStr) {
    const lastDate = new Date(lastActiveStr);
    const today = new Date(todayStr);
    const diffMs = today.getTime() - lastDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return { newStreak: currentStreak + 1, isNoOp: false };
    } else {
      return { newStreak: 1, isNoOp: false };
    }
  }

  // First activity
  return { newStreak: 1, isNoOp: false };
}

describe('Streak calculation', () => {
  it('returns no-op for same day activity', () => {
    const now = new Date('2026-03-10T14:30:00Z');
    const result = calculateNewStreak(5, '2026-03-10T09:00:00Z', now);
    expect(result.isNoOp).toBe(true);
    expect(result.newStreak).toBe(5);
  });

  it('increments streak for consecutive day', () => {
    const now = new Date('2026-03-10T10:00:00Z');
    const result = calculateNewStreak(3, '2026-03-09T18:00:00Z', now);
    expect(result.isNoOp).toBe(false);
    expect(result.newStreak).toBe(4);
  });

  it('resets streak after 2-day gap', () => {
    const now = new Date('2026-03-10T10:00:00Z');
    const result = calculateNewStreak(15, '2026-03-08T10:00:00Z', now);
    expect(result.isNoOp).toBe(false);
    expect(result.newStreak).toBe(1);
  });

  it('resets streak after long gap', () => {
    const now = new Date('2026-03-10T10:00:00Z');
    const result = calculateNewStreak(30, '2026-02-01T10:00:00Z', now);
    expect(result.newStreak).toBe(1);
  });

  it('starts streak at 1 for first activity (no lastActiveAt)', () => {
    const now = new Date('2026-03-10T10:00:00Z');
    const result = calculateNewStreak(0, null, now);
    expect(result.newStreak).toBe(1);
    expect(result.isNoOp).toBe(false);
  });

  it('handles midnight boundary correctly', () => {
    // 11:59 PM on March 9 → March 10 morning = consecutive
    const now = new Date('2026-03-10T06:00:00Z');
    const result = calculateNewStreak(1, '2026-03-09T23:59:00Z', now);
    expect(result.newStreak).toBe(2);
  });

  it('handles year boundary', () => {
    const now = new Date('2026-01-01T10:00:00Z');
    const result = calculateNewStreak(365, '2025-12-31T22:00:00Z', now);
    expect(result.newStreak).toBe(366);
  });

  it('does not increment for same UTC day but different times', () => {
    const now = new Date('2026-03-10T23:59:59Z');
    const result = calculateNewStreak(5, '2026-03-10T00:00:01Z', now);
    expect(result.isNoOp).toBe(true);
    expect(result.newStreak).toBe(5);
  });
});
