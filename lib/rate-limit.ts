import "server-only";

// In-memory fixed-window limiter for a single server instance. Swap for
// Upstash Redis or Vercel's edge rate limiting before a multi-instance
// production deploy (Phase 7 of REQUIREMENTS.md).
const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  { windowMs = 60_000, max = 5 }: { windowMs?: number; max?: number } = {}
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (entry.count >= max) {
    return { allowed: false, retryAfterMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
