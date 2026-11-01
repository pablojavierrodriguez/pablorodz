'use client'

import { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}
import { useLanguage } from '@/lib/language-context'
import {
  Activity,
  Clock,
  Radio,
  GitBranch,
  Zap,
  ShieldCheck,
  Layers,
  Users,
  ChevronUp,
  ChevronDown,
  X,
  Server,
  CheckCircle2,
} from 'lucide-react'

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
  const [hour, setHour] = useState<number>(12)
  const [ping, setPing] = useState<number>(14)
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const drawerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Real-time Buenos Aires clock (ART, UTC-3)
  useEffect(() => {
    const updateClock = () => {
      const { timeString, hour: h } = getBuenosAiresTime()
      setTime(timeString)
      setHour(h)
    }

    updateClock()
    const clockInterval = setInterval(updateClock, 1000)

    // Subtle ping oscillation (12ms - 16ms) to simulate real-time edge telemetry
    const pingInterval = setInterval(() => {
      setPing(Math.floor(12 + Math.random() * 5))
    }, 3500)

    return () => {
      clearInterval(clockInterval)
      clearInterval(pingInterval)
    }
  }, [])

  // Close popover when clicking outside or pressing Escape
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

  // Operational status description by Buenos Aires hour
  const getOperationalStatus = () => {
    if (hour >= 9 && hour < 19) {
      return {
        label: lang === 'es' ? 'Trabajando · Arquitectura Profunda' : 'Working · Deep Architecture',
        statusKey: 'active',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
      }
    } else if (hour >= 19 && hour < 24) {
      return {
        label: lang === 'es' ? 'Modo Asíncrono · Proyectos OSS' : 'Async Mode · Incubating OSS',
        statusKey: 'async',
        color: 'text-indigo-400',
        badgeBg: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
      }
    } else {
      return {
        label: lang === 'es' ? 'Modo Asíncrono · Daemons Activos' : 'Async Mode · Autonomous Daemons',
        statusKey: 'night',
        color: 'text-cyan-400',
        badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
      }
    }
  }

  const opStatus = getOperationalStatus()

  return (
    <>
      {/* ─── FIXED NOC TELEMETRY BAR ────────────────────────────────────── */}
      <aside
        aria-label={lang === 'es' ? 'Barra de telemetría y estado de sistemas' : 'Telemetry and systems status bar'}
        className="fixed bottom-0 inset-x-0 z-40 h-8 sm:h-9 bg-[#080a0f]/95 backdrop-blur-md border-t border-white/[0.08] text-[11px] font-mono text-zinc-400 select-none shadow-[0_-4px_24px_rgba(0,0,0,0.6)]"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-full flex items-center justify-between gap-3">
          
          {/* LEFT: Live Radar Dot + Nominal Status + Edge Tag + Git Branch */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Active Pulsating Radar Dot */}
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 py-0.5 px-1.5 rounded-md hover:bg-white/[0.04] transition-colors cursor-pointer group"
              title={lang === 'es' ? 'Ver telemetría y métricas operacionales' : 'View operational telemetry & metrics'}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-400 tracking-wider text-[10px] sm:text-[11px]">
                <span className="hidden sm:inline">{lang === 'es' ? 'SISTEMAS NOMINALES' : 'SYSTEMS NOMINAL'}</span>
                <span className="sm:hidden">{lang === 'es' ? 'NOMINAL' : 'NOMINAL'}</span>
              </span>
            </button>

            <span className="text-zinc-700 hidden sm:inline">|</span>

            {/* Next.js 16 Turbo Edge Badge */}
            <div className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-zinc-300 text-[10px]">
              <span className="text-[10px] text-zinc-100 font-bold">▲</span>
              <span>Next.js 16 Turbo Edge</span>
            </div>

            {/* Git Commit Tag */}
            <div className="hidden lg:inline-flex items-center gap-1 text-zinc-500 text-[10px]">
              <GitBranch className="w-3 h-3 text-zinc-400" />
              <span>main@production</span>
            </div>
          </div>

          {/* RIGHT: Live Buenos Aires Clock + Latency Ping + Popover Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Buenos Aires Clock */}
            <div
              className="inline-flex items-center gap-1.5 text-zinc-300 text-[10px] sm:text-[11px]"
              title={lang === 'es' ? 'Hora local en Buenos Aires, Argentina (ART, UTC-3)' : 'Local time in Buenos Aires, Argentina (ART, UTC-3)'}
            >
              <Clock className="w-3 h-3 text-zinc-500 shrink-0 hidden xs:inline" />
              <span className="font-semibold text-white tracking-tight">
                {mounted ? time : '22:26:00'}
              </span>
              <span className="text-zinc-500 text-[10px]">ART</span>
              <span className="hidden xl:inline text-zinc-600">·</span>
              <span className={`hidden xl:inline text-[10px] ${opStatus.color}`}>
                {opStatus.label}
              </span>
            </div>

            <span className="text-zinc-700 hidden xs:inline">|</span>

            {/* Simulated Edge Ping */}
            <div
              className="hidden sm:inline-flex items-center gap-1 text-[10px] text-zinc-400 font-mono"
              title={lang === 'es' ? 'Latencia simulada de edge local' : 'Simulated local edge latency'}
            >
              <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" />
              <span>{ping}ms</span>
            </div>

            {/* Popover / Drawer Toggle Trigger */}
            <button
              ref={triggerRef}
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="telemetry-popover"
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                isOpen
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
              }`}
            >
              <Activity className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="hidden sm:inline">
                {lang === 'es' ? 'Telemetría de Arquitectura' : 'Architecture & Telecom Telemetry'}
              </span>
              <span className="sm:hidden">
                {lang === 'es' ? 'Telemetría' : 'Telemetry'}
              </span>
              {isOpen ? (
                <ChevronDown className="w-3 h-3 ml-0.5 text-zinc-400" />
              ) : (
                <ChevronUp className="w-3 h-3 ml-0.5 text-zinc-400" />
              )}
            </button>
          </div>

        </div>
      </aside>

      {/* ─── TELEMETRY POPOVER / DRAWER ─────────────────────────────────── */}
      {isOpen && (
        <div
          id="telemetry-popover"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'es' ? 'Panel de Telemetría y Operaciones Telecom' : 'Architecture and Telecom Telemetry Dashboard'}
          className="fixed bottom-10 sm:bottom-11 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[520px] md:w-[580px] max-h-[85vh] overflow-y-auto rounded-2xl bg-[#090b10]/95 backdrop-blur-xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-5 animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3.5 border-b border-white/[0.08]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  {lang === 'es' ? 'TELEMETRÍA DE OPERACIONES EN VIVO' : 'LIVE OPERATIONS TELEMETRY'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">· Node BUE-DC1</span>
              </div>
              <h3 className="font-semibold text-sm text-white">
                {lang === 'es' ? 'Arquitectura & Telemetría Telecom' : 'Architecture & Telecom Telemetry'}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {lang === 'es'
                  ? 'Huella de producción a escala enterprise y señales en tiempo real.'
                  : 'Enterprise production scale and real-time operational signals.'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              aria-label={lang === 'es' ? 'Cerrar telemetría' : 'Close telemetry'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 4 Pedigree Cards Grid */}
          <div className="grid sm:grid-cols-2 gap-3 py-4">
            
            {/* Card 1: Telecom Scale */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-1.5 text-zinc-400">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  {lang === 'es' ? 'Escala Telecom' : 'Telecom Scale'}
                </span>
              </div>
              <p className="text-sm font-semibold text-white font-mono leading-tight">
                3,500+ Operations Users · 130k+ Incidents/mo
              </p>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                {lang === 'es'
                  ? 'Operaciones críticas de red telecom coordinadas en BMC Helix ITSM + NetOps sin disrupciones.'
                  : 'Mission-critical telecom network operations coordinated on BMC Helix ITSM + NetOps.'}
              </p>
            </div>

            {/* Card 2: Availability SLA */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-1.5 text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  {lang === 'es' ? 'Disponibilidad SLA' : 'Availability SLA'}
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-300 font-mono leading-tight">
                99.98% Managed Critical Services
              </p>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                {lang === 'es'
                  ? 'Resiliencia operacional continua y cero caídas no planificadas durante migraciones mayores.'
                  : 'Continuous operational resilience with zero unplanned outages across major migrations.'}
              </p>
            </div>

            {/* Card 3: Protocol Stack */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-1.5 text-zinc-400">
                <Layers className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  {lang === 'es' ? 'Stack de Protocolos' : 'Protocol Stack'}
                </span>
              </div>
              <p className="text-xs font-semibold text-white font-mono leading-snug">
                MCP JSON-RPC · BMC Helix NetOps · Next.js 16
              </p>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                {lang === 'es'
                  ? 'Integración de agentes autónomos vía MCP, gobernanza ITIL empresarial y React 19 Edge.'
                  : 'Multi-agent orchestration via MCP, enterprise ITIL governance, and React 19 Edge runtime.'}
              </p>
            </div>

            {/* Card 4: Local Latency */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
              <div className="flex items-center gap-2 mb-1.5 text-zinc-400">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                  {lang === 'es' ? 'Latencia Local' : 'Local Latency'}
                </span>
              </div>
              <p className="text-sm font-semibold text-cyan-300 font-mono leading-tight flex items-center gap-2">
                <span>Local-first edge: {ping}ms</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
                  sub-20ms
                </span>
              </p>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                {lang === 'es'
                  ? 'Arquitectura orientada a soberanía local-first, tiempos de respuesta ultra rápidos y cero vendor lock-in.'
                  : 'Sovereign local-first architecture, ultra-fast client-side execution, and zero vendor lock-in.'}
              </p>
            </div>

          </div>

          {/* Node & Schedule Status Banner */}
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-400">
              <Server className="w-3.5 h-3.5 text-zinc-500" />
              <span>Node: <strong className="text-white">Buenos Aires (ART · UTC-3)</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] px-2 py-0.5 rounded border ${opStatus.badgeBg}`}>
                {opStatus.label}
              </span>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'es' ? 'Todos los subsistemas operacionales nominales' : 'All operational subsystems nominal'}</span>
            </div>
            <span className="text-zinc-600">v1.0 · NOC Edition</span>
          </div>
        </div>
      )}
    </>
  )
}
