import { alphabet } from '@/utils/constant'
import { clsx, type ClassValue } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ensureHttps(url: string) {
  if (!url.startsWith('https://')) {
    return `https://${url}`
  }

  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://')
  }
  return url
}

export const generateRandomString = (length: number = 8) => {
  const nanoid = customAlphabet(alphabet, length)
  return nanoid()
}

export function correctTextColor(flagCategory: string) {
  switch (flagCategory) {
    case 'safe':
      return '#16a34a' // green-600
    case 'suspicious':
      return '#ca8a04' // yellow-600
    case 'malicious':
      return '#dc2626' // red-600
    case 'inappropriate':
      return '#ea580c' // orange-600
    default:
      return '#6b7280' // gray-500
  }
}
