const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1 };
  }

  record.count++;
  attempts.set(key, record);

  return {
    allowed: record.count <= maxAttempts,
    remaining: Math.max(0, maxAttempts - record.count),
  };
}
