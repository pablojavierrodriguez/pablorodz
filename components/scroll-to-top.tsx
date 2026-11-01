'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'

export function ScrollToTop() {
  const { lang } = useLanguage()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      aria-label={lang === 'es' ? 'Volver al inicio' : 'Return to top'}
      className="fixed bottom-6 right-6 z-40 p-2.5 sm:px-3 sm:py-2 rounded-xl bg-[#141820]/90 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:border-white/25 hover:bg-[#1a202c] shadow-xl shadow-black/40 transition-all duration-300 flex items-center gap-1.5 cursor-pointer group hover:-translate-y-0.5"
    >
      <span className="text-xs transition-transform duration-200 group-hover:-translate-y-0.5">↑</span>
      <span className="text-[11px] font-mono hidden sm:inline text-zinc-400 group-hover:text-zinc-200">
        {lang === 'es' ? 'Inicio' : 'Top'}
      </span>
    </button>
  )
}
