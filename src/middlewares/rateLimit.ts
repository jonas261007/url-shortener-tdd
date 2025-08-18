import { Request, Response, NextFunction } from 'express';

type Bucket = { count: number; windowStart: number };
const buckets = new Map<string, Bucket>();

const WINDOW_MS = 60_000;
const DEFAULT_LIMIT = Number(process.env.RATE_LIMIT_PER_MIN || 30);

export function rateLimitCreateLink(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const userId = (req as any).userId || req.ip || 'anon';
  const key = `create:${userId}`;

  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart >= WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return next();
  }

  if (bucket.count >= DEFAULT_LIMIT) {
    res.setHeader('Retry-After', Math.ceil((bucket.windowStart + WINDOW_MS - now) / 1000));
    return res.status(429).json({ error: 'Rate limit exceeded. Try again soon.' });
  }

  bucket.count += 1;
  return next();
}
