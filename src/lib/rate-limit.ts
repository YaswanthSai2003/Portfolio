// Lightweight in-memory rate limiter.
//
// Known limitation: on serverless platforms (Vercel, etc.) each function
// instance has its own memory, and cold starts reset it. This limits abuse
// from a single warm instance but is NOT a hard global ceiling across a
// scaled-out deployment. For stronger guarantees, back this with a shared
// store (Redis, Supabase, Upstash) keyed the same way. For a low-traffic
// personal site this is a reasonable, dependency-free starting point.

import { createHash } from "node:crypto";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodically drop expired buckets so this map doesn't grow forever on a
// long-lived server instance.
const SWEEP_INTERVAL_MS = 10 * 60 * 1000;
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < SWEEP_INTERVAL_MS) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

/**
 * Returns true if `key` has exceeded `max` hits within `windowMs`.
 * Each call counts as one hit.
 */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  sweep(now);
  const current = buckets.get(key);
  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > max;
}

/** Hashes an identifying value (e.g. IP) so raw values never sit in memory. */
export function rateLimitKey(identifier: string, secret: string, namespace: string) {
  return createHash("sha256").update(`${namespace}:${secret}:${identifier}`).digest("hex").slice(0, 24);
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}
