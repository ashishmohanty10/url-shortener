import { useEffect, useState } from 'react'

/**
 * Custom hook to detect if the current viewport is mobile.
 * @param breakpoint - max width (in px) to consider as mobile (default: 768)
 * @returns boolean - true if viewport width <= breakpoint
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  useEffect(() => {
    const checkIsMobile = (): void => {
      setIsMobile(window.innerWidth <= breakpoint)
    }
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [breakpoint])

  return isMobile
}
