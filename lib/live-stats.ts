/**
 * lib/live-stats.ts — The "Living" System Engine.
 * Fetches public metadata from GitHub and NPM registries with caching and graceful fallbacks.
 */

import { systems } from './content'

export interface ProjectLiveStats {
  id: string
  name: string
  stars: number | null
  forks: number | null
  version: string
  releaseTag: string | null
  npmVersion: string | null
  isLive: boolean
  lastUpdated: string | null
  sourceUrls?: {
    github?: string
    npm?: string
  }
}

export interface LiveProjectSource {
  id: string
  githubRepo?: string
  npmPackage?: string
  fallbackVersion: string
}

export const LIVE_PROJECT_SOURCES: Record<string, LiveProjectSource> = {
  gripm: {
    id: 'gripm',
    githubRepo: 'pablojavierrodriguez/gripm',
    npmPackage: '@gripm/board',
    fallbackVersion: '1.7.0',
  },
  'gripm-playbook': {
    id: 'gripm-playbook',
    githubRepo: 'pablojavierrodriguez/gripm-playbook',
    npmPackage: '@gripm/playbook',
    fallbackVersion: '2.5.0',
  },
}

/**
 * In-memory cache for live stats to prevent duplicate fetches within the same runtime.
 */
interface CacheEntry {
  data: ProjectLiveStats
  timestamp: number
}

const memoryCache = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

/**
 * Return curated fallback data extracted from lib/content.ts.
 */
export function getFallbackStats(id: string): ProjectLiveStats {
  const sys = systems.find((s) => s.id === id)
  const source = LIVE_PROJECT_SOURCES[id]

  // Extract version from content.ts lifecycle if available, otherwise use source fallback
  let fallbackVersion = source?.fallbackVersion ?? '1.0.0'
  if (sys?.lifecycle?.en) {
    const match = sys.lifecycle.en.match(/v?([0-9]+\.[0-9]+(\.[0-9]+)?)/)
    if (match?.[1]) {
      fallbackVersion = match[1]
    }
  }

  return {
    id,
    name: sys?.name ?? id,
    stars: null,
    forks: null,
    version: fallbackVersion,
    releaseTag: fallbackVersion ? `v${fallbackVersion.replace(/^v/, '')}` : null,
    npmVersion: source?.npmPackage ? fallbackVersion : null,
    isLive: false,
    lastUpdated: null,
    sourceUrls: {
      github: sys?.links?.github,
      npm: sys?.links?.npm,
    },
  }
}

/**
 * Returns default fallback stats for all registered systems.
 */
export function getAllFallbackStats(): Record<string, ProjectLiveStats> {
  const result: Record<string, ProjectLiveStats> = {}
  for (const sys of systems) {
    result[sys.id] = getFallbackStats(sys.id)
  }
  return result
}

/**
 * Fetch GitHub repository stars and forks with timeout and cache.
 */
export async function fetchGitHubRepo(repo: string): Promise<{ stars: number; forks: number } | null> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'pablorodz-portfolio/1.0',
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null

    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers,
      next: { revalidate: 3600 },
      signal: controller?.signal,
    })

    if (timeoutId) clearTimeout(timeoutId)

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return {
      stars: typeof data.stargazers_count === 'number' ? data.stargazers_count : 0,
      forks: typeof data.forks_count === 'number' ? data.forks_count : 0,
    }
  } catch {
    return null
  }
}

/**
 * Fetch latest release tag from GitHub releases or tags.
 */
export async function fetchLatestRelease(repo: string): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'pablorodz-portfolio/1.0',
    }
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null

    // 1. Try releases/latest
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers,
      next: { revalidate: 3600 },
      signal: controller?.signal,
    })

    if (timeoutId) clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      if (data?.tag_name) {
        return String(data.tag_name)
      }
    }

    // 2. Fallback: query tags list
    const tagsController = typeof AbortController !== 'undefined' ? new AbortController() : null
    const tagsTimeout = tagsController ? setTimeout(() => tagsController.abort(), 4000) : null

    const tagsRes = await fetch(`https://api.github.com/repos/${repo}/tags`, {
      headers,
      next: { revalidate: 3600 },
      signal: tagsController?.signal,
    })

    if (tagsTimeout) clearTimeout(tagsTimeout)

    if (tagsRes.ok) {
      const tags = await tagsRes.json()
      if (Array.isArray(tags) && tags.length > 0 && tags[0]?.name) {
        return String(tags[0].name)
      }
    }

    return null
  } catch {
    return null
  }
}

/**
 * Fetch latest version from NPM registry.
 */
export async function fetchNpmLatestVersion(packageName: string): Promise<string | null> {
  try {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timeoutId = controller ? setTimeout(() => controller.abort(), 4000) : null

    // NPM scoped package URLs work cleanly with raw path or encoded slash
    const url = `https://registry.npmjs.org/${packageName}/latest`

    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
      signal: controller?.signal,
    })

    if (timeoutId) clearTimeout(timeoutId)

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return typeof data?.version === 'string' ? data.version : null
  } catch {
    return null
  }
}

/**
 * Get live stats for a single project ID, with in-memory caching and fallback.
 */
export async function getProjectLiveStats(id: string): Promise<ProjectLiveStats> {
  const fallback = getFallbackStats(id)
  const source = LIVE_PROJECT_SOURCES[id]

  if (!source) {
    return fallback
  }

  // Check memory cache
  const cached = memoryCache.get(id)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data
  }

  try {
    const promises: [
      Promise<{ stars: number; forks: number } | null>,
      Promise<string | null>,
      Promise<string | null>,
    ] = [
      source.githubRepo ? fetchGitHubRepo(source.githubRepo) : Promise.resolve(null),
      source.githubRepo ? fetchLatestRelease(source.githubRepo) : Promise.resolve(null),
      source.npmPackage ? fetchNpmLatestVersion(source.npmPackage) : Promise.resolve(null),
    ]

    const [repoResult, releaseResult, npmResult] = await Promise.allSettled(promises)

    const repoData = repoResult.status === 'fulfilled' ? repoResult.value : null
    const releaseTag = releaseResult.status === 'fulfilled' ? releaseResult.value : null
    const npmVersion = npmResult.status === 'fulfilled' ? npmResult.value : null

    const hasLiveData = repoData !== null || releaseTag !== null || npmVersion !== null

    let resolvedVersion = fallback.version
    if (npmVersion) {
      resolvedVersion = npmVersion
    } else if (releaseTag) {
      resolvedVersion = releaseTag.replace(/^v/, '')
    }

    const liveStats: ProjectLiveStats = {
      id,
      name: fallback.name,
      stars: repoData?.stars ?? null,
      forks: repoData?.forks ?? null,
      version: resolvedVersion,
      releaseTag: releaseTag ?? (resolvedVersion ? `v${resolvedVersion}` : null),
      npmVersion: npmVersion ?? fallback.npmVersion,
      isLive: hasLiveData,
      lastUpdated: hasLiveData ? new Date().toISOString() : null,
      sourceUrls: fallback.sourceUrls,
    }

    memoryCache.set(id, { data: liveStats, timestamp: Date.now() })
    return liveStats
  } catch (error) {
    console.warn(`[live-stats] Error fetching stats for ${id}, using fallback:`, error)
    return fallback
  }
}

/**
 * Get live stats for all systems, returning a record keyed by project ID.
 */
export async function getAllProjectsLiveStats(): Promise<Record<string, ProjectLiveStats>> {
  const result: Record<string, ProjectLiveStats> = {}
  const sourceKeys = Object.keys(LIVE_PROJECT_SOURCES)

  const entries = await Promise.all(
    sourceKeys.map(async (id) => {
      const stats = await getProjectLiveStats(id)
      return [id, stats] as const
    })
  )

  for (const [id, stats] of entries) {
    result[id] = stats
  }

  // Populate remaining systems that don't have public live sources
  for (const sys of systems) {
    if (!result[sys.id]) {
      result[sys.id] = getFallbackStats(sys.id)
    }
  }

  return result
}
