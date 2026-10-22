'use client'

import { useState } from 'react'

interface TopologyNode {
  title: string
  subtitle?: string
  badge?: string
  type: 'client' | 'protocol' | 'engine' | 'storage' | 'gate' | 'ui'
}

interface TopologyStep {
  from: TopologyNode
  to?: TopologyNode
  contract?: string
  bidirectional?: boolean
}

interface StructuredTopology {
  systemId: string
  title: { es: string; en: string }
  description: { es: string; en: string }
  steps: TopologyStep[]
}

const TOPOLOGIES: Record<string, StructuredTopology> = {
  gripm: {
    systemId: 'gripm',
    title: {
      es: 'Arquitectura de Orquestación Local-First & MCP',
      en: 'Local-First & MCP Orchestration Architecture',
    },
    description: {
      es: 'Protocolo de comunicación entre agentes de IA y el backlog local sin salir a la nube.',
      en: 'Communication protocol between AI agents and local backlog without cloud exposure.',
    },
    steps: [
      {
        from: {
          title: 'AI Agent / IDE Host',
          subtitle: 'Cursor, Claude Code, Antigravity, Headless Agents',
          badge: 'Consumer',
          type: 'client',
        },
        to: {
          title: 'Gripm CLI Daemon',
          subtitle: 'Local JSON-RPC endpoint & FS Watcher engine',
          badge: 'Core Gateway',
          type: 'engine',
        },
        contract: 'Model Context Protocol (JSON-RPC / stdio)',
        bidirectional: true,
      },
      {
        from: {
          title: 'Gripm CLI Daemon',
          subtitle: 'Bi-directional state reconciliation & disk sync',
          badge: 'Sync Engine',
          type: 'engine',
        },
        to: {
          title: 'Local Git Repo (.md)',
          subtitle: 'Sovereign markdown backlog versioned with code',
          badge: 'Storage',
          type: 'storage',
        },
        contract: 'Local Filesystem Events (fs.watch)',
        bidirectional: true,
      },
      {
        from: {
          title: 'Gripm CLI Daemon',
          subtitle: 'Serves real-time state to localhost',
          badge: 'Sync Engine',
          type: 'engine',
        },
        to: {
          title: 'React 18 Web Cockpit',
          subtitle: 'Local UI on localhost:4100 with zero cloud dependency',
          badge: 'UI Surface',
          type: 'ui',
        },
        contract: 'WebSocket / Local HTTP :4100',
        bidirectional: true,
      },
    ],
  },
  'gripm-playbook': {
    systemId: 'gripm-playbook',
    title: {
      es: 'Cadena de Gobernanza y Handoff Multi-Agente',
      en: 'Multi-Agent Handoff & Governance Chain',
    },
    description: {
      es: 'Ciclo adaptativo con contratos formales de entrega y compuertas de auditoría estricta.',
      en: 'Adaptive lifecycle with formal handoff contracts and strict audit gates.',
    },
    steps: [
      {
        from: {
          title: '01. PM Orchestrator',
          subtitle: 'Desglose funcional, criterios de aceptación Gherkin y alcance',
          badge: 'Strategy',
          type: 'client',
        },
        to: {
          title: '02. Principal Engineer',
          subtitle: 'Diseño de arquitectura, interfaces de tipos e implementación',
          badge: 'Build',
          type: 'engine',
        },
        contract: 'Contrato de Handoff Formal (Spec & Acceptance Criteria)',
        bidirectional: false,
      },
      {
        from: {
          title: '02. Principal Engineer',
          subtitle: 'Entrega de artefactos compilables y suite de tests',
          badge: 'Build',
          type: 'engine',
        },
        to: {
          title: '03. Rigorous QA Auditor',
          subtitle: 'Auditoría de regresión, edge-cases, seguridad y tipos',
          badge: 'Audit Gate',
          type: 'gate',
        },
        contract: 'Compuerta de Calidad (Quality Gate / Pre-merge Checks)',
        bidirectional: false,
      },
      {
        from: {
          title: '03. Rigorous QA Auditor',
          subtitle: 'Validación técnica aprobada → pase a usabilidad',
          badge: 'Audit Gate',
          type: 'gate',
        },
        to: {
          title: '04. UX Designer Gate',
          subtitle: 'Evaluación heurística de interfaces, accesibilidad y copy',
          badge: 'Review Loop',
          type: 'ui',
        },
        contract: 'Bucle de Retroalimentación Iterativa (Review Feedback Loop)',
        bidirectional: true,
      },
    ],
  },
  c3admin: {
    systemId: 'c3admin',
    title: {
      es: 'Topología Multi-Tenant Empresarial con Aislamiento',
      en: 'Enterprise Multi-Tenant Topology with Isolation',
    },
    description: {
      es: 'Aislamiento estricto de clientes en edge y base de datos con registro inmutable.',
      en: 'Strict tenant isolation at edge and database layer with immutable audit log.',
    },
    steps: [
      {
        from: {
          title: 'Next.js App Router Edge',
          subtitle: 'Resolución de subdominios y headers de tenant',
          badge: 'Edge Ingress',
          type: 'client',
        },
        to: {
          title: 'RBAC & Tenant Middleware',
          subtitle: 'Validación criptográfica de sesión y alcance de permisos',
          badge: 'Security Gate',
          type: 'gate',
        },
        contract: 'JWT Scopes + Tenant Boundary Check',
        bidirectional: false,
      },
      {
        from: {
          title: 'RBAC & Tenant Middleware',
          subtitle: 'Tráfico autenticado y asignado al esquema correspondiente',
          badge: 'Security Gate',
          type: 'gate',
        },
        to: {
          title: 'Business Logic Routes',
          subtitle: 'Operaciones de dominio tipadas sin ORM intermedio',
          badge: 'Core Services',
          type: 'engine',
        },
        contract: 'Strict Schema-Scoped Execution Context',
        bidirectional: false,
      },
      {
        from: {
          title: 'Business Logic Routes',
          subtitle: 'Eventos de mutación críticos',
          badge: 'Core Services',
          type: 'engine',
        },
        to: {
          title: 'PostgreSQL Multi-Schema + Event Stream',
          subtitle: 'Aislamiento físico por esquema y registro inmutable para auditoría',
          badge: 'Data Layer',
          type: 'storage',
        },
        contract: 'Postgres Schema Search Path + Immutable Audit Webhooks',
        bidirectional: true,
      },
    ],
  },
  dom: {
    systemId: 'dom',
    title: {
      es: 'Motor Zero-Knowledge de Partida Doble en el Cliente',
      en: 'Client-Side Zero-Knowledge Double-Entry Engine',
    },
    description: {
      es: 'Toda la criptografía se ejecuta en el navegador. El servidor nunca recibe datos en claro.',
      en: 'All cryptography executes in-browser. The server never receives plaintext data.',
    },
    steps: [
      {
        from: {
          title: 'Browser Client UI',
          subtitle: 'Interfaz reactiva de captura y conciliación patrimonial',
          badge: 'Local Client',
          type: 'client',
        },
        to: {
          title: 'AES-GCM Crypto Layer',
          subtitle: 'Derivación PBKDF2 y cifrado simétrico en memoria del navegador',
          badge: 'ZK Security',
          type: 'gate',
        },
        contract: 'SubtleCrypto Web API (AES-256-GCM / PBKDF2)',
        bidirectional: false,
      },
      {
        from: {
          title: 'AES-GCM Crypto Layer',
          subtitle: 'Payloads validados criptográficamente',
          badge: 'ZK Security',
          type: 'gate',
        },
        to: {
          title: 'Double-Entry Ledger Engine',
          subtitle: 'Validación estricta de partida doble y balance de suma cero',
          badge: 'Core Engine',
          type: 'engine',
        },
        contract: 'In-Memory Balanced Ledger (Debit = Credit Validation)',
        bidirectional: false,
      },
      {
        from: {
          title: 'Double-Entry Ledger Engine',
          subtitle: 'Persistencia local y respaldo opcional cifrado',
          badge: 'Core Engine',
          type: 'engine',
        },
        to: {
          title: 'IndexedDB / Encrypted Sync',
          subtitle: 'Almacenamiento offline-first con snapshots cifrados opcionales',
          badge: 'Storage',
          type: 'storage',
        },
        contract: 'IndexedDB Transactions + Zero-Knowledge Blob Sync',
        bidirectional: true,
      },
    ],
  },
}

const typeStyles: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
  client: {
    bg: 'bg-emerald-500/5',
    border: 'border-emerald-500/25',
    text: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  },
  protocol: {
    bg: 'bg-indigo-500/5',
    border: 'border-indigo-500/25',
    text: 'text-indigo-300',
    badgeBg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  },
  engine: {
    bg: 'bg-blue-500/5',
    border: 'border-blue-500/25',
    text: 'text-blue-300',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  },
  gate: {
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/25',
    text: 'text-amber-300',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  },
  storage: {
    bg: 'bg-teal-500/5',
    border: 'border-teal-500/25',
    text: 'text-teal-300',
    badgeBg: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  },
  ui: {
    bg: 'bg-purple-500/5',
    border: 'border-purple-500/25',
    text: 'text-purple-300',
    badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  },
}

export function SystemTopologyViewer({
  systemId,
  rawTopology,
  lang,
}: {
  systemId: string
  rawTopology: string
  lang: 'es' | 'en'
}) {
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual')
  const structured = TOPOLOGIES[systemId]

  return (
    <div className="rounded-xl border border-indigo-500/20 bg-[#08090c] p-4 sm:p-5 shadow-inner">
      {/* Topology Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-white/[0.06]">
        <div>
          <span className="text-zinc-500 block text-[10px] uppercase font-mono tracking-wider font-bold">
            📐 {lang === 'es' ? 'Topología de Arquitectura & Contratos' : 'Architecture Topology & Contracts'}
          </span>
          {structured && (
            <p className="text-xs text-zinc-300 font-medium mt-0.5">
              {structured.title[lang]}
            </p>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg border border-white/10 bg-white/[0.02] self-start sm:self-auto">
          <button
            onClick={() => setViewMode('visual')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
              viewMode === 'visual'
                ? 'bg-indigo-600 text-white font-semibold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {lang === 'es' ? 'Esquema Visual' : 'Visual Blueprint'}
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer ${
              viewMode === 'raw'
                ? 'bg-indigo-600 text-white font-semibold shadow'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Terminal RAW (ASCII)
          </button>
        </div>
      </div>

      {/* VIEW: VISUAL BLUEPRINT */}
      {viewMode === 'visual' && structured ? (
        <div className="space-y-3">
          <p className="text-xs text-zinc-300 leading-relaxed font-normal mb-4">
            {structured.description[lang]}
          </p>

          <div className="space-y-3 relative">
            {structured.steps.map((step, idx) => {
              const fromStyle = typeStyles[step.from.type] || typeStyles.engine
              const toStyle = step.to ? typeStyles[step.to.type] || typeStyles.engine : null

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-3.5 sm:p-4 hover:border-white/[0.12] transition-colors"
                >
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3">
                    {/* FROM NODE */}
                    <div className={`p-3 rounded-lg border ${fromStyle.border} ${fromStyle.bg}`}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded border ${fromStyle.badgeBg}`}>
                          {step.from.badge || 'Node'}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white font-mono">{step.from.title}</h4>
                      {step.from.subtitle && (
                        <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{step.from.subtitle}</p>
                      )}
                    </div>

                    {/* CONNECTOR / CONTRACT */}
                    <div className="flex flex-col items-center justify-center px-1 py-1">
                      {step.contract && (
                        <span className="text-[9px] font-mono text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-full text-center max-w-[200px] mb-1">
                          {step.contract}
                        </span>
                      )}
                      <div className="flex items-center gap-1 text-indigo-400 font-mono text-xs">
                        {step.bidirectional ? (
                          <span className="flex items-center gap-1 font-bold">
                            <span className="hidden md:inline">⇄</span>
                            <span className="md:hidden">⇅</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 font-bold">
                            <span className="hidden md:inline">→</span>
                            <span className="md:hidden">↓</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* TO NODE */}
                    {step.to && toStyle && (
                      <div className={`p-3 rounded-lg border ${toStyle.border} ${toStyle.bg}`}>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded border ${toStyle.badgeBg}`}>
                            {step.to.badge || 'Node'}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-white font-mono">{step.to.title}</h4>
                        {step.to.subtitle && (
                          <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{step.to.subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* VIEW: RAW TERMINAL ASCII */
        <div className="relative">
          <div className="overflow-x-auto rounded-lg bg-black/60 p-4 border border-white/[0.06]">
            <pre className="font-mono text-xs text-indigo-200 whitespace-pre leading-relaxed select-all">
              {rawTopology}
            </pre>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 block text-right mt-1.5">
            {lang === 'es' ? '← Deslizar horizontalmente si excede la pantalla →' : '← Scroll horizontally if content overflows →'}
          </span>
        </div>
      )}
    </div>
  )
}
