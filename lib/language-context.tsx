'use client'

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from 'react'
import type { Language } from '@/lib/translations'

interface LanguageContextType {
  lang: Language
  setLang: (l: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'))
  return match ? decodeURIComponent(match[2]) : null
}

function getLanguageSnapshot(): Language {
  if (typeof window === 'undefined') return 'es'
  const urlLang = new URLSearchParams(window.location.search).get('lang')
  if (urlLang === 'es' || urlLang === 'en') return urlLang
  const cookieLang = getCookie('lang')
  if (cookieLang === 'es' || cookieLang === 'en') return cookieLang
  const saved = localStorage.getItem('lang') as Language | null
  if (saved === 'es' || saved === 'en') return saved
  return navigator.language.startsWith('en') ? 'en' : 'es'
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

export function LanguageProvider({
  children,
  initialLang = 'es',
}: {
  children: ReactNode
  initialLang?: Language
}) {
  const lang = useSyncExternalStore(
    subscribe,
    getLanguageSnapshot,
    () => initialLang
  )

  useEffect(() => {
    document.documentElement.lang = lang
    document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`
  }, [lang])

  const setLang = (l: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', l)
      document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`
      const url = new URL(window.location.href)
      if (url.searchParams.has('lang')) {
        url.searchParams.set('lang', l)
        window.history.replaceState({}, '', url.toString())
      }
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
