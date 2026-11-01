'use client'

import { useState, useEffect } from 'react'

export interface ArchitectureNode {
  id: string
  stage: string
  stageLabel: { es: string; en: string }
  title: string
  subtitle: { es: string; en: string }
  category: 'client' | 'gate' | 'engine' | 'storage'
  tag: string
  contractToNext?: {
    label: string
    protocol: string
    bidirectional?: boolean
  }
}

export interface SystemArchitecture {
  systemId: string
  title: { es: string; en: string }
  description: { es: string; en: string }
  pattern: { es: string; en: string }
  boundary: { es: string; en: string }
  latency: { es: string; en: string }
  layout: 'pipeline' | 'bifurcated'
  nodes: ArchitectureNode[]
  bifurcation?: {
    hubNodeId: string
    branches: {
      contract: string
      bidirectional?: boolean
      node: ArchitectureNode
    }[]
  }
}

const CATEGORY_STYLES: Record<
  ArchitectureNode['category'],
  { badge: string; dot: string; glow: string }
> = {
  client: {
    badge: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    dot: 'bg-sky-400',
    glow: 'group-hover:border-sky-500/30',
  },
  gate: {
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    dot: 'bg-amber-400',
    glow: 'group-hover:border-amber-500/30',
  },
  engine: {
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    dot: 'bg-indigo-400',
    glow: 'group-hover:border-indigo-500/30',
  },
  storage: {
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    dot: 'bg-emerald-400',
    glow: 'group-hover:border-emerald-500/30',
  },
}

const TOPOLOGIES: Record<string, SystemArchitecture> = {
  gripm: {
    systemId: 'gripm',
    title: {
      es: 'Arquitectura de Orquestación Local-First & Protocolo MCP',
      en: 'Local-First Orchestration Architecture & MCP Protocol',
    },
    description: {
      es: 'Protocolo de comunicación bidireccional entre agentes de IA y el backlog local en disco, sin intermediarios ni exposición en la nube.',
      en: 'Bi-directional communication protocol between AI agents and local disk backlog, zero cloud exposure.',
    },
    pattern: {
      es: 'Local-First · MCP JSON-RPC',
      en: 'Local-First · MCP JSON-RPC',
    },
    boundary: {
      es: '100% Localhost · Zero Cloud',
      en: '100% Localhost · Zero Cloud',
    },
    latency: {
      es: '< 1ms IPC stdio / WebSocket',
      en: '< 1ms stdio / WebSocket IPC',
    },
    layout: 'bifurcated',
    nodes: [
      {
        id: 'agent-host',
        stage: '01',
        stageLabel: { es: 'Host Consumidor', en: 'Consumer Host' },
        title: 'AI Agent / IDE Host',
        subtitle: {
          es: 'Cursor, Claude Code, Antigravity o agentes headless invocando herramientas nativas.',
          en: 'Cursor, Claude Code, Antigravity, or headless agents invoking native tooling.',
        },
        category: 'client',
        tag: 'IDE Client Surface',
        contractToNext: {
          label: 'Model Context Protocol (MCP)',
          protocol: 'JSON-RPC over stdio',
          bidirectional: true,
        },
      },
      {
        id: 'core-daemon',
        stage: '02',
        stageLabel: { es: 'Gateway Central', en: 'Core Gateway' },
        title: 'Gripm CLI Daemon',
        subtitle: {
          es: 'Servidor MCP local, reconciliador de estados y despachador de eventos atómicos en memoria.',
          en: 'Local MCP server, state reconciler, and atomic in-memory event dispatcher.',
        },
        category: 'engine',
        tag: 'IPC Router & Daemon',
      },
    ],
    bifurcation: {
      hubNodeId: 'core-daemon',
      branches: [
        {
          contract: 'Local Filesystem Events (fs.watch)',
          bidirectional: true,
          node: {
            id: 'git-backlog',
            stage: '03A',
            stageLabel: { es: 'Persistencia Soberana', en: 'Sovereign Storage' },
            title: 'Local Git Repo (.md)',
            subtitle: {
              es: 'Tareas y backlog en Markdown versionados junto al código fuente del proyecto.',
              en: 'Markdown tasks and backlog versioned directly alongside application code in Git.',
            },
            category: 'storage',
            tag: 'Zero-Cloud Backlog',
          },
        },
        {
          contract: 'WebSocket / Local HTTP :4100',
          bidirectional: true,
          node: {
            id: 'web-cockpit',
            stage: '03B',
            stageLabel: { es: 'Superficie Visual', en: 'UI Surface' },
            title: 'React 18 Web Cockpit',
            subtitle: {
              es: 'Tablero Kanban local servido en localhost con sincronización instantánea y cero tracking.',
              en: 'Local Kanban board served on localhost with instant synchronization and zero tracking.',
            },
            category: 'client',
            tag: 'Local Vite UI',
          },
        },
      ],
    },
  },
  'gripm-playbook': {
    systemId: 'gripm-playbook',
    title: {
      es: 'Pipeline Determinístico de Gobernanza y Handoff Multi-Agente',
      en: 'Deterministic Multi-Agent Governance & Continuous Handoff',
    },
    description: {
      es: 'Cadena formal de roles especializados con contratos de entrega tipados, compuertas de auditoría estricta y bucles de revisión.',
      en: 'Formal chain of specialized roles with typed delivery contracts, strict audit gates, and review loops.',
    },
    pattern: {
      es: 'Deterministic Multi-Agent Delivery Pipeline',
      en: 'Deterministic Multi-Agent Delivery Pipeline',
    },
    boundary: {
      es: 'Contratos de Handoff Formales + Quality Gates',
      en: 'Formal Handoff Contracts + Quality Gates',
    },
    latency: {
      es: 'Pre-Merge Gate Automatizado (< 5s)',
      en: 'Automated Pre-Merge Gate (< 5s)',
    },
    layout: 'pipeline',
    nodes: [
      {
        id: 'pm-orchestrator',
        stage: '01',
        stageLabel: { es: 'Estrategia Funcional', en: 'Functional Strategy' },
        title: '01. PM Orchestrator',
        subtitle: {
          es: 'Desglose de épicas, historias y criterios de aceptación Gherkin ejecutables.',
          en: 'Decomposition of epics, stories, and executable Gherkin acceptance criteria.',
        },
        category: 'client',
        tag: 'Spec & AC Authoring',
        contractToNext: {
          label: 'Handoff Formal de Especificación',
          protocol: 'Markdown Frontmatter + AC Checklist',
          bidirectional: false,
        },
      },
      {
        id: 'principal-engineer',
        stage: '02',
        stageLabel: { es: 'Construcción Central', en: 'Core Architecture' },
        title: '02. Principal Engineer',
        subtitle: {
          es: 'Diseño técnico, tipado estricto, implementación modular y suite de tests unitarios.',
          en: 'Technical design, strict types, modular implementation, and unit test suite.',
        },
        category: 'engine',
        tag: 'Code & Types Implementation',
        contractToNext: {
          label: 'Compuerta de Entrega a Calidad',
          protocol: 'Pre-merge Zero-Warning Gate',
          bidirectional: false,
        },
      },
      {
        id: 'qa-auditor',
        stage: '03',
        stageLabel: { es: 'Compuerta de Calidad', en: 'Quality Gate' },
        title: '03. Rigorous QA Auditor',
        subtitle: {
          es: 'Auditoría de regresión estática, límites LOC, cobertura de invariantes y edge cases.',
          en: 'Static regression audit, LOC budgets, invariant coverage, and security checks.',
        },
        category: 'gate',
        tag: 'Static Analysis & Regressions',
        contractToNext: {
          label: 'Bucle de Revisión / Aprobación',
          protocol: 'Review Feedback Loop (Rejection / Sign-off)',
          bidirectional: true,
        },
      },
      {
        id: 'ux-designer',
        stage: '04',
        stageLabel: { es: 'Auditoría de Usabilidad', en: 'Usability Audit' },
        title: '04. UX Designer Gate',
        subtitle: {
          es: 'Validación heurística de interfaces, jerarquía visual, accesibilidad y diseño no frustrante.',
          en: 'Heuristic evaluation, visual hierarchy, accessibility, and non-frustrating UX design.',
        },
        category: 'gate',
        tag: 'Heuristics & Design Tokens',
      },
    ],
  },
  c3admin: {
    systemId: 'c3admin',
    title: {
      es: 'Topología Multi-Tenant Empresarial con Aislamiento Criptográfico',
      en: 'Enterprise Multi-Tenant Topology with Cryptographic Isolation',
    },
    description: {
      es: 'Aislamiento estricto de clientes desde el Edge Ingress hasta esquemas dedicados en base de datos, con registro inmutable de auditoría.',
      en: 'Strict tenant isolation from Edge Ingress down to dedicated database schemas with immutable event auditing.',
    },
    pattern: {
      es: 'Multi-Tenant · Edge RBAC',
      en: 'Multi-Tenant · Edge RBAC',
    },
    boundary: {
      es: 'Aislamiento por Esquema SQL',
      en: 'SQL Schema Isolation',
    },
    latency: {
      es: 'Sub-45ms Edge App Router',
      en: 'Sub-45ms Edge App Router',
    },
    layout: 'pipeline',
    nodes: [
      {
        id: 'edge-ingress',
        stage: '01',
        stageLabel: { es: 'Ingreso en el Edge', en: 'Edge Ingress' },
        title: 'Next.js App Router Edge',
        subtitle: {
          es: 'Resolución de subdominios, enrutamiento dinámico de organización y normalización de headers.',
          en: 'Subdomain resolution, dynamic tenant routing, and header normalization at edge.',
        },
        category: 'client',
        tag: 'Edge Routing & Ingress',
        contractToNext: {
          label: 'Resolución de Tenant & Claims',
          protocol: 'JWT Claims + Tenant Scope Check',
          bidirectional: false,
        },
      },
      {
        id: 'rbac-middleware',
        stage: '02',
        stageLabel: { es: 'Barrera de Seguridad', en: 'Security Boundary' },
        title: 'RBAC & Isolation Middleware',
        subtitle: {
          es: 'Validación criptográfica de sesión y confinamiento de alcance por organización.',
          en: 'Cryptographic session validation and strict per-organization scope confinement.',
        },
        category: 'gate',
        tag: 'Cryptographic Guard',
        contractToNext: {
          label: 'Contexto de Ejecución Aislado',
          protocol: 'Strict Tenant Execution Context',
          bidirectional: false,
        },
      },
      {
        id: 'domain-services',
        stage: '03',
        stageLabel: { es: 'Servicios de Dominio', en: 'Core Services' },
        title: 'Business Logic Routes',
        subtitle: {
          es: 'Operaciones de dominio fuertemente tipadas sin capas ORM innecesarias, optimizadas para baja latencia.',
          en: 'Strongly-typed domain operations without ORM bloat, optimized for ultra-low latency.',
        },
        category: 'engine',
        tag: 'Typed Domain Engine',
        contractToNext: {
          label: 'Ruta de Búsqueda & Stream de Auditoría',
          protocol: 'Postgres Search Path + Immutable Audit Stream',
          bidirectional: true,
        },
      },
      {
        id: 'db-storage',
        stage: '04',
        stageLabel: { es: 'Persistencia Aislada', en: 'Isolated Data Layer' },
        title: 'PostgreSQL Multi-Schema & Audit Log',
        subtitle: {
          es: 'Aislamiento físico por esquema en base de datos con registro inmutable de mutaciones para cumplimiento.',
          en: 'Physical schema isolation per organization with immutable audit log for compliance.',
        },
        category: 'storage',
        tag: 'Multi-Schema Database',
      },
    ],
  },
  dom: {
    systemId: 'dom',
    title: {
      es: 'Motor Zero-Knowledge de Partida Doble en el Navegador',
      en: 'Client-Side Zero-Knowledge Double-Entry Engine',
    },
    description: {
      es: 'Toda la criptografía y las reglas contables se ejecutan en el navegador. El servidor nunca recibe datos en claro.',
      en: 'All cryptography and ledger invariants execute in-browser. Zero plaintext exposure to servers.',
    },
    pattern: {
      es: 'Zero-Knowledge Ledger',
      en: 'Zero-Knowledge Ledger',
    },
    boundary: {
      es: 'Cifrado Client-Side (AES-GCM)',
      en: 'Client-Side Crypto (AES-GCM)',
    },
    latency: {
      es: 'Instantáneo en Cliente',
      en: 'Instant Client In-Memory',
    },
    layout: 'pipeline',
    nodes: [
      {
        id: 'browser-ui',
        stage: '01',
        stageLabel: { es: 'Cliente Local', en: 'Local Surface' },
        title: 'Browser Client UI',
        subtitle: {
          es: 'Interfaz reactiva de captura contable, conciliación de cuentas y visualización patrimonial.',
          en: 'Reactive interface for transaction capture, account reconciliation, and balance visualization.',
        },
        category: 'client',
        tag: 'Local React Surface',
        contractToNext: {
          label: 'API Criptográfica Web Nativa',
          protocol: 'SubtleCrypto Web API (AES-256-GCM / PBKDF2)',
          bidirectional: false,
        },
      },
      {
        id: 'crypto-layer',
        stage: '02',
        stageLabel: { es: 'Sandpit Criptográfico', en: 'ZK Security Layer' },
        title: 'In-Memory Crypto Layer',
        subtitle: {
          es: 'Derivación de claves PBKDF2 y cifrado simétrico en memoria volátil del navegador.',
          en: 'Client-side PBKDF2 key derivation and symmetric encryption in volatile browser memory.',
        },
        category: 'gate',
        tag: 'Volatile In-Memory Sandbox',
        contractToNext: {
          label: 'Payloads Validados Criptográficamente',
          protocol: 'Decrypted In-Memory Transaction Streams',
          bidirectional: false,
        },
      },
      {
        id: 'ledger-engine',
        stage: '03',
        stageLabel: { es: 'Motor Contable', en: 'Accounting Engine' },
        title: 'Double-Entry Ledger Engine',
        subtitle: {
          es: 'Validación determinística de partida doble: verificación estricta de suma cero (débitos = créditos).',
          en: 'Deterministic double-entry enforcement: strict zero-sum balancing (debits = credits).',
        },
        category: 'engine',
        tag: 'Balanced Invariant Validator',
        contractToNext: {
          label: 'Transacciones Locales & Blobs Cifrados',
          protocol: 'IndexedDB Transactions + Encrypted Blob Sync',
          bidirectional: true,
        },
      },
      {
        id: 'idb-storage',
        stage: '04',
        stageLabel: { es: 'Persistencia Soberana', en: 'Sovereign Persistence' },
        title: 'IndexedDB / Encrypted Sync',
        subtitle: {
          es: 'Persistencia offline-first soberana en disco local con respaldo opcional de snapshots cifrados.',
          en: 'Sovereign offline-first local storage with optional zero-knowledge encrypted cloud backups.',
        },
        category: 'storage',
        tag: 'Client-Side Sovereign DB',
      },
    ],
  },
}

function NodeCard({
  node,
  lang,
}: {
  node: ArchitectureNode
  lang: 'es' | 'en'
}) {
  const style = CATEGORY_STYLES[node.category]

  return (
    <div
      className={`group relative rounded-xl border border-white/[0.08] bg-[#0d1017]/90 p-4 transition-all duration-200 hover:border-white/20 hover:bg-[#11151f] hover:shadow-lg hover:shadow-black/40 ${style.glow}`}
    >
      {/* Top Meta: Stage Number + Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] font-bold text-zinc-500 tracking-wider">
            {node.stage}
          </span>
          <span className="text-zinc-600 font-mono text-[10px]">/</span>
          <span className="text-[10px] font-mono uppercase text-zinc-400 font-medium tracking-wide">
            {node.stageLabel[lang]}
          </span>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-medium border ${style.badge}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
          {node.tag}
        </span>
      </div>

      {/* Node Title & Subtitle */}
      <h4 className="font-mono text-xs sm:text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
        {node.title}
      </h4>
      <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 leading-relaxed">
        {node.subtitle[lang]}
      </p>
    </div>
  )
}

function Connector({
  contract,
  bidirectional,
}: {
  contract: { label: string; protocol: string; bidirectional?: boolean }
  bidirectional?: boolean
}) {
  const isBidi = bidirectional ?? contract.bidirectional ?? false

  return (
    <div className="flex flex-col items-center justify-center py-2 px-1 relative my-0.5">
      {/* Connector line */}
      <div className="w-[1px] h-6 bg-gradient-to-b from-white/20 via-indigo-500/40 to-white/20" />

      {/* Contract pill */}
      <div className="my-1.5 px-3 py-1 rounded-full bg-[#121622] border border-indigo-500/30 text-indigo-200 text-[10px] font-mono flex items-center gap-2 shadow-sm shadow-black/40">
        <span className="text-indigo-400 font-bold">{isBidi ? '⇅' : '↓'}</span>
        <span className="font-semibold text-zinc-200">{contract.label}</span>
        <span className="text-zinc-500 hidden sm:inline">&bull;</span>
        <span className="text-zinc-400 hidden sm:inline">{contract.protocol}</span>
      </div>

      {/* Connector line */}
      <div className="w-[1px] h-6 bg-gradient-to-b from-white/20 via-indigo-500/40 to-white/20" />
    </div>
  )
}

function MiniPipelinePreview({
  systemId,
}: {
  systemId: string
  lang: 'es' | 'en'
}) {
  if (systemId === 'gripm') {
    return (
      <div className="flex items-center justify-between gap-1 sm:gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.05] text-[10px] font-mono overflow-x-auto">
        <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 whitespace-nowrap">
          01 AI Host (MCP)
        </span>
        <span className="text-indigo-400 font-bold shrink-0">⇄</span>
        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
          02 CLI Daemon
        </span>
        <span className="text-indigo-400 font-bold shrink-0">⇄</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 whitespace-nowrap">
          03 Git Repo + React UI
        </span>
      </div>
    )
  }

  if (systemId === 'gripm-playbook') {
    return (
      <div className="flex items-center justify-between gap-1 sm:gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.05] text-[10px] font-mono overflow-x-auto">
        <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 whitespace-nowrap">
          01 PM Spec
        </span>
        <span className="text-zinc-600 font-bold shrink-0">→</span>
        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
          02 Principal Eng
        </span>
        <span className="text-zinc-600 font-bold shrink-0">→</span>
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap">
          03 QA Gate
        </span>
        <span className="text-zinc-600 font-bold shrink-0">→</span>
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap">
          04 UX Audit
        </span>
      </div>
    )
  }

  if (systemId === 'c3admin') {
    return (
      <div className="flex items-center justify-between gap-1 sm:gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.05] text-[10px] font-mono overflow-x-auto">
        <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 whitespace-nowrap">
          01 Edge Ingress
        </span>
        <span className="text-zinc-600 font-bold shrink-0">→</span>
        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap">
          02 RBAC Guard
        </span>
        <span className="text-zinc-600 font-bold shrink-0">→</span>
        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
          03 Domain Logic
        </span>
        <span className="text-zinc-600 font-bold shrink-0">→</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 whitespace-nowrap">
          04 Multi-Schema DB
        </span>
      </div>
    )
  }

  // dom
  return (
    <div className="flex items-center justify-between gap-1 sm:gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.05] text-[10px] font-mono overflow-x-auto">
      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 whitespace-nowrap">
        01 Browser UI
      </span>
      <span className="text-zinc-600 font-bold shrink-0">→</span>
      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap">
        02 In-Memory AES
      </span>
      <span className="text-zinc-600 font-bold shrink-0">→</span>
      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
        03 Ledger Engine
      </span>
      <span className="text-zinc-600 font-bold shrink-0">→</span>
      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 whitespace-nowrap">
        04 Local IDB
      </span>
    </div>
  )
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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual')
  const [copied, setCopied] = useState(false)
  const structured = TOPOLOGIES[systemId]

  // ESC key listener & body scroll lock
  useEffect(() => {
    if (!isModalOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [isModalOpen])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawTopology)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <>
      {/* ─── COMPACT INLINE SPEC CARD (Balanced with Product View) ─── */}
      <div className="rounded-xl border border-white/[0.08] bg-[#07090d]/80 p-3.5 space-y-3">
        {/* Spec Attributes Strip */}
        {structured && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-3 py-2 bg-black/30 rounded-lg border border-white/[0.04] text-[10px] font-mono">
            <div className="text-zinc-400">
              <span className="text-zinc-600">PATTERN: </span>
              <span className="text-zinc-200 font-medium">{structured.pattern[lang]}</span>
            </div>
            <div className="text-zinc-400">
              <span className="text-zinc-600">BOUNDARY: </span>
              <span className="text-emerald-400 font-medium">{structured.boundary[lang]}</span>
            </div>
            <div className="text-zinc-400">
              <span className="text-zinc-600">LATENCY: </span>
              <span className="text-sky-300 font-medium">{structured.latency[lang]}</span>
            </div>
          </div>
        )}

        {/* Mini Pipeline Preview */}
        <MiniPipelinePreview systemId={systemId} lang={lang} />

        {/* Trigger to Open Full Modal Inspector */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full py-2.5 px-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/15 hover:border-indigo-500/50 text-indigo-300 hover:text-white text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group shadow-sm shadow-indigo-500/10"
        >
          <span className="text-indigo-400 group-hover:scale-110 transition-transform">📐</span>
          <span>
            {lang === 'es'
              ? 'Inspeccionar Blueprint de Arquitectura & Contratos'
              : 'Inspect Full Architecture Blueprint & Contracts'}
          </span>
          <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">↗</span>
        </button>
      </div>

      {/* ─── FULL-SCREEN ARCHITECTURE BLUEPRINT MODAL ─── */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false)
          }}
        >
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#07090d] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0a0d13] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                    {lang === 'es' ? '📐 Blueprint Técnico & Contratos' : '📐 Architecture Blueprint & Contracts'}
                  </span>
                </div>
                {structured && (
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-mono">
                    {structured.title[lang]}
                  </h3>
                )}
                {structured && (
                  <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
                    {structured.description[lang]}
                  </p>
                )}
              </div>

              {/* View Mode Toggle + Close Button */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <div className="flex items-center gap-1 p-1 rounded-lg border border-white/10 bg-white/[0.02]">
                  <button
                    onClick={() => setViewMode('visual')}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      viewMode === 'visual'
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {lang === 'es' ? 'Esquema Visual' : 'Visual Blueprint'}
                  </button>
                  <button
                    onClick={() => setViewMode('raw')}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all cursor-pointer ${
                      viewMode === 'raw'
                        ? 'bg-zinc-800 text-white font-semibold shadow-md'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Terminal RAW
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title={lang === 'es' ? 'Cerrar (Esc)' : 'Close (Esc)'}
                  aria-label="Cerrar modal"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Architecture Spec Attributes Strip in Modal */}
            {structured && (
              <div className="px-4 py-2.5 bg-black/50 border-b border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono shrink-0">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-zinc-600">PATTERN:</span>
                  <span className="text-zinc-200 truncate">{structured.pattern[lang]}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-zinc-600">BOUNDARY:</span>
                  <span className="text-emerald-400 truncate">{structured.boundary[lang]}</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="text-zinc-600">LATENCY:</span>
                  <span className="text-sky-300 truncate">{structured.latency[lang]}</span>
                </div>
              </div>
            )}

            {/* Modal Body Canvas */}
            <div className="p-4 sm:p-6 bg-[#080a0f] [background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:20px_20px] overflow-y-auto flex-1">
              {viewMode === 'visual' && structured ? (
                <div>
                  {structured.layout === 'pipeline' ? (
                    /* Linear Sequenced Pipeline */
                    <div className="max-w-2xl mx-auto space-y-1">
                      {structured.nodes.map((node) => (
                        <div key={node.id}>
                          <NodeCard node={node} lang={lang} />
                          {node.contractToNext && (
                            <Connector contract={node.contractToNext} />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Bifurcated Hub-and-Spoke (Gripm) */
                    <div className="max-w-2xl mx-auto space-y-1">
                      {/* Stage 1: Consumer Host */}
                      <NodeCard node={structured.nodes[0]} lang={lang} />

                      {/* Connector Host -> Daemon */}
                      {structured.nodes[0].contractToNext && (
                        <Connector contract={structured.nodes[0].contractToNext} />
                      )}

                      {/* Stage 2: Central Daemon Hub */}
                      <NodeCard node={structured.nodes[1]} lang={lang} />

                      {/* Bifurcated Split Indicator */}
                      <div className="flex flex-col items-center justify-center py-2 px-1 relative my-0.5">
                        <div className="w-[1px] h-5 bg-gradient-to-b from-white/20 via-indigo-500/40 to-white/20" />
                        <div className="my-1 px-3 py-1 rounded-full bg-[#121622] border border-indigo-500/30 text-indigo-200 text-[10px] font-mono flex items-center gap-1.5">
                          <span className="text-indigo-400 font-bold">⇄</span>
                          <span>
                            {lang === 'es' ? 'Bifurcación de Estados Concurrente' : 'Concurrent State Bifurcation'}
                          </span>
                        </div>
                        <div className="w-[1px] h-5 bg-gradient-to-b from-white/20 via-indigo-500/40 to-white/20" />
                      </div>

                      {/* Branches Grid */}
                      {structured.bifurcation && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          {structured.bifurcation.branches.map((b) => (
                            <div key={b.node.id} className="space-y-2">
                              <div className="px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.06] text-[10px] font-mono text-zinc-400 text-center truncate">
                                {b.contract}
                              </div>
                              <NodeCard node={b.node} lang={lang} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Architecture Legend */}
                  <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-zinc-500">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                        {lang === 'es' ? 'Superficie / Cliente' : 'Client Surface'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        {lang === 'es' ? 'Motor & Gateway' : 'Core Engine'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {lang === 'es' ? 'Compuerta / Seguridad' : 'Gate & Security'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {lang === 'es' ? 'Persistencia Soberana' : 'Sovereign Storage'}
                      </span>
                    </div>
                    <div className="text-zinc-600">
                      {lang === 'es' ? 'Contratos estáticos verificables' : 'Verifiable static contracts'}
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW: RAW TERMINAL ASCII SPEC */
                <div className="relative rounded-lg overflow-hidden border border-white/[0.08] bg-[#050608]">
                  {/* Terminal Top Bar */}
                  <div className="h-8 px-3 bg-black/80 border-b border-white/[0.06] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="ml-2 font-mono text-[10px] text-zinc-500">
                        {systemId}-topology.spec
                      </span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="px-2 py-0.5 rounded bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 font-mono text-[10px] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copied ? (
                        <>
                          <span className="text-emerald-400">✓</span>
                          <span>{lang === 'es' ? 'Copiado' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <span>⎘</span>
                          <span>{lang === 'es' ? 'Copiar Spec' : 'Copy Spec'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* ASCII Output */}
                  <div className="p-4 overflow-x-auto">
                    <pre className="font-mono text-xs text-indigo-300 whitespace-pre leading-relaxed select-all">
                      {rawTopology}
                    </pre>
                  </div>
                  <div className="px-3 py-1.5 bg-black/60 border-t border-white/[0.04] text-[10px] font-mono text-zinc-500 text-right">
                    {lang === 'es'
                      ? 'Representación canónica del sistema'
                      : 'Canonical system representation'}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-[#0a0d13] border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
              <span className="hidden sm:inline">
                {lang === 'es' ? 'Presioná Esc o hacé click afuera para cerrar' : 'Press Esc or click outside to close'}
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors ml-auto cursor-pointer"
              >
                {lang === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
