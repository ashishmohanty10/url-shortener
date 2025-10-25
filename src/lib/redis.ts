import Redis from 'ioredis'
import { env } from './env'

const redisUrl = env.REDIS_URL || 'redis://localhost:6379'
export const redis = new Redis(redisUrl)
