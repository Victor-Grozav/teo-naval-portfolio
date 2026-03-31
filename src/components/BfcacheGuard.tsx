'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BfcacheGuard() {
  const router = useRouter()

  useEffect(() => {
    // Prevent browser from restoring scroll position on refresh
    history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        router.refresh()
        window.scrollTo(0, 0)
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [router])

  return null
}
