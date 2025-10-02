import { clsx, type ClassValue } from 'clsx'
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
