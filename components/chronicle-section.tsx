'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useLens } from '@/lib/lens-context'
import { t } from '@/lib/translations'
import { roles, enterpriseCases, education } from '@/lib/content'
import { profile } from '@/lib/content'
import {
  Zap,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Users,
  Activity,
} from 'lucide-react'

export function ChronicleSection() {
  const { lang } = useLanguage()
  const { lens } = useLens()
  const [deltaMode, setDeltaMode] = useState<'automated' | 'legacy'>('automated')

  return (
    <section id="experience" className="pt-14 pb-24 border-t border-white/[0.04] scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest block mb-1">02</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{t(lang, 'chronicle.title')}</h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-lg">{t(lang, 'chronicle.subtitle')}</p>
          </div>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-indigo-400 hover:text-indigo-300 transition-colors self-start sm:self-end shrink-0 cursor-pointer flex items-center gap-1 group"
          >
            <span>{t(lang, 'chronicle.linkedin_cta')}</span>
          </a>
        </div>

        {/* --- ROLE TIMELINE --- */}
        <div className="mb-16 space-y-8">
          {roles.map((role) => (
            <div key={`${role.company}-${role.period.es}`} className="flex gap-4">
              {/* Timeline line */}
              <div className="flex flex-col items-center pt-1.5">
                <div
                  className={`w-2 h-2 rounded-full border-2 shrink-0 ${
                    role.isCurrent
                      ? 'bg-emerald-400 border-emerald-400'
                      : 'bg-transparent border-zinc-600'
                  }`}
                />
                <div className="w-px flex-1 bg-white/[0.05] mt-1" />
              </div>

              <div className="pb-8 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 mb-3">
                  <div>
                    <h3 className="font-semibold text-sm text-white">{role.title[lang]}</h3>
                    <p className="text-xs text-zinc-400 font-mono">{role.company}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {role.isCurrent && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                        {t(lang, 'chronicle.current')}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-zinc-500">{role.period[lang]}</span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {role.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-zinc-400 flex gap-2">
                      <span className="text-zinc-600 mt-0.5 shrink-0">→</span>
                      <span>{h[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* --- ENTERPRISE IMPACT CASES --- */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4 mb-6">
            <div>
              <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest">
                {lang === 'es' ? 'Casos de Impacto Empresarial' : 'Enterprise Impact Cases'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                {lang === 'es'
                  ? 'Arquitectura de misión crítica a escala telco y automatización operacional.'
                  : 'Mission-critical telco-scale architecture and operational automation.'}
              </p>
            </div>

            {/* Active Perspective Badge (Synchronized with Header Master Switch) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] self-start sm:self-auto text-xs font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  lens === 'product'
                    ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                    : 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]'
                }`}
              />
              <span className="text-zinc-400">
                {lang === 'es' ? 'Perspectiva:' : 'Perspective:'}
              </span>
              <span className="font-semibold text-white">
                {lens === 'product'
                  ? (lang === 'es' ? 'Producto' : 'Product')
                  : (lang === 'es' ? 'Arquitectura' : 'Architecture')}
              </span>
            </div>
          </div>

          {/* ─── OPERATIONAL DELTA / BEFORE & AFTER SCRUBBER ───────────────── */}
          <div className="mb-10 rounded-2xl border border-white/10 bg-[#0b0e14]/90 backdrop-blur-md p-5 sm:p-6 shadow-xl relative overflow-hidden">
            
            {/* Header: Title & Scrubber Controller */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-2 py-0.5 rounded">
                    {lang === 'es' ? 'DELTA OPERACIONAL INTERACTIVO' : 'INTERACTIVE OPERATIONAL DELTA'}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500">· Personal Telecom</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>{lang === 'es' ? 'Modernización NetOps & Digital NOC' : 'NetOps Modernization & Digital NOC'}</span>
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {lang === 'es'
                    ? 'Comparación directa entre la operación manual previa y la arquitectura automatizada desplegada.'
                    : 'Direct comparison between previous manual operations and the automated architecture in production.'}
                </p>
              </div>

              {/* Scrubber Mode Toggle */}
              <div className="flex items-center p-1 rounded-xl bg-black/60 border border-white/10 shrink-0">
                <button
                  onClick={() => setDeltaMode('automated')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                    deltaMode === 'automated'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-md shadow-emerald-950/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">
                    {lang === 'es' ? 'Digital NOC Automatizado' : 'Automated Digital NOC'}
                  </span>
                  <span className="sm:hidden">
                    {lang === 'es' ? 'Automatizado' : 'Automated'}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold hidden md:inline">
                    {lang === 'es' ? '(Arquitectura Pablo)' : "(Pablo's Architecture)"}
                  </span>
                </button>
                <button
                  onClick={() => setDeltaMode('legacy')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                    deltaMode === 'legacy'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-950/40'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline">
                    {lang === 'es' ? 'Operación Manual Legada' : 'Legacy Manual Ops'}
                  </span>
                  <span className="sm:hidden">
                    {lang === 'es' ? 'Legado' : 'Legacy'}
                  </span>
                </button>
              </div>
            </div>

            {/* Dynamic Metric Pills */}
            <div className="py-4 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mr-1">
                {lang === 'es' ? 'Indicadores Clave:' : 'Key Metrics:'}
              </span>
              {deltaMode === 'automated' ? (
                <>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>-25% MTTR</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                    <Activity className="w-3 h-3 text-cyan-400" />
                    <span>+30% Automation</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/25">
                    <Layers className="w-3 h-3 text-indigo-400" />
                    <span>130k Incidents/Mo</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white/[0.04] text-zinc-300 border border-white/[0.08]">
                    <Users className="w-3 h-3 text-zinc-400" />
                    <span>3,500+ Operations Users</span>
                  </span>
                </>
              ) : (
                <>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>&gt; 4.5h MTTR Baseline</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>0% Autonomous Triage</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                    <span>Manual Email Dispatch</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-white/[0.04] text-zinc-400 border border-white/[0.08]">
                    <span>Fragmented Silos</span>
                  </span>
                </>
              )}
            </div>

            {/* Stark Operational Diff Comparison Grid */}
            <div className={`p-4 rounded-xl border transition-all duration-300 ${
              deltaMode === 'automated'
                ? 'bg-emerald-950/10 border-emerald-500/20'
                : 'bg-amber-950/10 border-amber-500/20'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono uppercase tracking-wider font-semibold flex items-center gap-1.5">
                  {deltaMode === 'automated' ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">
                        {lang === 'es'
                          ? 'Arquitectura Automatizada (Diseño de Pablo · Producción)'
                          : "Automated Architecture (Pablo's Architecture · Production)"}
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300">
                        {lang === 'es'
                          ? 'Estado Operacional Legado (Previo a la Migración)'
                          : 'Legacy Operational State (Prior to Migration)'}
                      </span>
                    </>
                  )}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {deltaMode === 'automated' ? 'ITSM NetOps Engine' : 'Manual Dispatch Model'}
                </span>
              </div>

              {/* Vector Matrix */}
              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                {/* Vector 1: Triage */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    {lang === 'es' ? 'Triage & Despacho de Red' : 'Triage & Network Dispatch'}
                  </p>
                  <p className="text-zinc-200 leading-relaxed">
                    {deltaMode === 'automated' ? (
                      lang === 'es'
                        ? 'BMC Helix ITSM + automatización NetOps: más de 130,000 incidentes/mes clasificados y enrutados autónomamente sin cuellos de botella manuales.'
                        : 'BMC Helix ITSM + NetOps automation: 130,000+ incidents/mo handled and dispatched autonomously without manual routing bottlenecks.'
                    ) : (
                      lang === 'es'
                        ? 'Despacho manual por correo electrónico, triaje humano secuencial y retrasos por traspaso entre turnos desconectados.'
                        : 'Manual email dispatch, human triage bottleneck, spreadsheet handoffs, and prolonged handovers between disconnected shifts.'
                    )}
                  </p>
                </div>

                {/* Vector 2: MTTR Velocity */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    {lang === 'es' ? 'Velocidad de Resolución (MTTR)' : 'Resolution Velocity (MTTR)'}
                  </p>
                  <p className="text-zinc-200 leading-relaxed">
                    {deltaMode === 'automated' ? (
                      lang === 'es'
                        ? 'MTTR reducido un 25% de forma sostenida mediante correlación automatizada de alarmas y diagnóstico determinístico.'
                        : 'MTTR reduced by 25% across all critical incidents through automated alarm correlation and deterministic diagnostics.'
                    ) : (
                      lang === 'es'
                        ? 'MTTR baseline superior a 4.5 horas debido a escalamiento telefónico manual, alertas duplicadas y riesgo continuo de penalizaciones SLA.'
                        : 'MTTR baseline > 4.5 hours driven by manual phone escalations, duplicate ticket storms, and constant SLA breach risks.'
                    )}
                  </p>
                </div>

                {/* Vector 3: Auditing & Governance */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    {lang === 'es' ? 'Trazabilidad & Auditoría' : 'Audit Trails & Governance'}
                  </p>
                  <p className="text-zinc-200 leading-relaxed">
                    {deltaMode === 'automated' ? (
                      lang === 'es'
                        ? 'Flujos de eventos ITSM unificados e inmutables, correlación automática de causas raíz y 100% de trazabilidad de cambios.'
                        : 'Unified immutable ITSM event streams, automatic root-cause correlation, and 100% auditability across network change gates.'
                    ) : (
                      lang === 'es'
                        ? 'Pistas de auditoría fragmentadas entre múltiples planillas locales, casillas de correo personales y registros desincronizados.'
                        : 'Fragmented audit trails scattered across local spreadsheets, personal mailboxes, and uncoordinated shift logs.'
                    )}
                  </p>
                </div>

                {/* Vector 4: Capacity & Scaling */}
                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.04]">
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1">
                    {lang === 'es' ? 'Esfuerzo Operacional & Escalabilidad' : 'Operational Effort & Scalability'}
                  </p>
                  <p className="text-zinc-200 leading-relaxed">
                    {deltaMode === 'automated' ? (
                      lang === 'es'
                        ? '30% de reducción en esfuerzo operativo manual, permitiendo reasignar 20% de FTEs a aseguramiento proactivo y prevención de fallas.'
                        : '30% reduction in manual effort, unlocking 20% FTE reallocation to proactive network assurance and preventative engineering.'
                    ) : (
                      lang === 'es'
                        ? 'Crecimiento lineal forzado de dotación para absorber el aumento de eventos de red repetitivos sin valor estratégico.'
                        : 'Linear staffing growth needed just to handle repetitive alert floods without strategic or preventative value.'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* ─── LENS CONTEXT HIGHLIGHT (PRODUCT vs ARCH) ───────────────── */}
            <div className="mt-4 pt-4 border-t border-white/[0.08]">
              {lens === 'product' ? (
                <div className="p-3.5 rounded-xl bg-indigo-500/[0.07] border border-indigo-500/20 text-xs">
                  <div className="flex items-center gap-2 mb-1.5 text-indigo-300 font-mono font-semibold">
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-400/10 border border-indigo-400/20">
                      {lang === 'es' ? 'LENTE PRODUCTO' : 'PRODUCT LENS'}
                    </span>
                    <span>
                      {lang === 'es'
                        ? 'Retorno de Inversión, Adopción Organizacional & Resiliencia de Negocio'
                        : 'ROI, Organizational Adoption Rate & Business Resilience'}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2.5 mt-2 font-mono text-[11px] text-zinc-300">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-indigo-400 font-semibold block mb-0.5">
                        {lang === 'es' ? 'ROI & Eficiencia' : 'ROI & Efficiency'}
                      </span>
                      <p className="text-zinc-400 font-sans">
                        {lang === 'es'
                          ? '30% menos horas invertidas en tareas repetitivas; erradicación de multas por caída de SLA en enlaces corporativos.'
                          : '30% reduction in manual effort; eliminated costly SLA penalty clauses on core enterprise connections.'}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-indigo-400 font-semibold block mb-0.5">
                        {lang === 'es' ? 'Adopción (3,500+ Users)' : 'Adoption (3,500+ Users)'}
                      </span>
                      <p className="text-zinc-400 font-sans">
                        {lang === 'es'
                          ? 'Transición fluida sin resistencia cultural gracias a UX centrado en el operador y gestión del cambio estructurada.'
                          : 'Seamless transition with zero cultural friction due to operator-first UX and structured change management.'}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-indigo-400 font-semibold block mb-0.5">
                        {lang === 'es' ? 'Resiliencia Continua' : 'Business Resilience'}
                      </span>
                      <p className="text-zinc-400 font-sans">
                        {lang === 'es'
                          ? 'Disponibilidad de 99.98% en operaciones críticas en vivo durante la migración nacional sin cortes de servicio.'
                          : '99.98% continuous availability across live critical services during the nationwide migration with zero outages.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-cyan-500/[0.07] border border-cyan-500/20 text-xs">
                  <div className="flex items-center gap-2 mb-1.5 text-cyan-300 font-mono font-semibold">
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
                      {lang === 'es' ? 'LENTE ARQUITECTURA' : 'ARCHITECTURE LENS'}
                    </span>
                    <span>
                      {lang === 'es'
                        ? 'Endpoints ITSM, Compuertas de Cambio & Mapeo de Protocolos OSS'
                        : 'ITSM Integration Endpoints, Change Gates & OSS Protocol Mapping'}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-2.5 mt-2 font-mono text-[11px] text-zinc-300">
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-cyan-400 font-semibold block mb-0.5">
                        {lang === 'es' ? 'Integración ITSM REST/Webhooks' : 'ITSM REST/Webhook Endpoints'}
                      </span>
                      <p className="text-zinc-400 font-sans">
                        {lang === 'es'
                          ? 'Pipelines de ingestión reactivos conectando capas OSS con BMC Helix ITSM con latencia sub-segundo.'
                          : 'Reactive event ingestion pipelines connecting OSS layers to BMC Helix ITSM APIs with sub-second message latency.'}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-cyan-400 font-semibold block mb-0.5">
                        {lang === 'es' ? 'Compuertas de Cambio (CAB)' : 'Change Management Gates'}
                      </span>
                      <p className="text-zinc-400 font-sans">
                        {lang === 'es'
                          ? 'Motor de evaluación de riesgo algorítmico y compuertas de verificación previa para ejecuciones en red.'
                          : 'Algorithmic risk evaluation engine and automated pre-verification gates before network change execution.'}
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-black/40 border border-white/[0.04]">
                      <span className="text-cyan-400 font-semibold block mb-0.5">
                        {lang === 'es' ? 'Mapeo de Protocolos OSS' : 'OSS Protocol Mapping'}
                      </span>
                      <p className="text-zinc-400 font-sans">
                        {lang === 'es'
                          ? 'Normalización de alarmas SNMP, Syslog y Netconf hacia catálogos de servicios ITIL unificados.'
                          : 'Normalization layer converting raw SNMP, Syslog, and Netconf alarms into unified ITIL service records.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* ─── ENTERPRISE CASES LIST ────────────────────────────────────── */}
          <div className="space-y-6">
            {enterpriseCases.map((c) => {
              const isFlagship = c.id === 'netops-migration' || c.id === 'digital-noc'

              return (
                <div
                  key={c.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-all duration-200 ${
                    isFlagship
                      ? 'border-white/10 bg-white/[0.015] hover:bg-white/[0.03] shadow-md'
                      : 'border-white/[0.06] bg-white/[0.01] hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-white">{c.title[lang]}</h4>
                        {isFlagship && (
                          <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Flagship NOC
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">
                        {c.role[lang]} · {c.company} · {c.period}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 sm:justify-end">
                      {c.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{c.description[lang]}</p>

                  {/* Outcomes with dynamic lens enhancement */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                        {t(lang, 'chronicle.outcomes_label')}
                      </span>
                      {isFlagship && (
                        <span className="text-[9px] font-mono text-zinc-500">
                          {lens === 'product'
                            ? (lang === 'es' ? 'Perspectiva: Impacto en Producto' : 'Perspective: Product Impact')
                            : (lang === 'es' ? 'Perspectiva: Gobernanza de Arquitectura' : 'Perspective: Architecture Governance')}
                        </span>
                      )}
                    </div>
                    {c.outcomes.map((o, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>
                        <span>{o[lang]}</span>
                      </div>
                    ))}
                  </div>

                  {/* Contextual Case Callout for Flagship Telecom Cases */}
                  {isFlagship && (
                    <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono">
                      <span className="text-zinc-500">
                        {lens === 'product'
                          ? (lang === 'es' ? 'Impacto: NPS Operacional & Eficiencia' : 'Impact: Operations NPS & Efficiency')
                          : (lang === 'es' ? 'Protocolo: BMC Helix REST / ITIL v4' : 'Protocol: BMC Helix REST / ITIL v4')}
                      </span>
                      <button
                        onClick={() => {
                          setDeltaMode(c.id === 'netops-migration' ? 'automated' : 'automated')
                          window.scrollTo({ top: document.getElementById('experience')?.offsetTop ?? 0, behavior: 'smooth' })
                        }}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{lang === 'es' ? 'Inspeccionar Delta Operacional' : 'Inspect Operational Delta'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* --- EDUCATION & CREDENTIALS --- */}
        <div>
          <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-widest mb-6 border-b border-white/[0.04] pb-3">
            {t(lang, 'education.title')}
          </h3>
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-3">
                {t(lang, 'education.degrees')}
              </p>
              <div className="space-y-4">
                {education.degrees.map((d) => (
                  <div key={d.institution} className="border-l-2 border-white/[0.08] pl-3">
                    <p className="text-xs font-medium text-white">{d.degree[lang]}</p>
                    <p className="text-[11px] text-zinc-500 font-mono">{d.institution}</p>
                    <p className="text-[11px] text-zinc-600 font-mono">{d.period} · {d.status[lang]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-3">
                {t(lang, 'education.certs')}
              </p>
              <ul className="space-y-2">
                {education.certifications.map((cert) => (
                  <li key={cert} className="flex gap-2 text-xs text-zinc-400">
                    <span className="text-zinc-600 shrink-0">·</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <p className="text-[11px] font-mono text-zinc-500 mb-1">{t(lang, 'education.continuous')}</p>
            <p className="text-xs text-zinc-400">{t(lang, 'education.continuous_text')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
