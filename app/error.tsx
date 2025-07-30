'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-4">
          We encountered an error while loading this page.
        </p>
        {error.digest && (
          <p className="text-sm text-gray-400 mb-4">Error ID: {error.digest}</p>
        )}
        <Button onClick={() => reset()}>Try again</Button>
      </div>
    </div>
  )
}
