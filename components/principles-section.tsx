'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useLens } from '@/lib/lens-context'
import { t } from '@/lib/translations'
import { principles } from '@/lib/content'
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Building2,
  Terminal,
  Scale,
  ArrowUpRight,
  Compass,
} from 'lucide-react'

interface ContextualADR {
  id: string
  adrNumber: string
  icon: typeof Zap
  badge: { es: string; en: string }
  title: { es: string; en: string }
  scenario: {
    context: { es: string; en: string }
    tension: { es: string; en: string }
  }
  tradeOffs: {
    gains: { es: string; en: string }[]
    sacrifices: { es: string; en: string }[]
  }
  decision: {
    recommendation: { es: string; en: string }
    reversibility: {
      type: 'Tipo 1 (Cambio estructural)' | 'Tipo 2 (Alta reversibilidad)'
      typeEn: 'Type 1 (Structural change)' | 'Type 2 (Highly reversible)'
      rationale: { es: string; en: string }
    }
  }
  lensPerspective: {
    product: {
      focus: { es: string; en: string }
      metrics: [{ es: string; en: string }, { es: string; en: string }]
    }
    arch: {
      focus: { es: string; en: string }
      metrics: [{ es: string; en: string }, { es: string; en: string }]
    }
  }
}

const CONTEXTUAL_ADRS: ContextualADR[] = [
  {
    id: 'startup-01',
    adrNumber: 'ADR-001',
    icon: Zap,
    badge: {
      es: 'Fase 0→1 · Startups & Validación',
      en: '0→1 Phase · Startups & Validation',
    },
    title: {
      es: 'Velocidad de Validación vs. Escalabilidad Anticipada',
      en: 'Validation Speed vs. Premature Scaling',
    },
    scenario: {
      context: {
        es: 'Etapa inicial con recursos acotados. El principal desafío del negocio es validar rápido si la propuesta genera valor real para los usuarios antes de comprometer meses de desarrollo.',
        en: 'Early stage with bounded resources. The main business challenge is quickly validating whether the proposal creates real value for users before committing months of engineering.',
      },
      tension: {
        es: 'Construir una arquitectura distribuida compleja desde el primer día vs. Priorizar entregas frecuentes con usuarios reales manteniendo un diseño interno ordenado.',
        en: 'Building a complex distributed architecture from day one vs. Prioritizing frequent deliveries with real users while keeping internal boundaries clean.',
      },
    },
    tradeOffs: {
      gains: [
        {
          es: 'Llegada rápida al mercado para validar valor real (Time-to-Value < 3 semanas).',
          en: 'Fast time-to-market to validate real user value (Time-to-Value < 3 weeks).',
        },
        {
          es: 'Operación simple: despliegues directos sin costos fijos ni complejidad de infraestructura pesada.',
          en: 'Simple operations: straightforward deploys without heavy infrastructure overhead.',
        },
        {
          es: 'Flexibilidad para adaptar el producto según el aprendizaje con primeros clientes.',
          en: 'Flexibility to adapt the product based on real customer feedback.',
        },
      ],
      sacrifices: [
        {
          es: 'Se posterga la escalabilidad masiva en el día uno (se diseña para el crecimiento cercano, no para millones de usuarios aún inexistentes).',
          en: 'Postpones massive day-one scale (designed for near-term growth rather than hypothetical millions of users).',
        },
        {
          es: 'Requiere cuidar el orden entre módulos para que el código se mantenga limpio a medida que el equipo crece.',
          en: 'Requires maintaining clean module boundaries so the codebase stays tidy as the team grows.',
        },
      ],
    },
    decision: {
      recommendation: {
        es: 'Recomendamos iniciar con un monolito modular bien estructurado sobre infraestructura simple (PaaS/Edge). Desde producto, esto permite validar hipótesis rápido y cuidar el presupuesto; desde arquitectura, mantener los dominios separados facilita extraer servicios más adelante solo cuando el crecimiento real lo justifique.',
        en: 'We recommend starting with a well-structured modular monolith on simple infrastructure (PaaS/Edge). From a product perspective, this validates hypotheses quickly while protecting budget; from an architecture standpoint, keeping domains separated makes extracting services later straightforward once real traction justifies it.',
      },
      reversibility: {
        type: 'Tipo 2 (Alta reversibilidad)',
        typeEn: 'Type 2 (Highly reversible)',
        rationale: {
          es: 'Camino fácil de evolucionar. Al mantener los módulos desacoplados en el código, separar un componente en un servicio independiente cuando el negocio crezca toma días, no meses.',
          en: 'Easy to evolve. By keeping modules decoupled in the codebase, extracting a component into an independent service as the business grows takes days, not months.',
        },
      },
    },
    lensPerspective: {
      product: {
        focus: {
          es: 'Propuesta orientada a validar impacto rápido, aprender del usuario real y cuidar el capital inicial.',
          en: 'Proposal focused on validating impact quickly, learning from real users, and protecting initial capital.',
        },
        metrics: [
          {
            es: 'Iteraciones semanales de producto',
            en: 'Weekly product iterations',
          },
          {
            es: 'Infraestructura inicial < $50/mes',
            en: 'Sub-$50/mo initial infrastructure',
          },
        ],
      },
      arch: {
        focus: {
          es: 'Recomendación basada en módulos desacoplados, contratos tipados y una base de datos transaccional confiable.',
          en: 'Recommendation based on decoupled modules, typed contracts, and a reliable transactional database.',
        },
        metrics: [
          {
            es: 'Límites de Dominio Aislados',
            en: 'Isolated Domain Boundaries',
          },
          {
            es: 'Tiempo de despliegue < 60s',
            en: 'Deployment time < 60s',
          },
        ],
      },
    },
  },
  {
    id: 'enterprise-noc',
    adrNumber: 'ADR-002',
    icon: Building2,
    badge: {
      es: 'Escala Enterprise · Operaciones Críticas',
      en: 'Enterprise Scale · Critical Operations',
    },
    title: {
      es: 'Continuidad Operativa vs. Velocidad de Cambio',
      en: 'Operational Continuity vs. Speed of Change',
    },
    scenario: {
      context: {
        es: 'Operaciones críticas con más de 3.500 usuarios concurrentes y 130.000+ incidentes mensuales. Cualquier interrupción o inconsistencia afecta directamente la atención de red.',
        en: 'Critical operations with 3,500+ concurrent users and 130k+ monthly incidents. Any service interruption or data inconsistency directly impacts network support.',
      },
      tension: {
        es: 'Introducir mejoras con agilidad vs. Asegurar estabilidad transaccional, trazabilidad de auditoría y alineación con procesos operativos (ITIL / OSS).',
        en: 'Introducing improvements with agility vs. Ensuring transactional stability, audit traceability, and alignment with operational processes (ITIL / OSS).',
      },
    },
    tradeOffs: {
      gains: [
        {
          es: 'Mayor estabilidad: el uso de colas asíncronas evita que la falla de un servicio detenga toda la operación.',
          en: 'Higher stability: async queues prevent a single component failure from halting overall operations.',
        },
        {
          es: 'Trazabilidad clara de punta a punta para auditoría y mejora continua de procesos.',
          en: 'Clear end-to-end traceability for auditing and continuous process improvement.',
        },
        {
          es: 'Transiciones y migraciones en producción cuidando la continuidad del servicio.',
          en: 'Smooth production migrations that protect continuous service availability.',
        },
      ],
      sacrifices: [
        {
          es: 'Ciclos de validación y pruebas más cuidadosos antes de cada salida a producción.',
          en: 'More thorough validation and regression cycles required prior to each production release.',
        },
        {
          es: 'Requiere invertir en monitoreo y observabilidad para seguir el flujo entre plataformas.',
          en: 'Requires investing in observability and monitoring to track flows across platforms.',
        },
      ],
    },
    decision: {
      recommendation: {
        es: 'Proponemos una integración desacoplada orientada a eventos, definiendo una fuente única de registro en BMC Helix ITSM + NetOps y contratos claros entre sistemas. Esto permite modernizar la operación gradualmente y reducir tiempos de resolución sin interrumpir el trabajo diario.',
        en: 'We propose a decoupled event-driven integration with a clear Source of Record in BMC Helix ITSM + NetOps and well-defined contracts across systems. This enables gradual operational modernization and faster resolution times without disrupting daily work.',
      },
      reversibility: {
        type: 'Tipo 1 (Cambio estructural)',
        typeEn: 'Type 1 (Structural change)',
        rationale: {
          es: 'Decisión de largo plazo. En operaciones de alcance nacional, evolucionar el flujo central de tickets requiere planificación por etapas y acompañamiento a miles de operadores.',
          en: 'Long-term structural decision. In nationwide operations, evolving the core ticketing flow requires phased planning and change management across thousands of operators.',
        },
      },
    },
    lensPerspective: {
      product: {
        focus: {
          es: 'Solución enfocada en reducir tiempos de resolución (-25% MTTR), simplificar la tarea del operador y acompañar la adopción.',
          en: 'Solution focused on reducing resolution times (-25% MTTR), simplifying operator workflows, and supporting smooth adoption.',
        },
        metrics: [
          {
            es: '130k+ incidentes/mes gestionados',
            en: '130k+ incidents/mo managed',
          },
          {
            es: 'Cero interrupciones operativas',
            en: 'Zero operational interruptions',
          },
        ],
      },
      arch: {
        focus: {
          es: 'Recomendación de mensajería asíncrona, integraciones idempotentes y contratos alineados a estándares (OpenAPI / TM Forum ODA).',
          en: 'Recommendation for async messaging, idempotent integrations, and standards-aligned contracts (OpenAPI / TM Forum ODA).',
        },
        metrics: [
          {
            es: 'SLA de Disponibilidad 99.98%',
            en: '99.98% Availability SLA',
          },
          {
            es: 'Integraciones Idempotentes',
            en: 'Idempotent Integrations',
          },
        ],
      },
    },
  },
  {
    id: 'local-first-ai',
    adrNumber: 'ADR-003',
    icon: Terminal,
    badge: {
      es: 'Privacidad & IA · Herramientas Local-First',
      en: 'Privacy & AI · Local-First Tooling',
    },
    title: {
      es: 'Privacidad en el Dispositivo vs. Centralización en la Nube',
      en: 'On-Device Privacy vs. Cloud Centralization',
    },
    scenario: {
      context: {
        es: 'Herramientas de trabajo para desarrolladores (gripm) y finanzas personales (DOM) que interactúan con agentes de IA (Cursor, Claude Code, Antigravity).',
        en: 'Developer workspaces (gripm) and personal finance tools (DOM) that interact with AI agents (Cursor, Claude Code, Antigravity).',
      },
      tension: {
        es: 'Alojar todo en un servicio cloud de terceros para simplificar el acceso vs. Mantener los datos sensibles y el código bajo control directo del usuario.',
        en: 'Hosting everything in a third-party cloud for convenience vs. Keeping sensitive data and code under the user’s direct control.',
      },
    },
    tradeOffs: {
      gains: [
        {
          es: 'Control directo: los datos y el código permanecen en el dispositivo del usuario sin depender de terceros.',
          en: 'Direct control: data and code stay on the user’s device without relying on third parties.',
        },
        {
          es: 'Respuesta inmediata al colaborar localmente con agentes de IA mediante el protocolo MCP.',
          en: 'Immediate response when collaborating locally with AI agents via the MCP protocol.',
        },
        {
          es: 'Autonomía offline: la herramienta funciona en cualquier momento sin requerir suscripciones.',
          en: 'Offline autonomy: the tool works anytime without requiring recurring subscriptions.',
        },
      ],
      sacrifices: [
        {
          es: 'Sincronizar entre varios dispositivos requiere sumar una capa de cifrado en el cliente (AES-GCM).',
          en: 'Syncing across multiple devices requires adding a client-side encryption layer (AES-GCM).',
        },
        {
          es: 'El cuidado de las copias de seguridad locales queda en manos del usuario si no activa un respaldo.',
          en: 'Local backup care remains with the user unless optional encrypted sync is enabled.',
        },
      ],
    },
    decision: {
      recommendation: {
        es: 'Recomendamos una arquitectura local-first conectada con agentes vía Model Context Protocol (MCP). Desde producto, elimina barreras de adopción y protege la privacidad sin costos recurrentes; desde arquitectura, aprovecha el almacenamiento local (Git / IndexedDB) y deja la nube como respaldo cifrado opcional.',
        en: 'We recommend a local-first architecture connected to agents via Model Context Protocol (MCP). From a product view, it removes adoption barriers and protects privacy with zero recurring cost; architecturally, it leverages local storage (Git / IndexedDB) while keeping the cloud as an optional encrypted backup.',
      },
      reversibility: {
        type: 'Tipo 2 (Alta reversibilidad)',
        typeEn: 'Type 2 (Highly reversible)',
        rationale: {
          es: 'Al utilizar formatos abiertos (Markdown, Git, JSON-RPC), es muy sencillo exportar los datos o sumar sincronización cloud en el futuro.',
          en: 'By using open formats (Markdown, Git, JSON-RPC), exporting data or adding cloud sync in the future is straightforward.',
        },
      },
    },
    lensPerspective: {
      product: {
        focus: {
          es: 'Propuesta centrada en eliminar fricción de adopción, evitar costos mensuales y resguardar la información del usuario.',
          en: 'Proposal centered on frictionless adoption, zero monthly costs, and protecting user information.',
        },
        metrics: [
          {
            es: 'Adopción en < 60s vía npx',
            en: 'Adoption in < 60s via npx',
          },
          {
            es: 'Cero dependencia cloud',
            en: 'Zero cloud dependency',
          },
        ],
      },
      arch: {
        focus: {
          es: 'Recomendación de comunicación local vía servidor MCP (stdio), persistencia en disco y cifrado AES-GCM en cliente.',
          en: 'Recommendation for local communication via MCP server (stdio), disk persistence, and client-side AES-GCM encryption.',
        },
        metrics: [
          {
            es: 'Latencia IPC local < 1ms',
            en: 'Local IPC latency < 1ms',
          },
          {
            es: 'Cifrado AES-GCM Client-Side',
            en: 'Client-Side AES-GCM Crypto',
          },
        ],
      },
    },
  },
]

export function PrinciplesSection() {
  const { lang } = useLanguage()
  const { lens } = useLens()
  const [activeContextId, setActiveContextId] = useState<string>(CONTEXTUAL_ADRS[0].id)
  const [activePillarId, setActivePillarId] = useState<string>(principles[0].id)

  const activeADR = CONTEXTUAL_ADRS.find((a) => a.id === activeContextId)!
  const IconComponent = activeADR.icon

  const handlePillarSelect = (pillarId: string, relatedAdrId: string) => {
    setActivePillarId(pillarId)
    setActiveContextId(relatedAdrId)
  }

  return (
    <section id="principles" className="pt-14 pb-24 border-t border-white/[0.04] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section Header */}
        <div className="mb-12 cursor-default">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest block">03</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {lang === 'es' ? 'Enfoque Práctico' : 'Practical Approach'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {t(lang, 'principles.title')}
          </h2>
          <p className="text-sm text-zinc-400 mt-2.5 max-w-2xl leading-relaxed">
            {lang === 'es'
              ? 'Desde arquitectura aportamos recomendaciones técnicas sustentables; desde producto proponemos soluciones de impacto y valor real. Cada escenario requiere entender el contexto, evaluar alternativas y elegir el camino más adecuado.'
              : 'From architecture we provide sustainable technical recommendations; from product we propose solutions focused on real impact and value. Every scenario requires understanding the context, weighing options, and choosing the right path.'}
          </p>
        </div>

        {/* ─── CONTEXTUAL RECOMMENDATIONS MATRIX ─── */}
        <div
          id="principles-matrix"
          className="mb-16 rounded-2xl border border-white/10 bg-[#0a0d13]/90 backdrop-blur-md p-6 sm:p-8 shadow-2xl relative overflow-hidden scroll-mt-24"
        >
          
          {/* Header row: Context Tabs */}
          <div className="pb-6 border-b border-white/[0.08]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 cursor-default">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-2">
                <Scale className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>
                  {lang === 'es'
                    ? 'Explorar Recomendaciones según Escenario:'
                    : 'Explore Recommendations by Scenario:'}
                </span>
              </span>

              {/* Active Lens Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-zinc-300 self-start sm:self-auto">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    lens === 'product' ? 'bg-emerald-400' : 'bg-indigo-400'
                  }`}
                />
                <span>
                  {lens === 'product'
                    ? (lang === 'es' ? 'Lente: Propuesta de Valor (Producto)' : 'Lens: Value Proposal (Product)')
                    : (lang === 'es' ? 'Lente: Recomendación de Arquitectura' : 'Lens: Architecture Recommendation')}
                </span>
              </div>
            </div>

            {/* Context Selector Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {CONTEXTUAL_ADRS.map((adr) => {
                const isSelected = adr.id === activeContextId
                const TabIcon = adr.icon

                return (
                  <button
                    key={adr.id}
                    type="button"
                    onClick={() => setActiveContextId(adr.id)}
                    className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer select-none min-h-[4.75rem] flex flex-col justify-between ${
                      isSelected
                        ? 'bg-white/[0.08] border-indigo-500/40 shadow-lg shadow-indigo-950/30'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 font-bold">{adr.adrNumber}</span>
                      <TabIcon
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? 'text-indigo-400' : 'text-zinc-500'
                        }`}
                      />
                    </div>
                    <p
                      className={`text-xs font-semibold leading-snug ${
                        isSelected ? 'text-white' : 'text-zinc-300'
                      }`}
                    >
                      {adr.badge[lang]}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Active ADR Body */}
          <div className="pt-6 space-y-6 cursor-default">
            
            {/* Title & Context Statement */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {activeADR.badge[lang]}
                </span>
                <span className="text-zinc-600 hidden sm:inline">&bull;</span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {activeADR.adrNumber}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2.5 min-h-[1.75rem]">
                <IconComponent className="w-5 h-5 text-indigo-400 shrink-0" />
                <span>{activeADR.title[lang]}</span>
              </h3>
            </div>

            {/* Context & Tension Boxes */}
            <div className="grid md:grid-cols-2 gap-4 sm:gap-5 text-xs leading-relaxed">
              <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2 font-semibold">
                  {lang === 'es' ? '1. Contexto y Necesidad' : '1. Context & Business Need'}
                </span>
                <p className="text-zinc-300 leading-relaxed">{activeADR.scenario.context[lang]}</p>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 block mb-2 font-semibold">
                  {lang === 'es' ? '2. Desafío a Equilibrar' : '2. Challenge to Balance'}
                </span>
                <p className="text-zinc-300 leading-relaxed">{activeADR.scenario.tension[lang]}</p>
              </div>
            </div>

            {/* Trade-offs (Benefits vs Compromises) */}
            <div className="p-5 sm:p-6 rounded-xl bg-white/[0.015] border border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-4 font-semibold">
                {lang === 'es' ? '3. Balance de la Propuesta (Trade-Offs)' : '3. Proposal Balance (Trade-Offs)'}
              </span>

              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-xs">
                {/* Gains */}
                <div className="p-4 rounded-lg bg-black/25 border border-white/[0.04] space-y-2.5">
                  <span className="text-[11px] font-mono text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{lang === 'es' ? 'Beneficios del enfoque' : 'Benefits of this approach'}</span>
                  </span>
                  <ul className="space-y-2">
                    {activeADR.tradeOffs.gains.map((gain, i) => (
                      <li key={i} className="text-zinc-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-500/80 mt-0.5 shrink-0">+</span>
                        <span>{gain[lang]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Compromises */}
                <div className="p-4 rounded-lg bg-black/25 border border-white/[0.04] space-y-2.5">
                  <span className="text-[11px] font-mono text-zinc-400 font-medium flex items-center gap-1.5">
                    <span className="text-zinc-500 font-bold">~</span>
                    <span>{lang === 'es' ? 'Compromisos a tener en cuenta' : 'Trade-offs to consider'}</span>
                  </span>
                  <ul className="space-y-2">
                    {activeADR.tradeOffs.sacrifices.map((sac, i) => (
                      <li key={i} className="text-zinc-400 flex items-start gap-2 leading-relaxed">
                        <span className="text-zinc-600 mt-0.5 shrink-0">&bull;</span>
                        <span>{sac[lang]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. Architectural Recommendation & Product Solution */}
            <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-indigo-950/30 to-black/60 border border-indigo-500/30 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    {lang === 'es'
                      ? '4. Recomendación & Propuesta de Solución'
                      : '4. Recommendation & Proposed Solution'}
                  </span>
                </span>

                {/* Reversibility Pill */}
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-white/[0.05] border border-white/10 text-zinc-300">
                  {lang === 'es' ? activeADR.decision.reversibility.type : activeADR.decision.reversibility.typeEn}
                </span>
              </div>

              <p className="text-sm text-zinc-100 leading-relaxed">
                {activeADR.decision.recommendation[lang]}
              </p>

              <div className="pt-3 border-t border-white/[0.08] text-xs font-mono text-zinc-400 leading-relaxed">
                <strong className="text-zinc-300">
                  {lang === 'es' ? 'Evolución y Reversibilidad:' : 'Evolution & Reversibility:'}
                </strong>{' '}
                {activeADR.decision.reversibility.rationale[lang]}
              </div>
            </div>

            {/* Lens Reactive Perspective (Well-proportioned left content + 2-line metrics on the right) */}
            <div className="p-4 sm:p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      lens === 'product'
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                        : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.6)]'
                    }`}
                  />
                  <span className="text-zinc-300 font-semibold">
                    {lens === 'product'
                      ? (lang === 'es' ? 'Perspectiva Producto Activa:' : 'Active Product Lens:')
                      : (lang === 'es' ? 'Perspectiva Arquitectura Activa:' : 'Active Architecture Lens:')}
                  </span>
                  <span className="text-[10px] text-zinc-500 hidden sm:inline">
                    {lens === 'product'
                      ? (lang === 'es' ? '· Propuesta de Valor' : '· Value Proposal')
                      : (lang === 'es' ? '· Recomendación Técnica' : '· Technical Recommendation')}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-zinc-200 leading-relaxed sm:pl-4">
                  {lens === 'product'
                    ? activeADR.lensPerspective.product.focus[lang]
                    : activeADR.lensPerspective.arch.focus[lang]}
                </p>
              </div>

              {/* Two-line right-aligned metrics box */}
              <div className="shrink-0 px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/[0.06] flex flex-col justify-center gap-1 md:text-right self-start md:self-center font-mono">
                <span className="text-[11px] text-zinc-200 font-medium leading-tight">
                  {lens === 'product'
                    ? activeADR.lensPerspective.product.metrics[0][lang]
                    : activeADR.lensPerspective.arch.metrics[0][lang]}
                </span>
                <span
                  className={`text-[11px] leading-tight ${
                    lens === 'product' ? 'text-emerald-400/90' : 'text-indigo-400/90'
                  }`}
                >
                  {lens === 'product'
                    ? activeADR.lensPerspective.product.metrics[1][lang]
                    : activeADR.lensPerspective.arch.metrics[1][lang]}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* ─── FOUNDATIONAL DESIGN PILLARS ─── */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-white/[0.04] pb-3 cursor-default">
            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-400/80" />
              <span>
                {lang === 'es' ? 'Pilares Fundacionales de Diseño' : 'Foundational Design Pillars'}
              </span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">
              {lang === 'es'
                ? 'Seleccioná un pilar para vincularlo con su escenario práctico'
                : 'Select a pillar to link it with its practical scenario'}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {principles.map((p) => {
              const isPillarActive = p.id === activePillarId || p.relatedAdrId === activeContextId

              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    handlePillarSelect(p.id, p.relatedAdrId)
                    document.getElementById('principles-matrix')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                  }}
                  className={`group text-left p-5 sm:p-6 rounded-xl border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between gap-4 ${
                    isPillarActive
                      ? 'bg-white/[0.03] border-indigo-500/35 hover:border-indigo-500/50 shadow-lg shadow-indigo-950/10'
                      : 'bg-white/[0.015] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.15]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="font-mono text-xs text-indigo-400/90 font-semibold">{p.number}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06] text-zinc-400 group-hover:text-zinc-200 group-hover:border-white/15 transition-colors">
                        <span>{p.relatedLabel[lang]}</span>
                        <ArrowUpRight className="w-3 h-3 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-semibold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                      {p.title[lang]}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {p.body[lang]}
                    </p>
                  </div>

                  {/* Practical Lens Application inside each Pillar */}
                  <div className="pt-3 border-t border-white/[0.05] w-full">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          lens === 'product' ? 'bg-emerald-400' : 'bg-indigo-400'
                        }`}
                      />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                        {lens === 'product'
                          ? (lang === 'es' ? 'Propuesta en Producto:' : 'Product Proposal:')
                          : (lang === 'es' ? 'Recomendación Técnica:' : 'Technical Recommendation:')}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-300 leading-relaxed">
                      {lens === 'product' ? p.productProposal[lang] : p.archRecommendation[lang]}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
