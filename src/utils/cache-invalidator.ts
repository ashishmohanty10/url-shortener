import { redis } from '@/lib/redis'

/**
 * Invalidate all cached URL data for a specific user
 * Call this after creating, updating, or deleting URLs
 */

export async function invalidateUrlCache(userId: string) {
  const keys = await redis.keys(`urls:${userId}:*`)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}

export async function deleteByPattern(pattern: string) {
  const keys = await redis.keys(pattern)
  if (keys.length > 0) {
    await redis.del(...keys)
  }
}
