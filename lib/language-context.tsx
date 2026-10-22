'use client'

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react'
import type { Language } from '@/lib/translations'

interface LanguageContextType {
  lang: Language
  setLang: (l: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getLanguageSnapshot(): Language {
  if (typeof window === 'undefined') return 'es'
  const saved = localStorage.getItem('lang') as Language | null
  if (saved === 'es' || saved === 'en') return saved
  return navigator.language.startsWith('en') ? 'en' : 'es'
}

function getLanguageServerSnapshot(): Language {
  return 'es'
}

let listeners: Array<() => void> = []

function subscribe(callback: () => void) {
  listeners.push(callback)
  const onStorage = (e: StorageEvent) => {
    if (e.key === 'lang') callback()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners = listeners.filter((l) => l !== callback)
    window.removeEventListener('storage', onStorage)
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(
    subscribe,
    getLanguageSnapshot,
    getLanguageServerSnapshot
  )

  const setLang = (l: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', l)
      document.documentElement.lang = l
      for (const listener of listeners) {
        listener()
      }
    }
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
