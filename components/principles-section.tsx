'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useLens } from '@/lib/lens-context'
import { t } from '@/lib/translations'
import { principles } from '@/lib/content'
import {
  Scale,
  SlidersHorizontal,
  Layers,
  Cpu,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react'

interface ADRScenario {
  id: string
  adrNumber: string
  title: { es: string; en: string }
  category: { es: string; en: string }
  optimalStance: number // 0-100 percentage
  leftPole: {
    label: { es: string; en: string }
    sub: { es: string; en: string }
    risk: { es: string; en: string }
  }
  rightPole: {
    label: { es: string; en: string }
    sub: { es: string; en: string }
    risk: { es: string; en: string }
  }
  verdict: { es: string; en: string }
  verdictKeyPhrase: { es: string; en: string }
  feedback: {
    leftHeavy: { es: string; en: string }
    balanced: { es: string; en: string }
    rightHeavy: { es: string; en: string }
  }
  lensInsights: {
    product: {
      title: { es: string; en: string }
      rationale: { es: string; en: string }
      metric: { es: string; en: string }
    }
    arch: {
      title: { es: string; en: string }
      rationale: { es: string; en: string }
      metric: { es: string; en: string }
    }
  }
}

const ADR_SCENARIOS: ADRScenario[] = [
  {
    id: 'speed-vs-scale',
    adrNumber: 'ADR-001',
    category: {
      es: 'Ciclo de Vida 0→1 · Pragmatismo',
      en: '0→1 Lifecycle · Pragmatism',
    },
    title: {
      es: 'Speed-to-Market vs. Escalabilidad Infinita',
      en: 'Speed-to-Market vs. Infinite Scalability',
    },
    optimalStance: 35,
    leftPole: {
      label: { es: 'Velocidad 0→1 (Pragmatismo)', en: '0→1 Speed (Pragmatism)' },
      sub: { es: 'Validar PMF con usuarios reales en semanas.', en: 'Validate PMF with real users in weeks.' },
      risk: { es: 'Deuda técnica si no hay límites de dominio.', en: 'Technical debt if boundaries are blurred.' },
    },
    rightPole: {
      label: { es: 'Escalabilidad Infinita (Teoría)', en: 'Infinite Scalability (Theory)' },
      sub: { es: 'Topología multirregión y microservicios prematuros.', en: 'Premature microservices and multi-region infra.' },
      risk: { es: 'Quemar runway antes del primer cliente de pago.', en: 'Burning runway before the first paying user.' },
    },
    verdict: {
      es: 'En fase 0→1, construir para 1M de usuarios antes de validar PMF es procrastinación técnica. Diseñá para 10x, no para 1000x, pero dejá las fronteras modulares intactas.',
      en: 'In the 0→1 phase, building for 1M users before validating PMF is technical procrastination. Design for 10x, not 1000x, but keep modular boundaries intact.',
    },
    verdictKeyPhrase: {
      es: 'Diseñá para 10x, no para 1000x',
      en: 'Design for 10x, not 1000x',
    },
    feedback: {
      leftHeavy: {
        es: '⚠️ Riesgo de Deuda: Cortoplacismo excesivo. Sin contratos tipados, la primera refactorización romperá la base instalada.',
        en: '⚠️ Debt Warning: Excessive short-termism. Without typed contracts, your first pivot will break existing users.',
      },
      balanced: {
        es: '✓ Calibración Óptima: Monolito modular con slices verticales. Velocidad máxima de entrega sin comprometer la capacidad de desacoplar servicios mañana.',
        en: '✓ Optimal Stance: Modular monolith with vertical slices. Maximum delivery velocity without compromising future service decoupling.',
      },
      rightHeavy: {
        es: '⚠️ Riesgo de Parálisis: Procrastinación técnica. Orquestar Kubernetes para 50 usuarios iniciales drena energía del product-market fit.',
        en: '⚠️ Over-Engineering Warning: Technical procrastination. Provisioning Kubernetes clusters for 50 initial users drains runway away from PMF.',
      },
    },
    lensInsights: {
      product: {
        title: { es: 'Impacto de Producto & Negocio', en: 'Product & Business Impact' },
        rationale: {
          es: 'El riesgo existencial de una startup no es caerse por tráfico; es construir en el vacío algo que nadie compra. La agilidad en 0→1 asegura ciclos de aprendizaje semanales con clientes reales.',
          en: 'A startup’s existential risk is never crashing from traffic; it is shipping something nobody wants. 0→1 agility guarantees weekly customer discovery feedback loops.',
        },
        metric: { es: 'Time-to-Paying-Feedback < 3 semanas', en: 'Time-to-Paying-Feedback < 3 weeks' },
      },
      arch: {
        title: { es: 'Mecanismo Arquitectónico', en: 'Architectural Mechanism' },
        rationale: {
          es: 'Modularidad estricta con boundaries limpios: repositorios desacoplados, contratos de API tipados e inversión de dependencias. Si un bounded context requiere escala independiente, se extrae en días.',
          en: 'Strict modularity with clean domain boundaries: decoupled repositories, typed API contracts, and dependency inversion. Any bounded context can be extracted into an independent microservice in days.',
        },
        metric: { es: 'Límites de Dominio Aislados · Single Data Store', en: 'Isolated Domain Boundaries · Single Data Store' },
      },
    },
  },
  {
    id: 'local-vs-cloud',
    adrNumber: 'ADR-002',
    category: {
      es: 'Topología & Soberanía de Datos',
      en: 'Topology & Data Sovereignty',
    },
    title: {
      es: 'Soberanía Local-First vs. Dependencia Cloud',
      en: 'Local-First Sovereignty vs. Cloud Dependency',
    },
    optimalStance: 25,
    leftPole: {
      label: { es: 'Soberanía Local-First', en: 'Local-First Sovereignty' },
      sub: { es: 'Datos en el disco del usuario, 0ms de latencia, 100% offline.', en: 'Data on user disk, 0ms latency, 100% offline.' },
      risk: { es: 'Requiere protocolos de sync asíncronos y resolución de conflictos.', en: 'Requires async sync protocols and conflict resolution.' },
    },
    rightPole: {
      label: { es: 'Dependencia Cloud Centralizada', en: 'Centralized Cloud Lock-in' },
      sub: { es: 'Datos en base remota, suscripciones cautivas, vendor lock-in.', en: 'Data hosted remotely, captive subscriptions, vendor lock-in.' },
      risk: { es: 'Costos inelásticos, riesgo de uptime ajeno y desconfianza de IP.', en: 'Inelastic recurring infra costs, external downtime, IP exposure.' },
    },
    verdict: {
      es: 'Los datos críticos de ingeniería y finanzas personales pertenecen al cliente. Los agentes de IA deben trabajar sobre el disco del usuario, no en nubes ajenas.',
      en: 'Critical engineering and personal finance data belong to the client. AI agents must operate on the user\'s local disk, not in third-party clouds.',
    },
    verdictKeyPhrase: {
      es: 'sobre el disco del usuario, no en nubes ajenas',
      en: 'on the user\'s local disk, not in third-party clouds',
    },
    feedback: {
      leftHeavy: {
        es: '✓ Soberanía Radical: Datos y computación en el cliente. Ideal para herramientas de ingeniería, finanzas confidenciales y agentes locales.',
        en: '✓ Radical Sovereignty: Full data and compute residency on client device. Ideal for engineering tooling, sensitive finance, and local agents.',
      },
      balanced: {
        es: '✓ Calibración Óptima: Local-first como fuente de verdad con la nube como capa opcional de backup cifrado (zero-knowledge) y colaboración asíncrona.',
        en: '✓ Optimal Stance: Local-first as source of truth with cloud acting purely as an optional zero-knowledge encrypted backup and async sync bridge.',
      },
      rightHeavy: {
        es: '⚠️ Riesgo de Cautiverio: Los clientes corporativos desconfían de enviar código sensible a APIs de terceros. La latencia y el downtime te condicionan.',
        en: '⚠️ Lock-in Warning: Enterprise clients refuse to pipe proprietary code into remote black boxes. Network latency and third-party downtime dictate your SLA.',
      },
    },
    lensInsights: {
      product: {
        title: { es: 'Impacto de Producto & Negocio', en: 'Product & Business Impact' },
        rationale: {
          es: 'Elimina la mayor objeción comercial en B2B: "¿dónde quedan mis datos y secretos comerciales?". Otorga una ventaja competitiva feroz en privacidad y velocidad instantánea sin lag de red.',
          en: 'Eliminates the #1 enterprise sales blocker: "where does our proprietary data live?". Creates an impenetrable moat around customer privacy and instant zero-latency UX.',
        },
        metric: { es: 'Latencia de Operación: 0ms · Retención B2B +40%', en: 'Operating Latency: 0ms · B2B Retention +40%' },
      },
      arch: {
        title: { es: 'Mecanismo Arquitectónico', en: 'Architectural Mechanism' },
        rationale: {
          es: 'SQLite embebido / Git local como store primario, operado vía Model Context Protocol (MCP) y CLI. La nube es una réplica pasiva cifrada en reposo mediante AES-GCM sin conocimiento de claves.',
          en: 'Embedded SQLite / local Git repository as primary store, interfaced via Model Context Protocol (MCP) and CLI. Cloud is an encrypted AES-GCM zero-knowledge replica.',
        },
        metric: { es: 'Protocolo MCP Local · Cifrado Zero-Knowledge', en: 'Local MCP Protocol · Zero-Knowledge Encryption' },
      },
    },
  },
  {
    id: 'agents-vs-gates',
    adrNumber: 'ADR-003',
    category: {
      es: 'Gobernanza de IA Agéntica',
      en: 'Agentic AI Governance',
    },
    title: {
      es: 'Ejecución Autónoma de IA vs. Compuertas Determinísticas',
      en: 'Autonomous AI Execution vs. Deterministic Gates',
    },
    optimalStance: 45,
    leftPole: {
      label: { es: 'Velocidad de IA Generativa', en: 'Generative AI Velocity' },
      sub: { es: 'Agentes generando código, tests y features a velocidad sobrehumana.', en: 'Agents producing code, tests, and features at superhuman velocity.' },
      risk: { es: 'Alucinaciones silenciosas, deuda oculta y regresiones destructivas.', en: 'Silent hallucinations, stealth debt, and breaking regressions.' },
    },
    rightPole: {
      label: { es: 'Compuertas Determinísticas (QA)', en: 'Deterministic QA Gates' },
      sub: { es: 'Verificación estricta mediante TypeScript, AST linters y type checks.', en: 'Strict verification via TypeScript, AST linters, and type checking.' },
      risk: { es: 'Fricción burocrática si las compuertas no están automatizadas.', en: 'Bureaucratic friction if checks are manual rather than automated.' },
    },
    verdict: {
      es: 'La IA acelera la generación; las compuertas de calidad (QA auditor, linters, types) deben ser determinísticas y no negociables.',
      en: 'AI accelerates generation; quality gates (QA auditor, linters, types) must be deterministic and non-negotiable.',
    },
    verdictKeyPhrase: {
      es: 'determinísticas y no negociables',
      en: 'deterministic and non-negotiable',
    },
    feedback: {
      leftHeavy: {
        es: '⚠️ Riesgo de Alucinación: Código generado sin auditoría determinística genera caos operativo y corrompe las invariantes del negocio.',
        en: '⚠️ Hallucination Warning: AI code shipped without deterministic gates introduces stealth bugs and breaks core business invariants.',
      },
      balanced: {
        es: '✓ Calibración Óptima: Agentes autónomos en sandbox para la generación de alta velocidad, filtrados por compuertas estáticas estrictas antes de merge.',
        en: '✓ Optimal Stance: Autonomous sandboxed agents for high-velocity generation, strictly governed by static compilation gates prior to merging.',
      },
      rightHeavy: {
        es: '⚠️ Riesgo de Inercia: Si la gobernanza requiere revisiones manuales extenuantes, se pierde la ventaja multiplicadora del tooling moderno.',
        en: '⚠️ Inertia Warning: If governance depends on tedious manual review rather than automated checks, the multiplier advantage of AI tooling is lost.',
      },
    },
    lensInsights: {
      product: {
        title: { es: 'Impacto de Producto & Negocio', en: 'Product & Business Impact' },
        rationale: {
          es: 'La velocidad es inútil si destruye la confianza del cliente. Automatizar compuertas permite lanzar 10x más rápido manteniendo la tasa de regresiones en cero.',
          en: 'Delivery velocity is worthless if it erodes customer trust. Deterministic verification allows teams to ship 10x faster while holding production defects at zero.',
        },
        metric: { es: 'Lead Time de PRs -70% · Regresiones = 0.0%', en: 'PR Lead Time -70% · Defect Rate = 0.0%' },
      },
      arch: {
        title: { es: 'Mecanismo Arquitectónico', en: 'Architectural Mechanism' },
        rationale: {
          es: 'Pipeline desacoplado: agentes trabajan en ramas y subagentes aislados. La integración exige validación estricta de compilador (tsc --noEmit), tests unitarios y contratos Zod.',
          en: 'Decoupled pipeline: agents execute in isolated branches and subagents. Integration strictly requires compiler validation (tsc --noEmit), unit tests, and Zod schemas.',
        },
        metric: { es: 'Sandbox de Ejecución · Compilador como Puerta de Enlace', en: 'Sandboxed Runtime · Compiler as Quality Gate' },
      },
    },
  },
]

export function PrinciplesSection() {
  const { lang } = useLanguage()
  const { lens, setLens } = useLens()
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(ADR_SCENARIOS[0].id)
  const [sliderPositions, setSliderPositions] = useState<Record<string, number>>({
    'speed-vs-scale': ADR_SCENARIOS[0].optimalStance,
    'local-vs-cloud': ADR_SCENARIOS[1].optimalStance,
    'agents-vs-gates': ADR_SCENARIOS[2].optimalStance,
  })

  const currentScenario =
    ADR_SCENARIOS.find((s) => s.id === selectedScenarioId) ?? ADR_SCENARIOS[0]
  const currentSliderValue = sliderPositions[currentScenario.id] ?? currentScenario.optimalStance

  const handleSliderChange = (newVal: number) => {
    setSliderPositions((prev) => ({
      ...prev,
      [currentScenario.id]: newVal,
    }))
  }

  const handleResetToVerdict = () => {
    setSliderPositions((prev) => ({
      ...prev,
      [currentScenario.id]: currentScenario.optimalStance,
    }))
  }

  // Determine feedback bracket
  const getFeedback = (val: number) => {
    if (val < 30) return currentScenario.feedback.leftHeavy[lang]
    if (val > 65) return currentScenario.feedback.rightHeavy[lang]
    return currentScenario.feedback.balanced[lang]
  }

  const isAtOptimal = Math.abs(currentSliderValue - currentScenario.optimalStance) <= 8

  return (
    <section id="principles" className="py-24 px-5 border-t border-white/[0.04] scroll-mt-14">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest block">03</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">
              <Scale className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'es' ? 'GOBERNANZA & TRADE-OFFS' : 'GOVERNANCE & TRADE-OFFS'}</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t(lang, 'principles.title')}</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl leading-relaxed">{t(lang, 'principles.subtitle')}</p>
        </div>

        {/* ─── INTERACTIVE ADR & TRADE-OFF MATRIX WIDGET ─── */}
        <div className="mb-16 rounded-2xl border border-white/[0.08] bg-white/[0.015] backdrop-blur-sm p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          {/* Subtle ambient background glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

          {/* Widget Top Bar: Meta + Global Lens Sync */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-white/[0.06] relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                  {lang === 'es' ? 'MATRIZ DE DECISIONES ARQUITECTÓNICAS (ADR)' : 'ARCHITECTURAL DECISION RECORDS (ADR)'}
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {lang === 'es' ? 'INTERACTIVO' : 'INTERACTIVE'}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                {lang === 'es'
                  ? 'Un arquitecto senior se define por cómo navega tensiones reales. Explorá los 3 escenarios fundamentales:'
                  : 'Senior architects are distinguished by how they navigate trade-offs. Explore the 3 core decision matrices:'}
              </p>
            </div>

            {/* Lens Switcher Sync */}
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/[0.08] p-1 rounded-xl shrink-0 self-start sm:self-auto">
              <span className="text-[10px] font-mono text-zinc-500 px-2 hidden sm:inline">
                {lang === 'es' ? 'Lente:' : 'Lens:'}
              </span>
              <button
                type="button"
                onClick={() => setLens('product')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  lens === 'product'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shadow-xs'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>{lang === 'es' ? 'Producto' : 'Product'}</span>
              </button>
              <button
                type="button"
                onClick={() => setLens('arch')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                  lens === 'arch'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Cpu className="w-3 h-3" />
                <span>{lang === 'es' ? 'Arquitectura' : 'Architecture'}</span>
              </button>
            </div>
          </div>

          {/* Scenario Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 relative z-10">
            {ADR_SCENARIOS.map((sc) => {
              const isSelected = sc.id === selectedScenarioId
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedScenarioId(sc.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-2 group ${
                    isSelected
                      ? 'bg-white/[0.06] border-white/25 shadow-lg shadow-black/40 ring-1 ring-white/10'
                      : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.12]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-colors ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : 'bg-white/[0.03] text-zinc-500 border-white/[0.06] group-hover:text-zinc-400'
                      }`}
                    >
                      {sc.adrNumber}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {isSelected ? '●' : '○'}
                    </span>
                  </div>
                  <div>
                    <h3
                      className={`text-xs font-semibold leading-snug transition-colors ${
                        isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'
                      }`}
                    >
                      {sc.title[lang]}
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-400 mt-1 line-clamp-1">
                      {sc.category[lang]}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Active ADR Card Details */}
          <div className="bg-black/50 border border-white/[0.07] rounded-xl p-5 sm:p-6 relative z-10 space-y-6">
            {/* Header: ADR Status & Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-white/[0.08] px-2 py-0.5 rounded border border-white/10">
                  {currentScenario.adrNumber}
                </span>
                <span className="text-xs text-zinc-300 font-medium">
                  {currentScenario.title[lang]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{lang === 'es' ? 'STATUS: ACEPTADO' : 'STATUS: ACCEPTED'}</span>
                </span>
                <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                  &bull; {currentScenario.category[lang]}
                </span>
              </div>
            </div>

            {/* Interactive Trade-off Tension Slider */}
            <div className="space-y-3 bg-white/[0.015] p-4 sm:p-5 rounded-xl border border-white/[0.05]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                    {lang === 'es' ? 'Simulador de Tensión & Balance' : 'Trade-off Tension Simulator'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetToVerdict}
                  title={lang === 'es' ? 'Restaurar al veredicto calibrado' : 'Reset to calibrated verdict'}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-2 py-1 rounded border border-indigo-500/20 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{lang === 'es' ? 'Veredicto de Pablo' : 'Pablo\'s Stance'}</span>
                </button>
              </div>

              {/* Pole Descriptions */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div className="text-left">
                  <span className="font-semibold text-zinc-200 block text-[11px] sm:text-xs">
                    ← {currentScenario.leftPole.label[lang]}
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-0.5 hidden sm:block">
                    {currentScenario.leftPole.sub[lang]}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-zinc-200 block text-[11px] sm:text-xs">
                    {currentScenario.rightPole.label[lang]} →
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-0.5 hidden sm:block">
                    {currentScenario.rightPole.sub[lang]}
                  </p>
                </div>
              </div>

              {/* Custom Slider Input */}
              <div className="relative pt-2 pb-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentSliderValue}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus:outline-hidden"
                  aria-label={currentScenario.title[lang]}
                />

                {/* Stance Marker Guide */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-4 bg-emerald-400 pointer-events-none rounded shadow-sm shadow-emerald-400/80"
                  style={{ left: `${currentScenario.optimalStance}%` }}
                  title={lang === 'es' ? 'Punto de equilibrio arquitectónico' : 'Architectural sweet spot'}
                />
              </div>

              {/* Slider Dynamics Feedback */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 font-mono text-[11px]">
                <div className="flex items-center gap-1.5">
                  {isAtOptimal ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      {lang === 'es' ? 'Calibración recomendada' : 'Calibrated stance'} ({currentSliderValue}%)
                    </span>
                  ) : (
                    <span className="text-zinc-400">
                      {lang === 'es' ? 'Posición ajustada' : 'Tension value'}: {currentSliderValue}%
                    </span>
                  )}
                </div>
                <div className="text-zinc-400 text-[11px]">
                  {getFeedback(currentSliderValue)}
                </div>
              </div>
            </div>

            {/* ─── PABLO'S ARCHITECTURAL VERDICT CARD ─── */}
            <div className="p-5 sm:p-6 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/20 via-zinc-900/40 to-black relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  {lang === 'es' ? 'Veredicto de Arquitectura' : 'Architectural Verdict'}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {lang === 'es' ? 'Criterio Vinculante' : 'Binding Invariant'}
                </span>
              </div>

              <blockquote className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed italic border-l-2 border-indigo-500/60 pl-4 my-2">
                &ldquo;{currentScenario.verdict[lang]}&rdquo;
              </blockquote>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/[0.05] text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-300 font-medium">
                  — Pablo Javier Rodríguez
                </span>
                <span className="text-indigo-400/90 hidden sm:inline">
                  {currentScenario.verdictKeyPhrase[lang]}
                </span>
              </div>
            </div>

            {/* ─── DUAL-LENS PERSPECTIVE INSIGHTS ─── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Product Lens Card */}
              <div
                onClick={() => setLens('product')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  lens === 'product'
                    ? 'bg-indigo-500/[0.06] border-indigo-500/40 ring-1 ring-indigo-500/20 shadow-lg shadow-indigo-500/5'
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase font-semibold text-indigo-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    {currentScenario.lensInsights.product.title[lang]}
                  </span>
                  {lens === 'product' && (
                    <span className="text-[9px] font-mono bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                      {lang === 'es' ? 'Lente Activo' : 'Active Lens'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  {currentScenario.lensInsights.product.rationale[lang]}
                </p>
                <div className="pt-2 border-t border-white/[0.05] flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <Zap className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{currentScenario.lensInsights.product.metric[lang]}</span>
                </div>
              </div>

              {/* Architecture Lens Card */}
              <div
                onClick={() => setLens('arch')}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  lens === 'arch'
                    ? 'bg-cyan-500/[0.06] border-cyan-500/40 ring-1 ring-cyan-500/20 shadow-lg shadow-cyan-500/5'
                    : 'bg-white/[0.01] border-white/[0.06] hover:bg-white/[0.03] hover:border-white/[0.12]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase font-semibold text-cyan-300 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    {currentScenario.lensInsights.arch.title[lang]}
                  </span>
                  {lens === 'arch' && (
                    <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                      {lang === 'es' ? 'Lente Activo' : 'Active Lens'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed mb-3">
                  {currentScenario.lensInsights.arch.rationale[lang]}
                </p>
                <div className="pt-2 border-t border-white/[0.05] flex items-center gap-1.5 text-[10px] font-mono text-cyan-400">
                  <ShieldCheck className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>{currentScenario.lensInsights.arch.metric[lang]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 4 CORE FOUNDATIONAL PRINCIPLES ─── */}
        <div className="mb-6 flex items-center gap-2">
          <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest block">
            {lang === 'es' ? 'PRINCIPIOS FUNDAMENTALES' : 'CORE PRINCIPLES'}
          </span>
          <span className="h-px bg-white/[0.06] flex-1" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {principles.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.10] transition-all"
            >
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-mono text-[11px] text-zinc-600">{p.number}</span>
                <h3 className="font-semibold text-sm text-white">{p.title[lang]}</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">{p.body[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
