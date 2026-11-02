'use client'

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react'
import { useLanguage } from '@/lib/language-context'
import {
  Clock,
  Layers,
  ChevronUp,
  ChevronDown,
  X,
  ExternalLink,
} from 'lucide-react'
import { profile } from '@/lib/content'
import { LensSwitcher } from '@/components/lens-switcher'
import { CommandPaletteTrigger } from '@/components/command-palette'

const emptySubscribe = () => () => {}

function getBuenosAiresTime(): { timeString: string; hour: number } {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(now)
  const hourPart = parts.find((p) => p.type === 'hour')
  const minutePart = parts.find((p) => p.type === 'minute')
  const secondPart = parts.find((p) => p.type === 'second')
  const hour = parseInt(hourPart?.value ?? '0', 10)
  const timeString = `${hourPart?.value ?? '00'}:${minutePart?.value ?? '00'}:${secondPart?.value ?? '00'}`
  return { timeString, hour }
}

export function TelemetryBar() {
  const { lang } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [time, setTime] = useState<string>('00:00:00')
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Real-time Buenos Aires clock (ART, UTC-3)
  useEffect(() => {
    const updateClock = () => {
      const { timeString } = getBuenosAiresTime()
      setTime(timeString)
    }

    updateClock()
    const clockInterval = setInterval(updateClock, 1000)
    return () => clearInterval(clockInterval)
  }, [])

  // Close drawer when pressing Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    },
    [isOpen]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Close drawer when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <>
      {/* ─── FIXED COCKPIT STATUS & CONTROL BAR ─────────────────────────── */}
      <aside
        aria-label={lang === 'es' ? 'Barra de estado y controles del sistema' : 'System status and controls bar'}
        className="fixed bottom-0 inset-x-0 z-40 h-9 sm:h-10 bg-[#080a0f]/95 backdrop-blur-md border-t border-white/[0.08] text-[11px] font-mono text-zinc-400 select-none shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-full flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LEFT: Availability indicator (The single definitive source of availability!) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex items-center gap-1.5 py-0.5 text-zinc-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-400 tracking-wider text-[10px] sm:text-[11px] whitespace-nowrap">
                <span className="hidden sm:inline">
                  {lang === 'es' ? 'DISPONIBLE PARA PROYECTOS' : 'AVAILABLE FOR PROJECTS'}
                </span>
                <span className="sm:hidden">
                  {lang === 'es' ? 'DISPONIBLE' : 'AVAILABLE'}
                </span>
              </span>
            </div>
          </div>

          {/* CENTER: Master Perspective Lens Switcher (Clean cockpit positioning!) */}
          <div className="flex items-center justify-center shrink-0">
            <LensSwitcher />
          </div>

          {/* RIGHT: Quick Command Palette Trigger + Buenos Aires Clock + Specs Drawer Trigger */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Command Palette Trigger */}
            <CommandPaletteTrigger className="h-7 px-2" />

            <span className="text-zinc-700 hidden sm:inline">|</span>

            {/* Buenos Aires Clock */}
            <div
              className="hidden xs:inline-flex items-center gap-1.5 text-zinc-300 text-[10px] sm:text-[11px]"
              title={lang === 'es' ? 'Hora local en Buenos Aires, Argentina (ART, UTC-3)' : 'Local time in Buenos Aires, Argentina (ART, UTC-3)'}
            >
              <Clock className="w-3 h-3 text-zinc-500 shrink-0" />
              <span className="font-semibold text-white tracking-tight">
                {mounted ? time : '17:00:00'}
              </span>
              <span className="text-zinc-500 text-[10px]">ART</span>
            </div>

            <span className="text-zinc-700 hidden md:inline">|</span>

            {/* Popover / Drawer Toggle Trigger: Minimalist Specs button */}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="specs-popover"
              className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-mono transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isOpen
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
              }`}
            >
              <Layers className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">
                {lang === 'es' ? 'Ficha Técnica' : 'Site Specs'}
              </span>
              {isOpen ? (
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              ) : (
                <ChevronUp className="w-3 h-3 text-zinc-400" />
              )}
            </button>
          </div>

        </div>
      </aside>

      {/* ─── MINIMALIST & PROPORTIONAL SPECIFICATIONS CAPSULE ─────────────── */}
      {isOpen && (
        <div
          id="specs-popover"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'es' ? 'Ficha Técnica y Arquitectura del Sitio' : 'Site Architecture and Technical Specs'}
          className="fixed bottom-11 sm:bottom-12 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[390px] rounded-xl bg-[#0a0d13]/95 backdrop-blur-xl border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.7)] p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono font-bold text-white tracking-tight">
                pablorodz.com
              </span>
              <span className="text-[10px] font-mono text-zinc-500">
                · {lang === 'es' ? 'Ficha Técnica' : 'Site Specs'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-xs"
              aria-label={lang === 'es' ? 'Cerrar ficha técnica' : 'Close technical specs'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimalist Specs Rows */}
          <div className="py-3 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-500">Framework</span>
              <span className="text-zinc-200 font-medium">Next.js 16 · React 19</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-500">Tipado</span>
              <span className="text-zinc-200 font-medium">TypeScript 5.7 (Strict)</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-500">Design System</span>
              <span className="text-zinc-200 font-medium">Tailwind CSS v4 · Geist</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-500">Privacidad</span>
              <span className="text-emerald-400 font-medium">100% Local-first · 0 Trackers</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-500">SLA Contacto</span>
              <span className="text-cyan-300 font-medium">&lt; 24hs · Canal Directo</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-zinc-500">Base</span>
              <span className="text-zinc-200 font-medium">Buenos Aires (ART · UTC-3)</span>
            </div>
          </div>

          {/* Minimalist Footer Link */}
          <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
            <span className="text-zinc-500">
              {lang === 'es' ? 'Código auditado en Git' : 'Audited code in Git'}
            </span>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
