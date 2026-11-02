'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'
import { LanguageSwitcher } from '@/components/language-switcher'
import { profile } from '@/lib/content'

export function Navigation() {
  const { lang } = useLanguage()
  const [activeSection, setActiveSection] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const links = [
    { href: '#systems', id: 'systems', label: t(lang, 'nav.systems') },
    { href: '#experience', id: 'experience', label: t(lang, 'nav.chronicle') },
    { href: '#principles', id: 'principles', label: t(lang, 'nav.principles') },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)

      const sectionIds = ['systems', 'experience', 'principles', 'contact']
      const scrollPosition = window.scrollY + 120

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id)
            return
          }
        }
      }

      if (window.scrollY < 180) {
        setActiveSection('')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault()
    setActiveSection(id)
    setMobileMenuOpen(false)

    const target = document.querySelector(href) as HTMLElement | null
    if (target) {
      // Find the inner heading or title for pixel-perfect positioning right below header
      const heading = target.querySelector('h2') || target
      const topOffset = heading.getBoundingClientRect().top + window.scrollY - 104
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b backdrop-blur-xl ${
        scrolled
          ? 'border-white/[0.08] bg-[#0d0f14]/90 shadow-lg shadow-black/25'
          : 'border-white/[0.04] bg-[#0d0f14]/75'
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center shrink-0">
          <Link
            href="/"
            onClick={(e) => {
              if (typeof window !== 'undefined') {
                e.preventDefault()
                setActiveSection('')
                setMobileMenuOpen(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            className="flex items-center gap-1.5 group cursor-pointer py-1"
            aria-label="Home"
          >
            <span className="font-mono text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
              /{profile.handle}
            </span>
          </Link>
        </div>

        {/* Center: Editorial Nav Links (Clean, minimal, centered) */}
        <nav className="hidden md:flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          {links.map((l) => {
            const isActive = activeSection === l.id
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleLinkClick(e, l.href, l.id)}
                className={`relative px-3.5 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer text-center min-w-[5.25rem] ${
                  isActive
                    ? 'text-white bg-white/[0.08] shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {l.label}
              </a>
            )
          })}
        </nav>

        {/* Right: Language Switcher + Direct Contact CTA */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <LanguageSwitcher />

          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact', 'contact')}
            className={`hidden sm:inline-block px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm whitespace-nowrap ${
              activeSection === 'contact'
                ? 'bg-emerald-400 text-zinc-950 hover:bg-emerald-300'
                : 'bg-white text-zinc-900 hover:bg-zinc-200 hover:shadow'
            }`}
          >
            {t(lang, 'nav.contact')}
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0d0f14]/95 backdrop-blur-2xl px-5 py-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex flex-col gap-1">
            {links.map((l) => {
              const isActive = activeSection === l.id
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleLinkClick(e, l.href, l.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white bg-white/[0.08] font-semibold'
                      : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {l.label}
                </a>
              )
            })}
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, '#contact', 'contact')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeSection === 'contact'
                  ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {t(lang, 'nav.contact')}
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
