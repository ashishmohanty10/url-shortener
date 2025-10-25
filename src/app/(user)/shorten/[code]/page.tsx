'use client'

import { useEffect } from 'react'

export default function LinkPage({ params }: { params: { code: string } }) {
  useEffect(() => {
    const redirectUrl = async () => {
      const { code } = await params
      const response = await fetch(`/api/redirect/${code}`)
      const data = await response.json()
      if (data.originalUrl) {
        window.location.href = data.originalUrl
      }
    }
    redirectUrl()
  }, [params])

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <p className="animate-pulse">Redirecting you to your destination...</p>
    </div>
  )
}
