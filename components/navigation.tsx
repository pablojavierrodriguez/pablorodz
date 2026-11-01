'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'
import { LanguageSwitcher } from '@/components/language-switcher'
import { profile } from '@/lib/content'

export function Navigation() {
  const { lang } = useLanguage()
  const [activeSection, setActiveSection] = useState<string>('')
  const [scrolled, setScrolled] = useState(false)

  const links = [
    { href: '#systems', id: 'systems', label: t(lang, 'nav.systems') },
    { href: '#experience', id: 'experience', label: t(lang, 'nav.chronicle') },
    { href: '#principles', id: 'principles', label: t(lang, 'nav.principles') },
    { href: '#contact', id: 'contact', label: t(lang, 'nav.contact') },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15)

      const sectionIds = ['systems', 'experience', 'principles', 'contact']
      const scrollPosition = window.scrollY + 160

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

      if (window.scrollY < 200) {
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
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
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
      <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          onClick={(e) => {
            if (typeof window !== 'undefined') {
              e.preventDefault()
              setActiveSection('')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className="flex items-center gap-1 group cursor-pointer"
          aria-label="Home"
        >
          <span className="font-mono text-sm font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
            /{profile.handle}
          </span>
        </Link>

        {/* Nav Links with ScrollSpy pill */}
        <nav className="hidden md:flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          {links.map((l) => {
            const isActive = activeSection === l.id
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => handleLinkClick(e, l.href, l.id)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer ${
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

        {/* Right: status + lang + CTA */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t(lang, 'status.available')}
          </span>
          <LanguageSwitcher />
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, '#contact', 'contact')}
            className="px-3.5 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-semibold hover:bg-zinc-200 transition-all duration-200 cursor-pointer shadow-sm hover:shadow"
          >
            {t(lang, 'nav.contact')}
          </a>
        </div>
      </div>
    </header>
  )
}
