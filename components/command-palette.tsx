'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  Search,
  Layers,
  Briefcase,
  Compass,
  Mail,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Sliders,
  X,
  CornerDownLeft,
  Command,
  Sparkles,
  Cpu,
  Zap,
} from 'lucide-react'
import { useLanguage } from '@/lib/language-context'
import { useLens } from '@/lib/lens-context'

export interface CommandPaletteAction {
  id: string
  title: string
  subtitle?: string
  group: 'navigation' | 'preferences' | 'quickLinks' | 'terminal'
  icon: React.ReactNode
  keywords?: string[]
  badge?: string
  perform: () => void | Promise<void>
}

// Programmatic trigger helper for any component in the app
export function openCommandPalette() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pablorodz:open-palette'))
  }
}

export function CommandPaletteTrigger({ className = '' }: { className?: string }) {
  const { lang } = useLanguage()

  return (
    <button
      type="button"
      onClick={openCommandPalette}
      className={`group flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-md text-xs font-mono border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all cursor-pointer ${className}`}
      aria-label={lang === 'es' ? 'Abrir paleta de comandos (Ctrl+K)' : 'Open command palette (Cmd+K)'}
    >
      <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors shrink-0" />
      <span className="hidden md:inline text-zinc-400 group-hover:text-zinc-200">
        {lang === 'es' ? 'Buscar...' : 'Search...'}
      </span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.08] text-[10px] text-zinc-400 border border-white/[0.08] font-mono">
        <Command className="w-2.5 h-2.5" />
        <span>K</span>
      </kbd>
    </button>
  )
}

export function CommandPalette() {
  const { lang, setLang } = useLanguage()
  const { lens, toggleLens } = useLens()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'info' | 'success' | 'terminal'
    message: string
  } | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const closePalette = useCallback(() => {
    setIsOpen(false)
    setQuery('')
    setSelectedIndex(0)
    setFeedback(null)
  }, [])

  // Listen for global keyboard shortcuts: Cmd+K, Ctrl+K, and '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)

      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        return
      }

      // '/' when not in an input
      if (e.key === '/' && !isInput && !isOpen) {
        e.preventDefault()
        setIsOpen(true)
        return
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault()
        closePalette()
        return
      }
    }

    const handleCustomOpen = () => {
      setIsOpen(true)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('pablorodz:open-palette', handleCustomOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('pablorodz:open-palette', handleCustomOpen)
    }
  }, [isOpen, closePalette])

  // Focus input when opened and lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Scroll to section helper
  const navigateTo = useCallback(
    (selector: string) => {
      closePalette()
      setTimeout(() => {
        const el = document.querySelector(selector)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    },
    [closePalette]
  )

  // Copy email helper
  const handleCopyEmail = useCallback(async () => {
    const email = 'pabjrodriguez@gmail.com'
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setFeedback({
        type: 'success',
        message:
          lang === 'es'
            ? '✓ Email copiado: pabjrodriguez@gmail.com'
            : '✓ Email copied: pabjrodriguez@gmail.com',
      })
      setTimeout(() => {
        setCopied(false)
        closePalette()
      }, 1200)
    } catch {
      window.location.href = `mailto:${email}`
      closePalette()
    }
  }, [lang, closePalette])

  // Actions registry
  const actions: CommandPaletteAction[] = useMemo(() => {
    return [
      // Navigation
      {
        id: 'nav-systems',
        title: lang === 'es' ? 'Ir a Sistemas & Desarrollos' : 'Go to Systems & Projects',
        subtitle: lang === 'es' ? 'gripm, telecom OSS, arquitecturas y demos' : 'gripm, telecom OSS, architectures and demos',
        group: 'navigation',
        icon: <Layers className="w-4 h-4 text-emerald-400" />,
        keywords: ['systems', 'sistemas', 'gripm', 'proyectos', 'projects', 'demos', '#systems'],
        badge: '#systems',
        perform: () => navigateTo('#systems'),
      },
      {
        id: 'nav-chronicle',
        title: lang === 'es' ? 'Ir a Experiencia & Trayectoria' : 'Go to Chronicle & Experience',
        subtitle: lang === 'es' ? 'Telecom Argentina, roles, liderazgo y métricas' : 'Telecom Argentina, leadership and metrics',
        group: 'navigation',
        icon: <Briefcase className="w-4 h-4 text-sky-400" />,
        keywords: ['experience', 'experiencia', 'trayectoria', 'chronicle', 'telecom', '#experience'],
        badge: '#experience',
        perform: () => navigateTo('#experience'),
      },
      {
        id: 'nav-principles',
        title: lang === 'es' ? 'Ir a Principios de Ingeniería' : 'Go to Engineering Principles',
        subtitle: lang === 'es' ? 'Criterios de diseño, arquitectura y producto' : 'Architecture, system design and product criteria',
        group: 'navigation',
        icon: <Compass className="w-4 h-4 text-amber-400" />,
        keywords: ['principles', 'principios', 'engineering', 'arquitectura', '#principles'],
        badge: '#principles',
        perform: () => navigateTo('#principles'),
      },
      {
        id: 'nav-contact',
        title: lang === 'es' ? 'Ir a Contacto & Consultoría' : 'Go to Contact & Advisory',
        subtitle: lang === 'es' ? 'Email directo, agenda y colaboración' : 'Direct email, advisory and partnership',
        group: 'navigation',
        icon: <Mail className="w-4 h-4 text-indigo-400" />,
        keywords: ['contact', 'contacto', 'email', 'hablemos', '#contact', 'hire'],
        badge: '#contact',
        perform: () => navigateTo('#contact'),
      },

      // Preferences
      {
        id: 'pref-toggle-lens',
        title:
          lens === 'product'
            ? lang === 'es'
              ? 'Cambiar a Lente de Arquitectura'
              : 'Switch to Architecture Lens'
            : lang === 'es'
              ? 'Cambiar a Lente de Producto'
              : 'Switch to Product Lens',
        subtitle:
          lens === 'product'
            ? lang === 'es'
              ? 'Ver protocolos, latencias, esquemas y topologías'
              : 'View protocols, latencies, schemas and topologies'
            : lang === 'es'
              ? 'Ver métricas de negocio, valor y problemas resueltos'
              : 'View business metrics, value and problems solved',
        group: 'preferences',
        icon: <Sliders className="w-4 h-4 text-purple-400" />,
        keywords: ['lens', 'lente', 'product', 'arch', 'arquitectura', 'producto', 'toggle'],
        badge: lens === 'product' ? 'PM → ARCH' : 'ARCH → PM',
        perform: () => {
          toggleLens()
          setFeedback({
            type: 'info',
            message:
              lens === 'product'
                ? lang === 'es'
                  ? '📐 Lente cambiada a Arquitectura'
                  : '📐 Lens switched to Architecture'
                : lang === 'es'
                  ? '🎯 Lente cambiada a Producto'
                  : '🎯 Lens switched to Product',
          })
          setTimeout(closePalette, 800)
        },
      },
      {
        id: 'pref-toggle-lang',
        title:
          lang === 'es'
            ? 'Switch language to English'
            : 'Cambiar idioma a Español',
        subtitle:
          lang === 'es'
            ? 'Switch entire portfolio content to English'
            : 'Cambiar todo el contenido del portfolio a Español',
        group: 'preferences',
        icon: <Globe className="w-4 h-4 text-cyan-400" />,
        keywords: ['language', 'idioma', 'english', 'español', 'translate', 'en', 'es'],
        badge: lang === 'es' ? 'ES → EN' : 'EN → ES',
        perform: () => {
          const nextLang = lang === 'es' ? 'en' : 'es'
          setLang(nextLang)
          setFeedback({
            type: 'info',
            message: nextLang === 'en' ? '🌐 Language set to English' : '🌐 Idioma configurado en Español',
          })
          setTimeout(closePalette, 800)
        },
      },

      // Quick Links
      {
        id: 'quick-copy-email',
        title: lang === 'es' ? 'Copiar Email Directo' : 'Copy Direct Email',
        subtitle: 'pabjrodriguez@gmail.com',
        group: 'quickLinks',
        icon: copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />,
        keywords: ['email', 'correo', 'copy', 'copiar', 'pabjrodriguez@gmail.com'],
        badge: 'Clipboard',
        perform: handleCopyEmail,
      },
      {
        id: 'quick-github',
        title: 'GitHub — @pablojavierrodriguez',
        subtitle: lang === 'es' ? 'Repositorios abiertos, código de gripm y agentes' : 'Open-source repositories, gripm codebase and agents',
        group: 'quickLinks',
        icon: <ExternalLink className="w-4 h-4 text-zinc-400" />,
        keywords: ['github', 'gh', 'code', 'repo', 'open source'],
        badge: 'github.com',
        perform: () => {
          window.open('https://github.com/pablojavierrodriguez', '_blank', 'noopener,noreferrer')
          closePalette()
        },
      },
      {
        id: 'quick-linkedin',
        title: 'LinkedIn — Pablo Javier Rodríguez',
        subtitle: lang === 'es' ? 'Perfil profesional, validaciones y red' : 'Professional profile, endorsements and network',
        group: 'quickLinks',
        icon: <ExternalLink className="w-4 h-4 text-sky-400" />,
        keywords: ['linkedin', 'in', 'red', 'cv', 'profile'],
        badge: 'linkedin.com',
        perform: () => {
          window.open('https://linkedin.com/in/pablojavierrodriguez', '_blank', 'noopener,noreferrer')
          closePalette()
        },
      },

      // Terminal / Easter Eggs
      {
        id: 'term-ping',
        title: 'ping',
        subtitle: 'Measure edge runtime latency',
        group: 'terminal',
        icon: <Zap className="w-4 h-4 text-emerald-400" />,
        keywords: ['ping', 'latency', 'edge', 'pong', 'network'],
        badge: 'Terminal',
        perform: () => {
          setFeedback({
            type: 'terminal',
            message: 'Pong! 200 OK · 0ms (Local-first edge runtime)',
          })
        },
      },
      {
        id: 'term-sudo-hire',
        title: 'sudo hire',
        subtitle: 'Elevated priority contact dispatch',
        group: 'terminal',
        icon: <Sparkles className="w-4 h-4 text-amber-400" />,
        keywords: ['sudo', 'hire', 'contract', 'recruiting', 'priority'],
        badge: 'Terminal',
        perform: () => {
          setFeedback({
            type: 'terminal',
            message: 'Priority channel activated. Redirecting to contact desk...',
          })
          setTimeout(() => {
            navigateTo('#contact')
          }, 700)
        },
      },
      {
        id: 'term-sysinfo',
        title: 'sysinfo',
        subtitle: 'Runtime environment & architectural stack',
        group: 'terminal',
        icon: <Cpu className="w-4 h-4 text-indigo-400" />,
        keywords: ['sysinfo', 'stack', 'specs', 'info', 'nextjs', 'turbopack'],
        badge: 'Terminal',
        perform: () => {
          setFeedback({
            type: 'terminal',
            message: 'Next.js 16 Turbo Edge, TypeScript, Lucide, Tailwind 4',
          })
        },
      },
      {
        id: 'term-clear',
        title: 'clear',
        subtitle: 'Clear command line and search buffer',
        group: 'terminal',
        icon: <Terminal className="w-4 h-4 text-zinc-400" />,
        keywords: ['clear', 'cls', 'reset'],
        badge: 'Terminal',
        perform: () => {
          setQuery('')
          setFeedback(null)
          setSelectedIndex(0)
        },
      },
    ]
  }, [lang, lens, copied, toggleLens, setLang, navigateTo, handleCopyEmail, closePalette])

  // Filter actions based on query
  const filteredActions = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return actions

    return actions.filter((action) => {
      const matchTitle = action.title.toLowerCase().includes(q)
      const matchSubtitle = action.subtitle?.toLowerCase().includes(q)
      const matchId = action.id.toLowerCase().includes(q)
      const matchBadge = action.badge?.toLowerCase().includes(q)
      const matchKeywords = action.keywords?.some((k) => k.toLowerCase().includes(q))
      return matchTitle || matchSubtitle || matchId || matchBadge || matchKeywords
    })
  }, [actions, query])

  // Handle arrow navigation and enter execution in the search input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (filteredActions.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (filteredActions.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const cleanQ = query.trim().toLowerCase()
      // Direct exact match for terminal shortcuts even if selection differs
      if (cleanQ === 'ping') {
        actions.find((a) => a.id === 'term-ping')?.perform()
        return
      }
      if (cleanQ === 'sudo hire') {
        actions.find((a) => a.id === 'term-sudo-hire')?.perform()
        return
      }
      if (cleanQ === 'sysinfo') {
        actions.find((a) => a.id === 'term-sysinfo')?.perform()
        return
      }
      if (cleanQ === 'clear') {
        actions.find((a) => a.id === 'term-clear')?.perform()
        return
      }

      const selected = filteredActions[selectedIndex]
      if (selected) {
        selected.perform()
      }
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const activeEl = listRef.current?.querySelector('[data-selected="true"]')
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (!isOpen) return null

  // Group translations
  const groupLabels: Record<CommandPaletteAction['group'], { es: string; en: string }> = {
    navigation: { es: 'Navegación', en: 'Navigation' },
    preferences: { es: 'Preferencias & Vistas', en: 'Preferences' },
    quickLinks: { es: 'Acciones Rápidas', en: 'Quick Links' },
    terminal: { es: 'Comandos de Terminal & Easter Eggs', en: 'Terminal & Easter Eggs' },
  }

  // Group the filtered actions preserving original order
  const groupedActions = filteredActions.reduce<Record<string, CommandPaletteAction[]>>((acc, action) => {
    if (!acc[action.group]) acc[action.group] = []
    acc[action.group].push(action)
    return acc
  }, {})

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'es' ? 'Paleta de Comandos de Pablo Rodríguez' : 'Pablo Rodriguez Command Palette'}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-4 animate-in fade-in duration-200"
    >
      {/* Mineral Backdrop Blur */}
      <div
        onClick={closePalette}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-xl bg-[#0d0f14] border border-white/10 rounded-2xl shadow-2xl shadow-black/90 overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleInputKeyDown}
            placeholder={
              lang === 'es'
                ? 'Escribí un comando o buscá (ej: sistemas, ping, sudo hire)...'
                : 'Type a command or search (e.g., systems, ping, sudo hire)...'
            }
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none font-sans"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setSelectedIndex(0)
              }}
              className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label="Clear query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd
            onClick={closePalette}
            className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono text-zinc-400 bg-white/[0.06] border border-white/[0.08] cursor-pointer hover:bg-white/[0.1] hover:text-white transition-colors"
          >
            ESC
          </kbd>
        </div>

        {/* Live Feedback / Terminal Output Banner */}
        {feedback && (
          <div
            className={`px-4 py-2.5 text-xs font-mono flex items-center justify-between border-b ${
              feedback.type === 'terminal'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : feedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                  : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold">
                {feedback.type === 'terminal' ? 'λ' : 'ℹ'}
              </span>
              <span>{feedback.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Action List */}
        <div
          ref={listRef}
          className="max-h-[60vh] sm:max-h-[380px] overflow-y-auto divide-y divide-white/[0.03] p-2 space-y-1"
        >
          {filteredActions.length === 0 ? (
            <div className="py-10 text-center font-mono text-xs text-zinc-500">
              {lang === 'es'
                ? `No se encontraron comandos para "${query}"`
                : `No commands found for "${query}"`}
            </div>
          ) : (
            Object.entries(groupedActions).map(([groupKey, groupItems]) => {
              const group = groupKey as CommandPaletteAction['group']
              return (
                <div key={group} className="pt-2 first:pt-0">
                  <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 select-none">
                    {groupLabels[group][lang]}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {groupItems.map((action) => {
                      const overallIndex = filteredActions.indexOf(action)
                      const isSelected = overallIndex === selectedIndex

                      return (
                        <div
                          key={action.id}
                          data-selected={isSelected}
                          onClick={() => {
                            setSelectedIndex(overallIndex)
                            action.perform()
                          }}
                          onMouseEnter={() => setSelectedIndex(overallIndex)}
                          className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 select-none ${
                            isSelected
                              ? 'bg-white/[0.08] text-white shadow-sm border border-white/10'
                              : 'text-zinc-300 hover:bg-white/[0.04] border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="shrink-0 p-1 rounded-lg bg-black/40 border border-white/5">
                              {action.icon}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-medium text-white flex items-center gap-2 truncate">
                                <span>{action.title}</span>
                              </div>
                              {action.subtitle && (
                                <p className="text-[11px] text-zinc-400 truncate">
                                  {action.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {action.badge && (
                              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-zinc-400 border border-white/5">
                                {action.badge}
                              </span>
                            )}
                            {isSelected && (
                              <CornerDownLeft className="w-3.5 h-3.5 text-zinc-400" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Mineral Status Footer */}
        <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono text-zinc-500 select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-zinc-400">↑↓</kbd>
              <span className="hidden sm:inline">{lang === 'es' ? 'Navegar' : 'Navigate'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-zinc-400">↵</kbd>
              <span className="hidden sm:inline">{lang === 'es' ? 'Ejecutar' : 'Run'}</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-white/[0.06] text-zinc-400">esc</kbd>
              <span className="hidden sm:inline">{lang === 'es' ? 'Cerrar' : 'Close'}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-zinc-600">LENS:</span>
            <span className={lens === 'product' ? 'text-emerald-400' : 'text-indigo-400'}>
              {lens.toUpperCase()}
            </span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-600">LANG:</span>
            <span className="text-zinc-300">{lang.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
