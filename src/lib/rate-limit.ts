/**
 * Simple in-memory rate limiter using a sliding window.
 * Suitable for single-instance deployments. For multi-instance,
 * replace with Redis-based rate limiting (e.g., @upstash/ratelimit).
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Maximum number of requests allowed in the window */
  max: number;
  /** Window size in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

/**
 * Check rate limit for a given key.
 * Returns { success: true } if within limits.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const cutoff = now - config.windowMs;

  cleanup(config.windowMs);

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove expired timestamps
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= config.max) {
    const oldestInWindow = entry.timestamps[0];
    return {
      success: false,
      remaining: 0,
      reset: oldestInWindow + config.windowMs,
    };
  }

  entry.timestamps.push(now);
  return {
    success: true,
    remaining: config.max - entry.timestamps.length,
    reset: now + config.windowMs,
  };
}

/**
 * Create a rate limiter with preset config.
 */
export function createRateLimiter(config: RateLimitConfig) {
  return (key: string) => checkRateLimit(key, config);
}

// Pre-configured limiters for different endpoint types
export const rateLimiters = {
  /** AI assessment: 5 requests per minute per user */
  assess: createRateLimiter({ max: 5, windowMs: 60 * 1000 }),
  /** Analysis: 10 requests per minute per user */
  analyze: createRateLimiter({ max: 10, windowMs: 60 * 1000 }),
  /** Logbook: 20 requests per minute per user */
  logbook: createRateLimiter({ max: 20, windowMs: 60 * 1000 }),
  /** Toolbox: 30 requests per minute per user */
  toolbox: createRateLimiter({ max: 30, windowMs: 60 * 1000 }),
  /** General API: 60 requests per minute per user */
  general: createRateLimiter({ max: 60, windowMs: 60 * 1000 }),
};
