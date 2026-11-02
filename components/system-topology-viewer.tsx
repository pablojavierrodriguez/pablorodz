'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useLens, type Lens } from '@/lib/lens-context'

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
  productBadge?: { es: string; en: string }
  archBadge?: { es: string; en: string }
  resilienceFallback?: { es: string; en: string }
}

export interface TraceStepDefinition {
  step: number
  nodeId: string | string[]
  timeOffset: string
  category: ArchitectureNode['category']
  action: { es: string; en: string }
  detail: { es: string; en: string }
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
  traceSteps?: TraceStepDefinition[]
}

const CATEGORY_STYLES: Record<
  ArchitectureNode['category'],
  {
    badge: string
    dot: string
    glow: string
    activeRing: string
    activeBg: string
    pulseColor: string
  }
> = {
  client: {
    badge: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    dot: 'bg-sky-400',
    glow: 'group-hover:border-sky-500/30',
    activeRing: 'ring-2 ring-sky-400 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.45)]',
    activeBg: 'bg-[#0b1726]',
    pulseColor: 'bg-sky-400',
  },
  gate: {
    badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    dot: 'bg-amber-400',
    glow: 'group-hover:border-amber-500/30',
    activeRing: 'ring-2 ring-amber-400 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.45)]',
    activeBg: 'bg-[#1e1507]',
    pulseColor: 'bg-amber-400',
  },
  engine: {
    badge: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    dot: 'bg-indigo-400',
    glow: 'group-hover:border-indigo-500/30',
    activeRing: 'ring-2 ring-indigo-400 border-indigo-400 shadow-[0_0_25px_rgba(129,140,248,0.45)]',
    activeBg: 'bg-[#111226]',
    pulseColor: 'bg-indigo-400',
  },
  storage: {
    badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    dot: 'bg-emerald-400',
    glow: 'group-hover:border-emerald-500/30',
    activeRing: 'ring-2 ring-emerald-400 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.45)]',
    activeBg: 'bg-[#071912]',
    pulseColor: 'bg-emerald-400',
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
        productBadge: { es: 'Cero Costo de Nube', en: 'Zero Cloud Cost' },
        archBadge: { es: 'stdio JSON-RPC IPC', en: 'stdio JSON-RPC IPC' },
        resilienceFallback: {
          es: 'Host IDE desconectado ➔ Gripm CLI Daemon conserva estado en memoria. Reintentos automáticos con sincronización de diff al reconectar.',
          en: 'IDE Host disconnected ➔ Gripm CLI Daemon preserves in-memory queue. Reconnecting sessions receive zero-loss state diff.',
        },
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
        productBadge: { es: 'Soberanía en Localhost', en: 'Local Sovereignty' },
        archBadge: { es: 'Atomic In-Memory Router', en: 'Atomic In-Memory Router' },
        resilienceFallback: {
          es: 'Conexión MCP stdio interrumpida ➔ Fallback limpio al backlog Markdown local en disco (.md). Cero pérdida de datos.',
          en: 'MCP stdio connection severed ➔ Graceful fallback to local Markdown backlog on disk (.md). Zero data loss.',
        },
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
            productBadge: { es: 'Control Soberano en Git', en: '100% Git Control' },
            archBadge: { es: 'fs.watch + Markdown AST', en: 'fs.watch + Markdown AST' },
            resilienceFallback: {
              es: 'Bloqueo de I/O en sistema de archivos ➔ Buffer volátil en RAM encola mutaciones con flush determinístico al liberar el lock.',
              en: 'Filesystem I/O lock detected ➔ In-memory RAM buffer enqueues mutations, flushing deterministically once lock is released.',
            },
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
            productBadge: { es: 'Cero Telemetría Externa', en: 'Zero Tracking Telemetry' },
            archBadge: { es: 'WebSocket Local :4100', en: 'Local WebSocket :4100' },
            resilienceFallback: {
              es: 'Desconexión de UI Localhost ➔ El Daemon CLI y los agentes de IA continúan operando al 100% de capacidad vía terminal.',
              en: 'Localhost UI disconnected ➔ CLI Daemon and AI agents continue at 100% capacity independently of web surface.',
            },
          },
        },
      ],
    },
    traceSteps: [
      {
        step: 0,
        nodeId: 'agent-host',
        timeOffset: '+0ms',
        category: 'client',
        action: {
          es: 'Acción de Cliente despachada vía Evento de UI / Agente',
          en: 'Client Action dispatched via UI Event / Agent',
        },
        detail: {
          es: 'IDE Host despacha tool call `gripm_list_tasks` hacia canal IPC local',
          en: 'IDE Host dispatches tool call `gripm_list_tasks` to local IPC channel',
        },
      },
      {
        step: 1,
        nodeId: 'core-daemon',
        timeOffset: '+3ms',
        category: 'engine',
        action: {
          es: 'Handshake verificado vía stdio JSON-RPC',
          en: 'Handshake verified via stdio JSON-RPC',
        },
        detail: {
          es: 'Core Daemon reconcilia estado en memoria y despacha mutación atómica',
          en: 'Core Daemon reconciles in-memory state and routes atomic mutation',
        },
      },
      {
        step: 2,
        nodeId: 'git-backlog',
        timeOffset: '+9ms',
        category: 'storage',
        action: {
          es: 'Local FS Watcher & Sync Engine sincronizado',
          en: 'Local FS Watcher & Sync Engine synchronized',
        },
        detail: {
          es: 'Escritura atómica en `.md` local + evento fs.watch propagado sin nube',
          en: 'Atomic write to local `.md` + fs.watch event propagated with zero cloud exposure',
        },
      },
      {
        step: 3,
        nodeId: 'web-cockpit',
        timeOffset: '+14ms',
        category: 'client',
        action: {
          es: 'Estado comprometido a Disco Local & WebSocket Cockpit',
          en: 'State committed to Local Disk / Ledger & WebSocket Cockpit',
        },
        detail: {
          es: 'Tablero Kanban local sincronizado en localhost:4100 en sub-milisegundo',
          en: 'Local Kanban board synchronized on localhost:4100 in sub-millisecond range',
        },
      },
    ],
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
        productBadge: { es: 'Alineación de Negocio 100%', en: '100% Business Alignment' },
        archBadge: { es: 'Executable Gherkin Specs', en: 'Executable Gherkin Specs' },
        resilienceFallback: {
          es: 'Especificación ambigua o incompleta ➔ El pipeline se detiene antes de consumir recursos de desarrollo. Notificación automática de criterios faltantes.',
          en: 'Incomplete or ambiguous spec ➔ Delivery pipeline halts before engineering hours are spent. Missing criteria flagged automatically.',
        },
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
        productBadge: { es: 'Entrega Predecible y Ágil', en: 'Predictable Swift Delivery' },
        archBadge: { es: 'Strict TypeScript Contracts', en: 'Strict TypeScript Contracts' },
        resilienceFallback: {
          es: 'Fallo de compilación o tipo "any" detectado ➔ Compuerta pre-merge bloqueada de inmediato. Cero código con advertencias llega a QA.',
          en: 'Compilation error or "any" type detected ➔ Pre-merge gate blocks commit immediately. Zero warning code reaches QA.',
        },
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
        productBadge: { es: 'Cero Regresiones a Producción', en: 'Zero Production Regressions' },
        archBadge: { es: 'Static Analysis & LOC Budget', en: 'Static Analysis & LOC Budget' },
        resilienceFallback: {
          es: 'Compuerta QA detecta regresión o límite LOC excedido ➔ Bucle de feedback activado: rechazo formal con reporte de diagnóstico exacto.',
          en: 'QA gate detects regression or LOC budget breach ➔ Feedback loop triggered: formal rejection with precise diagnostic report.',
        },
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
        productBadge: { es: 'Experiencia Sin Fricción', en: 'Frictionless Experience' },
        archBadge: { es: 'Design Token Invariants', en: 'Design Token Invariants' },
        resilienceFallback: {
          es: 'Auditoría UX detecta fallo de contraste o inconsistencia de tokens ➔ Handoff bloqueado hasta subsanar regla heurística violada.',
          en: 'UX audit flags contrast or token inconsistency ➔ Handoff blocked until heuristic invariant is satisfied.',
        },
      },
    ],
    traceSteps: [
      {
        step: 0,
        nodeId: 'pm-orchestrator',
        timeOffset: '+0ms',
        category: 'client',
        action: {
          es: 'Desglose de Requerimientos & Criterios Gherkin',
          en: 'Requirement Breakdown & Gherkin Criteria',
        },
        detail: {
          es: 'Criterios de aceptación estructurados en Markdown frontmatter ejecutable',
          en: 'Executable acceptance criteria authored in structured Markdown frontmatter',
        },
      },
      {
        step: 1,
        nodeId: 'principal-engineer',
        timeOffset: '+5ms',
        category: 'engine',
        action: {
          es: 'Implementación Modular & Tipado Estricto',
          en: 'Modular Implementation & Strict Typing',
        },
        detail: {
          es: 'Construcción técnica modular sin tipos any y suite de tests unitarios',
          en: 'Modular engineering without any types and unit test suite verification',
        },
      },
      {
        step: 2,
        nodeId: 'qa-auditor',
        timeOffset: '+10ms',
        category: 'gate',
        action: {
          es: 'Auditoría Estática de Calidad & Cobertura',
          en: 'Static Quality Audit & Coverage Check',
        },
        detail: {
          es: 'Compuerta pre-merge: límites LOC respetados, cero warnings en compilador',
          en: 'Pre-merge gate: LOC budget limits verified, zero compiler warnings',
        },
      },
      {
        step: 3,
        nodeId: 'ux-designer',
        timeOffset: '+16ms',
        category: 'gate',
        action: {
          es: 'Validación Heurística & Tokens de Diseño',
          en: 'Heuristic Validation & Design Token Sign-off',
        },
        detail: {
          es: 'Aprobación de contraste WCAG AAA, jerarquía visual y accesibilidad',
          en: 'WCAG AAA contrast, visual hierarchy, and accessibility sign-off complete',
        },
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
        productBadge: { es: 'Sub-45ms de Respuesta', en: 'Sub-45ms Response' },
        archBadge: { es: 'Next.js Edge Middleware', en: 'Next.js Edge Middleware' },
        resilienceFallback: {
          es: 'Aislamiento en el Edge activado ➔ Se sirve vista de organización en caché de solo lectura. Escrituras encoladas en cliente.',
          en: 'Edge isolation engaged ➔ Read-only cached tenant view served. Write operations queued in client buffer.',
        },
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
        productBadge: { es: 'Aislamiento Estricto de Clientes', en: 'Strict Client Isolation' },
        archBadge: { es: 'JWT Scope Confinement', en: 'JWT Scope Confinement' },
        resilienceFallback: {
          es: 'Fallo en barrera de seguridad ➔ Protocolo Fail-Closed: denegación inmediata 401/403. Cero riesgo de fuga entre inquilinos.',
          en: 'Security boundary fault ➔ Fail-Closed protocol: immediate 401/403 denial. Zero risk of cross-tenant data leakage.',
        },
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
        productBadge: { es: 'Alto Rendimiento Operativo', en: 'High-Throughput Services' },
        archBadge: { es: 'Typed Route Handlers', en: 'Typed Route Handlers' },
        resilienceFallback: {
          es: 'Sobrecarga de servicios de dominio ➔ Circuit breaker accionado. Tráfico redirigido a réplicas en standby con idempotencia.',
          en: 'Domain service overload ➔ Circuit breaker tripped. Traffic routed to standby replicas with idempotent execution keys.',
        },
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
        productBadge: { es: 'Auditoría Inmutable de Cumplimiento', en: 'Audit-Ready Compliance' },
        archBadge: { es: 'Postgres Schema Isolation', en: 'Postgres Schema Isolation' },
        resilienceFallback: {
          es: 'Pool de PostgreSQL saturado ➔ Degeneración graceful a réplica de lectura. Registro de auditoría persiste en buffer WAL de emergencia.',
          en: 'PostgreSQL connection pool exhausted ➔ Graceful degradation to read replica. Audit stream buffered to emergency WAL.',
        },
      },
    ],
    traceSteps: [
      {
        step: 0,
        nodeId: 'edge-ingress',
        timeOffset: '+0ms',
        category: 'client',
        action: {
          es: 'Ingress Request en Edge con Hostname de Organización',
          en: 'Edge Ingress Request with Organization Hostname',
        },
        detail: {
          es: 'Next.js App Router resuelve tenant.c3admin.com y normaliza headers',
          en: 'Next.js App Router resolves tenant.c3admin.com and normalizes headers',
        },
      },
      {
        step: 1,
        nodeId: 'rbac-middleware',
        timeOffset: '+4ms',
        category: 'gate',
        action: {
          es: 'Validación Criptográfica & Confinamiento de Scope',
          en: 'Cryptographic Validation & Scope Confinement',
        },
        detail: {
          es: 'Claims JWT verificados · Contexto confinado estrictamente a org_id',
          en: 'JWT claims verified · Context strictly confined to org_id boundary',
        },
      },
      {
        step: 2,
        nodeId: 'domain-services',
        timeOffset: '+11ms',
        category: 'engine',
        action: {
          es: 'Ejecución de Dominio Fuertemente Tipada',
          en: 'Strongly Typed Domain Execution',
        },
        detail: {
          es: 'Mutación ejecutada en sandbox de inquilino sin ORM bloat',
          en: 'Mutation executed in tenant sandbox without ORM bloat',
        },
      },
      {
        step: 3,
        nodeId: 'db-storage',
        timeOffset: '+24ms',
        category: 'storage',
        action: {
          es: 'Commit en Esquema PostgreSQL Aislado + Audit Stream',
          en: 'PostgreSQL Schema Isolation Commit + Audit Stream',
        },
        detail: {
          es: 'Postgres search_path fijado al esquema del inquilino + registro append-only',
          en: 'Postgres search_path pinned to tenant schema + append-only audit trail',
        },
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
        productBadge: { es: 'Privacidad Absoluta de Datos', en: 'Absolute User Privacy' },
        archBadge: { es: 'In-Memory React 19 State', en: 'In-Memory React 19 State' },
        resilienceFallback: {
          es: 'Fallo de renderizado de UI ➔ El estado contable en memoria permanece inalterado. Recuperación limpia de sesión sin pérdida.',
          en: 'UI render crash ➔ In-memory ledger state remains intact. Session recovery executes cleanly without data corruption.',
        },
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
        productBadge: { es: 'Cero Datos en Servidores', en: 'Zero Plaintext Server' },
        archBadge: { es: 'AES-256-GCM / PBKDF2', en: 'AES-256-GCM / PBKDF2' },
        resilienceFallback: {
          es: 'Fallo en WebCrypto SubtleCrypto ➔ Bloqueo inmediato de memoria. La transacción se cancela antes de exponer datos sin cifrar.',
          en: 'WebCrypto SubtleCrypto fault ➔ Immediate memory seal. Operation aborted before any plaintext can be exposed.',
        },
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
        productBadge: { es: 'Cuadre Contable Garantizado', en: 'Guaranteed Ledger Balance' },
        archBadge: { es: 'Deterministic Σ(D)=Σ(C)', en: 'Deterministic Σ(D)=Σ(C)' },
        resilienceFallback: {
          es: 'Invariante de partida doble violada (Débitos ≠ Créditos) ➔ Rollback atómico instantáneo. Asientos desbalanceados son estrictamente rechazados.',
          en: 'Double-entry invariant violated (Debits ≠ Credits) ➔ Instant atomic rollback. Unbalanced entries are strictly rejected.',
        },
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
        productBadge: { es: '100% Offline Soberano', en: '100% Sovereign Offline' },
        archBadge: { es: 'Encrypted IndexedDB Blobs', en: 'Encrypted IndexedDB Blobs' },
        resilienceFallback: {
          es: 'Partición de red detectada ➔ El motor local-first IndexedDB con AES-GCM conserva el 100% de la integridad contable de partida doble.',
          en: 'Network partition ➔ AES-GCM local-first IndexedDB engine retains full double-entry ledger integrity.',
        },
      },
    ],
    traceSteps: [
      {
        step: 0,
        nodeId: 'browser-ui',
        timeOffset: '+0ms',
        category: 'client',
        action: {
          es: 'Captura Reactiva de Asiento Contable',
          en: 'Reactive Ledger Entry Capture',
        },
        detail: {
          es: 'Captura reactiva en memoria del cliente con validación instantánea de formulario',
          en: 'Reactive client in-memory capture with instant form type validation',
        },
      },
      {
        step: 1,
        nodeId: 'crypto-layer',
        timeOffset: '+2ms',
        category: 'gate',
        action: {
          es: 'Sandpit Criptográfico & Cifrado AES-256-GCM',
          en: 'Cryptographic Sandpit & AES-256-GCM Cipher',
        },
        detail: {
          es: 'Derivación de clave PBKDF2 y cifrado en memoria volátil del navegador',
          en: 'PBKDF2 key derivation and symmetric encryption in volatile browser memory',
        },
      },
      {
        step: 2,
        nodeId: 'ledger-engine',
        timeOffset: '+6ms',
        category: 'engine',
        action: {
          es: 'Verificación Estricta de Partida Doble',
          en: 'Strict Double-Entry Invariant Verification',
        },
        detail: {
          es: 'Verificación determinística de suma cero: Σ(Débitos) === Σ(Créditos)',
          en: 'Deterministic zero-sum balance: Σ(Debits) === Σ(Credits) enforced',
        },
      },
      {
        step: 3,
        nodeId: 'idb-storage',
        timeOffset: '+11ms',
        category: 'storage',
        action: {
          es: 'Persistencia Offline Soberana en IndexedDB',
          en: 'Sovereign Offline Persistence in IndexedDB',
        },
        detail: {
          es: 'Blob cifrado guardado en disco local con cero transmisión de texto plano',
          en: 'Encrypted blob committed to local disk with zero plaintext transmission',
        },
      },
    ],
  },
}

function NodeCard({
  node,
  lang,
  lens,
  isTraversed,
  isFailed,
  chaosMode,
  onNodeClick,
  onInspectNode,
}: {
  node: ArchitectureNode
  lang: 'es' | 'en'
  lens: Lens
  isTraversed?: boolean
  isFailed?: boolean
  chaosMode?: boolean
  onNodeClick?: () => void
  onInspectNode?: (node: ArchitectureNode) => void
}) {
  const style = CATEGORY_STYLES[node.category]

  const handleClick = () => {
    if (chaosMode) {
      onNodeClick?.()
    } else {
      onInspectNode?.(node)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`group relative rounded-xl border p-4 transition-all duration-300 cursor-pointer ${
        isFailed
          ? 'border-2 border-dashed border-red-500/80 bg-red-950/25 shadow-[0_0_25px_rgba(239,68,68,0.3)]'
          : isTraversed
          ? `${style.activeRing} ${style.activeBg}`
          : `border-white/[0.08] bg-[#0d1017]/90 hover:border-white/20 hover:bg-[#11151f] hover:shadow-lg hover:shadow-black/40 ${style.glow}`
      } ${chaosMode ? 'select-none ring-1 ring-white/10 hover:ring-amber-400/50' : 'hover:ring-1 hover:ring-indigo-500/30'}`}
    >
      {/* Chaos Mode Target Prompt */}
      {chaosMode && !isFailed && (
        <div className="absolute -top-2.5 right-4 z-10 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono font-semibold tracking-wider flex items-center gap-1 shadow-md backdrop-blur">
          <span>⚡</span>
          <span>{lang === 'es' ? 'Click: inducir fallo' : 'Click: inject fault'}</span>
        </div>
      )}

      {/* Normal Mode Inspection Prompt on hover */}
      {!chaosMode && !isFailed && (
        <div className="absolute -top-2.5 right-4 z-10 px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 text-[9px] font-mono tracking-wider items-center gap-1 shadow-md backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex">
          <span>🔍</span>
          <span>{lang === 'es' ? 'Click para inspeccionar' : 'Click to inspect'}</span>
        </div>
      )}

      {/* Top Meta: Stage Number + Badge + Status */}
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

        <div className="flex items-center gap-1.5">
          {/* Failed State Indicator */}
          {isFailed ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse">
              <span>⚠</span>
              <span>{lang === 'es' ? 'OFFLINE / CORTADO' : 'OFFLINE / SEVERED'}</span>
            </span>
          ) : isTraversed ? (
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${style.badge}`}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full ${style.pulseColor} opacity-75`}
                />
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${style.pulseColor}`}
                />
              </span>
              <span>{lang === 'es' ? 'EN TRÁNSITO' : 'IN-TRANSIT'}</span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-medium border ${style.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {node.tag}
            </span>
          )}
        </div>
      </div>

      {/* Node Title & Subtitle */}
      <h4
        className={`font-mono text-xs sm:text-sm font-bold tracking-tight flex items-center gap-1.5 ${
          isFailed ? 'text-red-300 line-through' : 'text-white'
        }`}
      >
        {isFailed && <span className="text-red-400 no-underline font-normal">✕</span>}
        {node.title}
      </h4>
      <p className="text-[11px] sm:text-xs text-zinc-400 mt-1 leading-relaxed">
        {node.subtitle[lang]}
      </p>

      {/* Dynamic Lens Contract Badge */}
      <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
        {lens === 'product' && node.productBadge ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <span className="text-emerald-400">✦</span>
            <span>{node.productBadge[lang]}</span>
          </span>
        ) : node.archBadge ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <span className="text-indigo-400">⚡</span>
            <span>{node.archBadge[lang]}</span>
          </span>
        ) : null}

        {isFailed && (
          <span className="text-[10px] font-mono text-red-400 font-semibold">
            {lang === 'es' ? 'Fallo inducido' : 'Fault injected'}
          </span>
        )}

        {!isFailed && !chaosMode && (
          <span className="text-[10px] font-mono text-zinc-500 group-hover:text-indigo-300 transition-colors hidden sm:inline-flex items-center gap-1">
            <span>{lang === 'es' ? 'Detalles' : 'Details'}</span>
            <span>↗</span>
          </span>
        )}
      </div>
    </div>
  )
}

function NodeInspectorModal({
  node,
  lang,
  lens,
  onClose,
}: {
  node: ArchitectureNode
  lang: 'es' | 'en'
  lens: Lens
  onClose: () => void
}) {
  const style = CATEGORY_STYLES[node.category]

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-lg bg-[#0c0f16] border border-white/20 rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-300 font-sans space-y-4 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${style.badge}`}>
                {node.stage} / {node.stageLabel[lang]}
              </span>
              <span className="text-[10px] font-mono text-zinc-500">{node.tag}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-mono">{node.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer text-sm font-mono"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Subtitle / Description */}
        <p className="text-xs text-zinc-300 leading-relaxed">{node.subtitle[lang]}</p>

        {/* Contract to Next Component */}
        {node.contractToNext && (
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block font-semibold">
              {lang === 'es' ? 'Contrato de Interfaz & Protocolo' : 'Interface Contract & Protocol'}
            </span>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
              <span className="text-white font-medium">{node.contractToNext.label}</span>
              <span className="text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 text-[11px] self-start sm:self-auto">
                {node.contractToNext.protocol}
              </span>
            </div>
          </div>
        )}

        {/* Resilience / Fallback Protocol */}
        {node.resilienceFallback && (
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-1 text-xs">
            <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block font-semibold">
              {lang === 'es' ? 'Estrategia de Resiliencia & Failover' : 'Resilience & Failover Strategy'}
            </span>
            <p className="text-zinc-300 font-mono text-[11px] leading-relaxed">
              {node.resilienceFallback[lang]}
            </p>
          </div>
        )}

        {/* Dual Lens Perspective */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
          <div className={`p-2.5 rounded-lg border ${lens === 'product' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.02] border-white/[0.06]'}`}>
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 block mb-0.5 font-bold">
              {lang === 'es' ? 'Visión Producto' : 'Product View'}
            </span>
            <span className="text-zinc-200 text-[11px]">{node.productBadge ? node.productBadge[lang] : '-'}</span>
          </div>
          <div className={`p-2.5 rounded-lg border ${lens === 'arch' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/[0.02] border-white/[0.06]'}`}>
            <span className="text-[9px] uppercase tracking-wider text-indigo-400 block mb-0.5 font-bold">
              {lang === 'es' ? 'Visión Arquitectura' : 'Arch View'}
            </span>
            <span className="text-zinc-200 text-[11px]">{node.archBadge ? node.archBadge[lang] : '-'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/[0.06] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-medium transition-colors cursor-pointer"
          >
            {lang === 'es' ? 'Cerrar Ficha' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Connector({
  contract,
  bidirectional,
  isTransmitting,
  isSevered,
}: {
  contract: { label: string; protocol: string; bidirectional?: boolean }
  bidirectional?: boolean
  isTransmitting?: boolean
  isSevered?: boolean
}) {
  const isBidi = bidirectional ?? contract.bidirectional ?? false

  return (
    <div className="flex flex-col items-center justify-center py-2 px-1 relative my-0.5">
      {/* Top connector line */}
      <div
        className={`w-[1px] h-6 transition-all duration-300 ${
          isSevered
            ? 'bg-red-500/40 border-r border-dashed border-red-500'
            : isTransmitting
            ? 'w-[2px] bg-gradient-to-b from-sky-400 via-indigo-400 to-indigo-300 shadow-[0_0_12px_rgba(56,189,248,0.7)]'
            : 'bg-gradient-to-b from-white/20 via-indigo-500/40 to-white/20'
        }`}
      />

      {/* Contract pill */}
      <div
        className={`my-1.5 px-3 py-1 rounded-full text-[10px] font-mono flex items-center gap-2 shadow-sm transition-all duration-300 ${
          isSevered
            ? 'bg-red-950/60 border border-red-500/50 text-red-200'
            : isTransmitting
            ? 'bg-[#151c33] border border-sky-400 text-sky-200 shadow-md shadow-sky-500/20'
            : 'bg-[#121622] border border-indigo-500/30 text-indigo-200 shadow-black/40'
        }`}
      >
        <span
          className={`font-bold ${
            isSevered
              ? 'text-red-400'
              : isTransmitting
              ? 'text-sky-300 animate-pulse'
              : 'text-indigo-400'
          }`}
        >
          {isSevered ? '✕' : isBidi ? '⇅' : '↓'}
        </span>
        <span className="font-semibold text-zinc-200">{contract.label}</span>
        <span className="text-zinc-500 hidden sm:inline">&bull;</span>
        <span className="text-zinc-400 hidden sm:inline">{contract.protocol}</span>
      </div>

      {/* Bottom connector line */}
      <div
        className={`w-[1px] h-6 transition-all duration-300 ${
          isSevered
            ? 'bg-red-500/40 border-r border-dashed border-red-500'
            : isTransmitting
            ? 'w-[2px] bg-gradient-to-b from-indigo-300 via-indigo-400 to-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.7)]'
            : 'bg-gradient-to-b from-white/20 via-indigo-500/40 to-white/20'
        }`}
      />
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
  lens: propLens,
}: {
  systemId: string
  rawTopology: string
  lang: 'es' | 'en'
  lens?: Lens
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual')
  const [copied, setCopied] = useState(false)

  // Lens context integration
  const { lens: contextLens } = useLens()
  const effectiveLens: Lens = propLens ?? contextLens ?? 'arch'

  const structured = TOPOLOGIES[systemId]

  // Zoom & Node Inspection State (Interactive Canvas Engine)
  const [zoomLevel, setZoomLevel] = useState<number>(1.0)
  const [inspectedNode, setInspectedNode] = useState<ArchitectureNode | null>(null)

  const handleCanvasWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY < 0 ? 0.1 : -0.1
      setZoomLevel((prev) => Math.min(1.5, Math.max(0.7, parseFloat((prev + delta).toFixed(2)))))
    }
  }

  // Interactive Simulation: Packet Trace State
  const [traceStatus, setTraceStatus] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle')
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1)
  const traceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Interactive Simulation: Chaos / Fault Injection State
  const [chaosMode, setChaosMode] = useState<boolean>(false)
  const [failedNodeIds, setFailedNodeIds] = useState<string[]>([])

  const traceSteps = structured?.traceSteps ?? []

  // Clean timer on unmount or system change
  const stopTraceTimer = useCallback(() => {
    if (traceTimerRef.current) {
      clearInterval(traceTimerRef.current)
      traceTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => stopTraceTimer()
  }, [stopTraceTimer])

  // Stop simulation if systemId changes
  const [prevSysId, setPrevSysId] = useState(systemId)
  if (prevSysId !== systemId) {
    setPrevSysId(systemId)
    setTraceStatus('idle')
    setCurrentStepIndex(-1)
    setFailedNodeIds([])
  }

  useEffect(() => {
    stopTraceTimer()
  }, [systemId, stopTraceTimer])

  // Helper to find all nodes in current topology
  const getAllNodes = useCallback((): ArchitectureNode[] => {
    if (!structured) return []
    const list = [...structured.nodes]
    if (structured.bifurcation) {
      for (const branch of structured.bifurcation.branches) {
        list.push(branch.node)
      }
    }
    return list
  }, [structured])

  // Run or Resume Packet Trace
  const handleStartTrace = () => {
    if (traceSteps.length === 0) return
    stopTraceTimer()
    setTraceStatus('running')

    // If starting fresh or from completed, start at 0
    const nextStep = currentStepIndex < 0 || currentStepIndex >= traceSteps.length - 1 ? 0 : currentStepIndex + 1
    setCurrentStepIndex(nextStep)

    traceTimerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        const next = prev + 1
        if (next >= traceSteps.length) {
          stopTraceTimer()
          setTraceStatus('completed')
          return prev
        }
        return next
      })
    }, 1300)
  }

  const handlePauseTrace = () => {
    stopTraceTimer()
    setTraceStatus('paused')
  }

  const handleResetTrace = () => {
    stopTraceTimer()
    setTraceStatus('idle')
    setCurrentStepIndex(-1)
  }

  // Chaos Testing: Toggle Fault on Node
  const handleToggleFault = (nodeId: string) => {
    setFailedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    )
  }

  const handleRestoreAllNodes = () => {
    setFailedNodeIds([])
  }

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

  // Active traversed nodes calculation
  const currentStepDef = currentStepIndex >= 0 && currentStepIndex < traceSteps.length ? traceSteps[currentStepIndex] : null
  const activeTraversedNodeIds = currentStepDef
    ? Array.isArray(currentStepDef.nodeId)
      ? currentStepDef.nodeId
      : [currentStepDef.nodeId]
    : []

  // Telemetry logs up to currentStepIndex
  const activeTelemetryLogs = traceSteps.slice(0, currentStepIndex + 1)

  // Collect active resilience fallbacks for currently failed nodes
  const allNodes = getAllNodes()
  const failedNodes = allNodes.filter((n) => failedNodeIds.includes(n.id))

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

        {/* Action Row: Primary Blueprint Inspector + Fast Simulator Launch */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true)
            }}
            className="flex-1 w-full py-2.5 px-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/15 hover:border-indigo-500/50 text-indigo-300 hover:text-white text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group shadow-sm shadow-indigo-500/10"
          >
            <span className="text-indigo-400 group-hover:scale-110 transition-transform">📐</span>
            <span>
              {lang === 'es'
                ? 'Inspeccionar Blueprint & Simulación'
                : 'Inspect Blueprint & Simulation'}
            </span>
            <span className="text-xs text-indigo-400 group-hover:translate-x-0.5 transition-transform">↗</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true)
              setTimeout(() => handleStartTrace(), 250)
            }}
            className="w-full sm:w-auto py-2.5 px-3 rounded-lg border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
            title={lang === 'es' ? 'Abrir e iniciar simulador de paquetes' : 'Open and start packet simulator'}
          >
            <span className="text-sky-400">▶</span>
            <span>{lang === 'es' ? 'Packet Trace' : 'Packet Trace'}</span>
          </button>
        </div>
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
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#07090d] border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#0a0d13] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                    {lang === 'es' ? '📐 Blueprint Técnico & Contratos' : '📐 Architecture Blueprint & Contracts'}
                  </span>
                  <span className="text-zinc-600 font-mono text-[10px]">&bull;</span>
                  <span className="font-mono text-[10px] text-indigo-400 uppercase tracking-wider font-semibold">
                    Interactive Engine
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
                    type="button"
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
                    type="button"
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
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title={lang === 'es' ? 'Cerrar (Esc)' : 'Close (Esc)'}
                  aria-label={lang === 'es' ? 'Cerrar modal' : 'Close modal'}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* ─── INTERACTIVE CONTROL DECK (Packet Trace + Chaos Mode + Lens) ─── */}
            {viewMode === 'visual' && structured && (
              <div className="px-4 py-2.5 bg-[#0a0e17] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs font-mono shrink-0">
                {/* Left: Simulation & Packet Trace Controls */}
                <div className="flex flex-wrap items-center gap-2">
                  {traceStatus === 'running' ? (
                    <button
                      type="button"
                      onClick={handlePauseTrace}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <span>⏸</span>
                      <span>{lang === 'es' ? 'Pausar Trace' : 'Pause Trace'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartTrace}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-600/30"
                    >
                      <span>▶</span>
                      <span>
                        {traceStatus === 'paused'
                          ? lang === 'es' ? 'Continuar Trace' : 'Resume Trace'
                          : lang === 'es' ? '▶ Run Packet Trace' : '▶ Run Packet Trace'}
                      </span>
                    </button>
                  )}

                  {(traceStatus !== 'idle' || currentStepIndex >= 0) && (
                    <button
                      type="button"
                      onClick={handleResetTrace}
                      className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                      title={lang === 'es' ? 'Reiniciar simulación' : 'Reset simulation'}
                    >
                      <span>↺</span>
                      <span className="hidden sm:inline ml-1">{lang === 'es' ? 'Reiniciar' : 'Reset'}</span>
                    </button>
                  )}

                  {traceStatus === 'running' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                      <span>{lang === 'es' ? `Paso ${currentStepIndex + 1}/${traceSteps.length}` : `Step ${currentStepIndex + 1}/${traceSteps.length}`}</span>
                    </span>
                  )}
                </div>

                {/* Right: Chaos Mode & Dynamic Lens Control */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Chaos Testing Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      setChaosMode((prev) => !prev)
                      if (chaosMode) {
                        setFailedNodeIds([])
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                      chaosMode
                        ? 'bg-red-500/20 border-red-500/50 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.25)]'
                        : 'bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span className={chaosMode ? 'animate-pulse text-red-400' : 'text-amber-400'}>⚡</span>
                    <span>
                      {chaosMode
                        ? lang === 'es' ? 'Chaos Activo' : 'Chaos Active'
                        : lang === 'es' ? '⚡ Chaos Mode' : '⚡ Fault Injection'}
                    </span>
                  </button>

                  {chaosMode && failedNodeIds.length > 0 && (
                    <button
                      type="button"
                      onClick={handleRestoreAllNodes}
                      className="px-2.5 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      <span>✓</span>
                      <span className="ml-1">{lang === 'es' ? 'Restaurar Nodos' : 'Restore All'}</span>
                    </button>
                  )}

                  {/* Interactive Zoom Controls */}
                  <div className="flex items-center gap-1 p-0.5 rounded-lg border border-white/10 bg-white/[0.03]">
                    <button
                      type="button"
                      onClick={() => setZoomLevel((prev) => Math.max(0.7, parseFloat((prev - 0.1).toFixed(2))))}
                      disabled={zoomLevel <= 0.7}
                      className="px-2 py-0.5 rounded text-xs font-mono font-bold text-zinc-300 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer"
                      title={lang === 'es' ? 'Alejar zoom (-10%)' : 'Zoom Out (-10%)'}
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(1.0)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title={lang === 'es' ? 'Restablecer zoom a 100%' : 'Reset zoom to 100%'}
                    >
                      {Math.round(zoomLevel * 100)}%
                    </button>
                    <button
                      type="button"
                      onClick={() => setZoomLevel((prev) => Math.min(1.5, parseFloat((prev + 0.1).toFixed(2))))}
                      disabled={zoomLevel >= 1.5}
                      className="px-2 py-0.5 rounded text-xs font-mono font-bold text-zinc-300 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500 cursor-pointer"
                      title={lang === 'es' ? 'Acercar zoom (+10%)' : 'Zoom In (+10%)'}
                    >
                      +
                    </button>
                  </div>

                  {/* Synchronized Global Lens Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border border-white/10 bg-white/[0.02] text-[10px] font-mono text-zinc-400">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        effectiveLens === 'product' ? 'bg-emerald-400' : 'bg-indigo-400'
                      }`}
                    />
                    <span>
                      {effectiveLens === 'product'
                        ? (lang === 'es' ? 'Producto' : 'Product')
                        : (lang === 'es' ? 'Arquitectura' : 'Arch')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Architecture Spec Attributes Strip in Modal */}
            {structured && (
              <div className="px-4 py-2 bg-black/50 border-b border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono shrink-0">
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

            {/* Modal Body Canvas with Interactive Wheel Zoom */}
            <div
              onWheel={handleCanvasWheel}
              className="p-4 sm:p-6 bg-[#080a0f] [background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:20px_20px] overflow-y-auto flex-1 space-y-5"
            >
              {viewMode === 'visual' && structured ? (
                <div>
                  {/* Interactive Canvas Controls Bar (Zoom & Pan Guide) */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-white/[0.08] text-[11px] font-mono text-zinc-400">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">🔍</span>
                      <span>
                        {lang === 'es'
                          ? `Zoom: ${Math.round(zoomLevel * 100)}% (Ctrl + Rueda para ampliar/reducir)`
                          : `Zoom: ${Math.round(zoomLevel * 100)}% (Ctrl + Scroll to zoom)`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-500 text-[10px]">
                        {lang === 'es' ? 'Click en nodos para ver contratos' : 'Click nodes to inspect contracts'}
                      </span>
                    </div>
                  </div>

                  {/* Chaos Mode Guidance Banner */}
                  {chaosMode && (
                    <div className="mb-4 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-xs font-mono flex items-start gap-2.5 shadow-md">
                      <span className="text-amber-400 text-base leading-none">⚡</span>
                      <div className="flex-1">
                        <p className="font-semibold text-amber-300">
                          {lang === 'es'
                            ? 'Chaos Testing / Inyección de Fallos Activa'
                            : 'Chaos Testing / Fault Injection Mode Active'}
                        </p>
                        <p className="text-[11px] text-zinc-300 mt-0.5">
                          {lang === 'es'
                            ? 'Hacé click en cualquier nodo para simular una caída o conexión cortada y observar el protocolo de resiliencia.'
                            : 'Click any topology node to simulate failure or severed connection and observe the resilience fallback protocol.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contextual Resilience Fallback Protocol Banner */}
                  {failedNodes.length > 0 && (
                    <div className="mb-4 p-4 rounded-xl border border-red-500/40 bg-red-950/30 text-xs font-mono space-y-2 shadow-lg shadow-red-950/30 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-bold text-sm">🛡</span>
                          <span className="font-bold text-red-200 uppercase tracking-wider text-[11px]">
                            {lang === 'es'
                              ? 'Protocolo de Resiliencia & Tolerancia a Fallos Activado'
                              : 'Resilience Fallback Protocol Engaged'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRestoreAllNodes}
                          className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold hover:bg-emerald-500/30 transition-colors cursor-pointer"
                        >
                          {lang === 'es' ? 'Restaurar Todo' : 'Restore All'}
                        </button>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        {failedNodes.map((fn) => (
                          <div key={fn.id} className="flex items-start gap-2 text-zinc-300">
                            <span className="text-red-400 shrink-0 font-bold">⚠</span>
                            <div className="flex-1">
                              <span className="font-bold text-white mr-1.5">[{fn.title}]:</span>
                              <span className="text-red-200 font-medium">
                                {fn.resilienceFallback
                                  ? fn.resilienceFallback[lang]
                                  : lang === 'es'
                                  ? 'Aislamiento de fallo activo. Circuit breaker activado para prevenir cascada.'
                                  : 'Fault isolated. Circuit breaker tripped to prevent cascade.'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Zoomable Container */}
                  <div
                    className="origin-top transition-transform duration-150 ease-out"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    {/* Architecture Topology Diagram */}
                    {structured.layout === 'pipeline' ? (
                      /* Linear Sequenced Pipeline */
                      <div className="max-w-2xl mx-auto space-y-1">
                        {structured.nodes.map((node) => {
                          const isTraversed = activeTraversedNodeIds.includes(node.id)
                          const isFailed = failedNodeIds.includes(node.id)

                          return (
                            <div key={node.id}>
                              <NodeCard
                                node={node}
                                lang={lang}
                                lens={effectiveLens}
                                isTraversed={isTraversed}
                                isFailed={isFailed}
                                chaosMode={chaosMode}
                                onNodeClick={() => handleToggleFault(node.id)}
                                onInspectNode={(n) => setInspectedNode(n)}
                              />
                              {node.contractToNext && (
                                <Connector
                                  contract={node.contractToNext}
                                  isTransmitting={isTraversed}
                                  isSevered={isFailed}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      /* Bifurcated Hub-and-Spoke (Gripm) */
                      <div className="max-w-2xl mx-auto space-y-1">
                        {/* Stage 1: Consumer Host */}
                        <NodeCard
                          node={structured.nodes[0]}
                          lang={lang}
                          lens={effectiveLens}
                          isTraversed={activeTraversedNodeIds.includes(structured.nodes[0].id)}
                          isFailed={failedNodeIds.includes(structured.nodes[0].id)}
                          chaosMode={chaosMode}
                          onNodeClick={() => handleToggleFault(structured.nodes[0].id)}
                          onInspectNode={(n) => setInspectedNode(n)}
                        />

                        {/* Connector Host -> Daemon */}
                        {structured.nodes[0].contractToNext && (
                          <Connector
                            contract={structured.nodes[0].contractToNext}
                            isTransmitting={
                              activeTraversedNodeIds.includes(structured.nodes[0].id) ||
                              activeTraversedNodeIds.includes(structured.nodes[1].id)
                            }
                            isSevered={
                              failedNodeIds.includes(structured.nodes[0].id) ||
                              failedNodeIds.includes(structured.nodes[1].id)
                            }
                          />
                        )}

                        {/* Stage 2: Central Daemon Hub */}
                        <NodeCard
                          node={structured.nodes[1]}
                          lang={lang}
                          lens={effectiveLens}
                          isTraversed={activeTraversedNodeIds.includes(structured.nodes[1].id)}
                          isFailed={failedNodeIds.includes(structured.nodes[1].id)}
                          chaosMode={chaosMode}
                          onNodeClick={() => handleToggleFault(structured.nodes[1].id)}
                          onInspectNode={(n) => setInspectedNode(n)}
                        />

                        {/* Bifurcated Split Indicator */}
                        <div className="flex flex-col items-center justify-center py-2 px-1 relative my-0.5">
                          <div
                            className={`w-[1px] h-5 transition-colors ${
                              failedNodeIds.includes(structured.nodes[1].id)
                                ? 'bg-red-500/40'
                                : 'bg-gradient-to-b from-white/20 via-indigo-500/40 to-white/20'
                            }`}
                          />
                          <div className="my-1 px-3 py-1 rounded-full bg-[#121622] border border-indigo-500/30 text-indigo-200 text-[10px] font-mono flex items-center gap-1.5 shadow-sm shadow-black/40">
                            <span className="text-indigo-400 font-bold">⇄</span>
                            <span>
                              {lang === 'es'
                                ? 'Bifurcación de Estados Concurrente'
                                : 'Concurrent State Bifurcation'}
                            </span>
                          </div>
                          <div
                            className={`w-[1px] h-5 transition-colors ${
                              failedNodeIds.includes(structured.nodes[1].id)
                                ? 'bg-red-500/40'
                                : 'bg-gradient-to-b from-white/20 via-indigo-500/40 to-white/20'
                            }`}
                          />
                        </div>

                        {/* Branches Grid */}
                        {structured.bifurcation && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            {structured.bifurcation.branches.map((b) => {
                              const isBranchTraversed = activeTraversedNodeIds.includes(b.node.id)
                              const isBranchFailed = failedNodeIds.includes(b.node.id)

                              return (
                                <div key={b.node.id} className="space-y-2">
                                  <div
                                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono text-center truncate transition-colors ${
                                      isBranchFailed
                                        ? 'bg-red-950/40 border border-red-500/30 text-red-300'
                                        : isBranchTraversed
                                        ? 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-200 font-semibold'
                                        : 'bg-white/[0.02] border border-white/[0.06] text-zinc-400'
                                    }`}
                                  >
                                    {b.contract}
                                  </div>
                                  <NodeCard
                                    node={b.node}
                                    lang={lang}
                                    lens={effectiveLens}
                                    isTraversed={isBranchTraversed}
                                    isFailed={isBranchFailed}
                                    chaosMode={chaosMode}
                                    onNodeClick={() => handleToggleFault(b.node.id)}
                                    onInspectNode={(n) => setInspectedNode(n)}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ─── SLEEK TRACE TELEMETRY LOG BAR ─── */}
                  <div className="mt-8 border border-white/10 rounded-xl bg-black/75 p-3.5 backdrop-blur font-mono text-xs shadow-inner">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-2.5 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            traceStatus === 'running'
                              ? 'bg-sky-400 animate-ping'
                              : traceStatus === 'completed'
                              ? 'bg-emerald-400'
                              : 'bg-zinc-600'
                          }`}
                        />
                        <span className="text-[11px] font-bold text-zinc-200 uppercase tracking-wider">
                          {lang === 'es' ? 'Telemetría de Tráfico en Vivo (Trace Telemetry)' : 'Live Trace Telemetry Stream'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] text-zinc-400">
                        {currentStepIndex >= 0 ? (
                          <span>
                            {lang === 'es' ? 'Latencia acumulada:' : 'Accumulated latency:'}{' '}
                            <span className="text-sky-300 font-bold">
                              {traceSteps[currentStepIndex]?.timeOffset ?? '+0ms'}
                            </span>
                          </span>
                        ) : null}
                        <span className="text-zinc-600 hidden sm:inline">&bull;</span>
                        <span className="text-zinc-400">
                          {traceStatus === 'running'
                            ? lang === 'es' ? 'Transfiriendo paquetes...' : 'Streaming packets...'
                            : traceStatus === 'completed'
                            ? lang === 'es' ? '✓ Trace Completado (0 paquetes perdidos)' : '✓ Trace Completed (0 packets dropped)'
                            : lang === 'es' ? 'Listo para simular' : 'Ready to simulate'}
                        </span>
                      </div>
                    </div>

                    {/* Step-by-step Telemetry Stream */}
                    {activeTelemetryLogs.length === 0 ? (
                      <div className="py-3 text-center text-zinc-500 text-[11px]">
                        {lang === 'es'
                          ? 'Presioná "▶ Run Packet Trace" para despachar una secuencia de eventos y visualizar latencias paso a paso.'
                          : 'Press "▶ Run Packet Trace" to dispatch event telemetry sequence and inspect step micro-latencies.'}
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                        {activeTelemetryLogs.map((log) => {
                          const isCurrent = log.step === currentStepIndex
                          const nodeCategory = log.category
                          const catBadge = CATEGORY_STYLES[nodeCategory].badge

                          return (
                            <div
                              key={log.step}
                              className={`p-2 rounded-lg border text-[11px] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                isCurrent
                                  ? 'bg-indigo-950/40 border-sky-400/40 text-white shadow-sm'
                                  : 'bg-white/[0.02] border-white/[0.04] text-zinc-400'
                              }`}
                            >
                              <div className="flex items-start sm:items-center gap-2">
                                <span className="font-bold text-sky-400 shrink-0 font-mono">
                                  [{log.timeOffset}]
                                </span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] border font-mono shrink-0 ${catBadge}`}>
                                  {log.action[lang]}
                                </span>
                                <span className="text-zinc-300 truncate">
                                  {log.detail[lang]}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 shrink-0 font-mono">
                                <span className="text-emerald-400">ACK 200</span>
                                {isCurrent && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Architecture Legend */}
                  <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-[10px] font-mono text-zinc-500">
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
                      type="button"
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
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors ml-auto cursor-pointer"
              >
                {lang === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>

          {/* Dedicated Node Inspection Modal (High-Fidelity Popover) */}
          {inspectedNode && (
            <NodeInspectorModal
              node={inspectedNode}
              lang={lang}
              lens={effectiveLens}
              onClose={() => setInspectedNode(null)}
            />
          )}
        </div>
      )}
    </>
  )
}
