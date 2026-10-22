import { type NextRequest, NextResponse } from 'next/server'
import { getAllProjectsLiveStats, getProjectLiveStats, getAllFallbackStats } from '@/lib/live-stats'

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')

    if (id) {
      const stats = await getProjectLiveStats(id)
      return NextResponse.json(stats, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      })
    }

    const allStats = await getAllProjectsLiveStats()
    return NextResponse.json(allStats, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error: unknown) {
    // Rethrow Next.js internal control flow errors (prerender bailouts, redirects)
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as { digest: unknown }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_')
    ) {
      throw error
    }

    console.error('Error in /api/live-stats route handler:', error)
    const fallbacks = getAllFallbackStats()
    return NextResponse.json(fallbacks, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  }
}
