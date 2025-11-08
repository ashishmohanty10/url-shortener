import { redis } from '@/lib/redis'

/**
 * Invalidate all cached URL data for a specific user
 * Call this after creating, updating, or deleting URLs
 */

export async function invalidateUrlCache(userId: string): Promise<void> {
  try {
    const pattern = `urls:${userId}:*`
    const keys = await redis.keys(pattern)

    if (keys.length > 0) {
      await redis.del(...keys)
      console.log(`Invalidated ${keys.length} cache entries for user ${userId}`)
    }
  } catch (error) {
    console.error('Failed to invalidate cache:', error)
  }
}
