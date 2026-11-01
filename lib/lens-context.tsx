'use client'

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'

export type Lens = 'product' | 'arch'

interface LensContextType {
  lens: Lens
  setLens: (lens: Lens) => void
  toggleLens: () => void
}

const LensContext = createContext<LensContextType | undefined>(undefined)

function getLensSnapshot(): Lens {
  if (typeof window === 'undefined') return 'product'
  const saved = localStorage.getItem('pablorodz_lens') as Lens | null
  if (saved === 'product' || saved === 'arch') return saved
  return 'product'
}

function getLensServerSnapshot(): Lens {
  return 'product'
}

let listeners: Array<() => void> = []

function subscribe(callback: () => void) {
  listeners.push(callback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === 'pablorodz_lens') callback()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners = listeners.filter((l) => l !== callback)
    window.removeEventListener('storage', onStorage)
  }
}

export function LensProvider({ children }: { children: ReactNode }) {
  const lens = useSyncExternalStore(
    subscribe,
    getLensSnapshot,
    getLensServerSnapshot
  )

  const setLens = (l: Lens) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pablorodz_lens', l)
      for (const listener of listeners) {
        listener()
      }
    }
  }

  const toggleLens = () => {
    setLens(lens === 'product' ? 'arch' : 'product')
  }

  return (
    <LensContext.Provider value={{ lens, setLens, toggleLens }}>
      {children}
    </LensContext.Provider>
  )
}

export function useLens() {
  const ctx = useContext(LensContext)
  if (!ctx) {
    return {
      lens: 'arch' as Lens,
      setLens: () => {},
      toggleLens: () => {},
    }
  }
  return ctx
}
