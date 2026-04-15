/**
 * Simple in-memory rate limiter.
 *
 * Works per server instance. For serverless (Vercel), each cold-start
 * gets a fresh Map, so this is best-effort but still reduces abuse
 * significantly when combined with honeypot validation.
 *
 * For high-traffic production, replace with an Upstash Redis rate limiter.
 */

interface RateEntry {
  count: number;
  resetAt: number; // epoch ms
}

// Key → { count, resetAt }
const store = new Map<string, RateEntry>();

// Clean up expired entries every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  /** Unique key for this limit (e.g. IP address) */
  key: string;
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSec: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function checkRateLimit({
  key,
  limit,
  windowSec,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSec * 1000;

  let entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // First request in this window
    entry = { count: 1, resetAt: now + windowMs };
    store.set(key, entry);
    return { allowed: true, remaining: limit - 1, resetAt: entry.resetAt };
  }

  entry.count += 1;
  store.set(key, entry);

  const remaining = Math.max(0, limit - entry.count);
  return {
    allowed: entry.count <= limit,
    remaining,
    resetAt: entry.resetAt,
  };
}
