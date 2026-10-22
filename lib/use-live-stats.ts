'use client'

import { useState, useEffect } from 'react'
import type { ProjectLiveStats } from './live-stats'
import { getAllFallbackStats } from './live-stats'

// In-memory module cache across re-renders/component instances
let globalStatsCache: Record<string, ProjectLiveStats> | null = null
let activeFetchPromise: Promise<Record<string, ProjectLiveStats>> | null = null

export function useLiveStats() {
  const [stats, setStats] = useState<Record<string, ProjectLiveStats>>(
    () => globalStatsCache || getAllFallbackStats()
  )
  const [isLoading, setIsLoading] = useState(!globalStatsCache)
  const [isLive, setIsLive] = useState(
    () => globalStatsCache ? Object.values(globalStatsCache).some((s) => s.isLive) : false
  )

  useEffect(() => {
    let isMounted = true

    async function fetchStats() {
      if (!activeFetchPromise) {
        activeFetchPromise = fetch('/api/live-stats')
          .then((res) => {
            if (!res.ok) {
              throw new Error(`HTTP error ${res.status}`)
            }
            return res.json()
          })
          .then((data: Record<string, ProjectLiveStats>) => {
            globalStatsCache = data
            return data
          })
          .catch((err) => {
            console.warn('[useLiveStats] Live fetch failed, preserving fallbacks:', err)
            return globalStatsCache || getAllFallbackStats()
          })
      }

      try {
        const liveData = await activeFetchPromise
        if (isMounted) {
          setStats(liveData)
          setIsLoading(false)
          const anyLive = Object.values(liveData).some((s) => s.isLive)
          setIsLive(anyLive)
        }
      } catch {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchStats()

    return () => {
      isMounted = false
    }
  }, [])

  const getStats = (id: string): ProjectLiveStats | undefined => {
    return stats[id]
  }

  return {
    stats,
    getStats,
    isLoading,
    isLive,
  }
}

export type { ProjectLiveStats }
