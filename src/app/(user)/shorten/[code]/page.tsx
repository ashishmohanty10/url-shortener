'use client'

import { useEffect, useState } from 'react'

export default function LinkPage({ params }: { params: Promise<{ code: string }> }) {
  const [isRedirecting, setIsRedirecting] = useState(true)

  useEffect(() => {
    const redirectUrl = async () => {
      try {
        const { code } = await params
        const response = await fetch(`/api/redirect/${code}`)
        const data = await response.json()

        if (data.originalUrl) {
          window.location.href = data.originalUrl
        } else {
          setIsRedirecting(false)
        }
      } catch (error) {
        console.error('Redirect error:', error)
        setIsRedirecting(false)
      }
    }

    redirectUrl()
  }, [params])

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      {isRedirecting ? (
        <p className="animate-pulse">Redirecting you to your destination...</p>
      ) : (
        <p className="text-red-500">Failed to redirect. Invalid link.</p>
      )}
    </div>
  )
}
