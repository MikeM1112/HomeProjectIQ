import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    // Reset the module to clear the in-memory store
    vi.resetModules();
  });

  it('allows requests within limit', () => {
    const config = { max: 3, windowMs: 60000 };
    const result = checkRateLimit('test-allow', config);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('blocks requests exceeding limit', () => {
    const config = { max: 2, windowMs: 60000 };
    checkRateLimit('test-block', config);
    checkRateLimit('test-block', config);
    const result = checkRateLimit('test-block', config);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('decrements remaining count', () => {
    const config = { max: 5, windowMs: 60000 };
    const r1 = checkRateLimit('test-decrement', config);
    expect(r1.remaining).toBe(4);
    const r2 = checkRateLimit('test-decrement', config);
    expect(r2.remaining).toBe(3);
  });

  it('isolates different keys', () => {
    const config = { max: 1, windowMs: 60000 };
    checkRateLimit('user-a', config);
    const result = checkRateLimit('user-b', config);
    expect(result.success).toBe(true);
  });

  it('provides reset timestamp', () => {
    const config = { max: 1, windowMs: 60000 };
    checkRateLimit('test-reset', config);
    const result = checkRateLimit('test-reset', config);
    expect(result.reset).toBeGreaterThan(Date.now());
  });
});
