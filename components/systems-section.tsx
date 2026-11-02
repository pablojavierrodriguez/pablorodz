'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { useLens, type Lens } from '@/lib/lens-context'
import { t } from '@/lib/translations'
import { systems, type SystemProject } from '@/lib/content'
import { useLiveStats, type ProjectLiveStats } from '@/lib/use-live-stats'
import { SystemTopologyViewer } from '@/components/system-topology-viewer'

const statusColors: Record<string, string> = {
  production: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  'active-oss': 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  incubating: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  'private-teaser': 'text-amber-400 bg-amber-400/10 border-amber-400/20',
}

const visibilityLabel: Record<string, { es: string; en: string }> = {
  'open-source': { es: 'Open Source', en: 'Open Source' },
  private: { es: 'Privado', en: 'Private' },
  'private-upcoming-oss': { es: 'Privado → Próximo OSS', en: 'Private → Upcoming OSS' },
}


function SystemRow({
  system,
  isSelected,
  onSelect,
  lang,
  liveStats,
}: {
  system: SystemProject
  isSelected: boolean
  onSelect: () => void
  lang: 'es' | 'en'
  liveStats?: ProjectLiveStats
}) {
  return (
    <div
      onClick={onSelect}
      className={`w-full text-left py-3.5 px-4 rounded-xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer ${
        isSelected
          ? 'bg-white/[0.05] border-white/20 shadow-lg shadow-white/[0.02]'
          : 'bg-transparent border-transparent hover:bg-white/[0.02] hover:border-white/[0.06]'
      }`}
    >
      <div className="flex items-start gap-3 flex-1">
        <span className="font-mono text-xs text-zinc-500 mt-0.5 w-8 shrink-0">{system.index}</span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-white group-hover:text-zinc-100 transition-colors">
              {system.name}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                statusColors[system.status]
              }`}
            >
              {visibilityLabel[system.visibility][lang]}
            </span>

            {/* DYNAMIC LIVE BADGE (If fetched) OR FALLBACK LIFECYCLE */}
            {liveStats?.isLive ? (
              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                title={lang === 'es' ? 'Versión sincronizada en vivo' : 'Live synchronized release'}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>v{liveStats.version}</span>
                <span className="text-[9px] text-emerald-400/80 font-semibold">[live]</span>
              </span>
            ) : (
              system.lifecycle[lang] && (
                <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                  &bull; {system.lifecycle[lang]}
                </span>
              )
            )}

            {/* GITHUB STARS BADGE */}
            {liveStats?.stars !== null && liveStats?.stars !== undefined && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20"
                title={lang === 'es' ? `${liveStats.stars} estrellas en GitHub` : `${liveStats.stars} stars on GitHub`}
              >
                <span className="text-amber-400 text-[11px] leading-none">★</span>
                <span>{liveStats.stars} {liveStats.stars === 1 ? 'star' : 'stars'}</span>
              </span>
            )}
          </div>

            {/* Stable tagline: fixed height across views, zero layout shifting */}
            <p className="text-xs text-zinc-400 leading-relaxed pt-0.5 min-h-[2.5rem] line-clamp-2">
              {system.tagline[lang]}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 pl-11 sm:pl-0 font-mono text-[11px] text-zinc-500 shrink-0">
          <span className="text-xs text-zinc-400 group-hover:text-white transition-colors flex items-center justify-end gap-1 min-w-0 sm:min-w-[6.5rem]">
            {isSelected ? (lang === 'es' ? 'Inspeccionando' : 'Inspecting') : (lang === 'es' ? 'Ver Ficha' : 'View Spec')}
            <span className={`inline-block transition-transform duration-200 ${isSelected ? 'translate-x-1 text-white' : 'group-hover:translate-x-1'}`}>
              →
            </span>
          </span>
        </div>
      </div>
    )
  }

interface ProductSpec {
  audience: { es: string; en: string }
  value: { es: string; en: string }
  delivery: { es: string; en: string }
  highlight: { es: string; en: string }
}

const PRODUCT_SPECS: Record<string, ProductSpec> = {
  gripm: {
    audience: {
      es: 'Devs & Agentes de IA',
      en: 'Devs & AI Agents',
    },
    value: {
      es: 'Control Soberano en Git',
      en: 'Sovereign Git Control',
    },
    delivery: {
      es: 'Localhost · CLI & Web',
      en: 'Localhost · CLI & Web',
    },
    highlight: {
      es: 'Soberanía total de datos e integración nativa con agentes mediante MCP.',
      en: 'Complete data sovereignty and native agent integration via MCP.',
    },
  },
  'gripm-playbook': {
    audience: {
      es: 'Tech Leads & Devs',
      en: 'Tech Leads & Devs',
    },
    value: {
      es: 'Entrega Determinística',
      en: 'Deterministic Delivery',
    },
    delivery: {
      es: 'Markdown + Gherkin AC',
      en: 'Markdown + Gherkin AC',
    },
    highlight: {
      es: 'Gobernanza con compuertas de QA estáticas y contratos tipados entre roles.',
      en: 'Governance with static QA gates and typed contracts between roles.',
    },
  },
  c3admin: {
    audience: {
      es: 'Empresas B2B & Ops',
      en: 'B2B Companies & Ops',
    },
    value: {
      es: 'Aislamiento & Auditoría',
      en: 'Isolation & Audit Trail',
    },
    delivery: {
      es: 'Web SaaS Multi-Tenant',
      en: 'Multi-Tenant Web SaaS',
    },
    highlight: {
      es: 'Control administrativo integral sin fricción y cumplimiento estricto.',
      en: 'Frictionless administrative control with strict compliance.',
    },
  },
  dom: {
    audience: {
      es: 'Soberanía & Privacidad',
      en: 'Sovereignty & Privacy',
    },
    value: {
      es: 'Zero-Knowledge Crypto',
      en: 'Zero-Knowledge Crypto',
    },
    delivery: {
      es: 'Offline-first Web App',
      en: 'Offline-first Web App',
    },
    highlight: {
      es: 'Contabilidad de partida doble con encriptación AES-GCM en el dispositivo.',
      en: 'Double-entry bookkeeping with AES-GCM encryption on your device.',
    },
  },
}

function SpecSheet({
  system,
  lens,
  lang,
  liveStats,
}: {
  system: SystemProject
  lens: Lens
  lang: 'es' | 'en'
  liveStats?: ProjectLiveStats
}) {
  const prodSpec = PRODUCT_SPECS[system.id]

  return (
    <div className="p-6 rounded-2xl bg-black/40 border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-300">
      
      {/* SpecSheet Header: Title + Active Perspective Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block">
              {t(lang, 'systems.spec_sheet')} &bull; {system.index}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusColors[system.status]}`}>
              {system.lifecycle[lang]}
            </span>

            {/* SpecSheet Live Badge */}
            {liveStats?.isLive && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span>v{liveStats.version}</span>
                <span className="text-[9px] text-emerald-400/80 font-semibold">[live]</span>
              </span>
            )}

            {/* SpecSheet Stars Badge */}
            {liveStats?.stars !== null && liveStats?.stars !== undefined && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <span className="text-amber-400 text-[11px] leading-none">★</span>
                <span>{liveStats.stars} {liveStats.stars === 1 ? 'star' : 'stars'}</span>
              </span>
            )}
          </div>
          <h3 className="font-bold text-lg text-white font-mono flex items-center gap-2">
            {system.name}
            <span className="text-xs font-normal text-zinc-400 font-sans">({system.domain[lang]})</span>
          </h3>
        </div>

        {/* Global Lens Status Indicator (Driven by Header Master Switch) */}
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
            {lens === 'product' ? t(lang, 'systems.lens_product') : t(lang, 'systems.lens_arch')}
          </span>
        </div>
      </div>

      {/* Spec Narrative: Balanced height for zero layout displacement */}
      <div className="py-3.5 min-h-[4.25rem] flex items-center">
        <p className="text-sm text-zinc-200 leading-relaxed font-normal transition-opacity duration-200">
          {lens === 'product' ? system.productView[lang] : system.archView[lang]}
        </p>
      </div>

      {/* DUAL-LENS DYNAMIC BODY (Symmetrical Heights & Clean Rendering) */}
      <div className="transition-opacity duration-200 ease-in-out">
        {lens === 'product' ? (
          /* PRODUCT LENS CONTENT */
          <div className="rounded-xl border border-white/[0.08] bg-[#07090d]/80 p-3.5 space-y-3">
            {prodSpec && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-3 py-2 bg-black/30 rounded-lg border border-white/[0.04] text-[10px] font-mono min-h-[2.5rem] items-center">
                <div className="text-zinc-400">
                  <span className="text-zinc-600">{lang === 'es' ? 'AUDIENCIA: ' : 'AUDIENCE: '}</span>
                  <span className="text-zinc-200 font-medium">{prodSpec.audience[lang]}</span>
                </div>
                <div className="text-zinc-400">
                  <span className="text-zinc-600">{lang === 'es' ? 'VALOR: ' : 'VALUE: '}</span>
                  <span className="text-emerald-400 font-medium">{prodSpec.value[lang]}</span>
                </div>
                <div className="text-zinc-400">
                  <span className="text-zinc-600">{lang === 'es' ? 'ENTREGA: ' : 'DELIVERY: '}</span>
                  <span className="text-sky-300 font-medium">{prodSpec.delivery[lang]}</span>
                </div>
              </div>
            )}

            {/* Product Key Capability Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.05] text-[11px] text-zinc-300">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-amber-400 font-bold">✦</span>
                <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                  {lang === 'es' ? 'Diferencial clave:' : 'Key Advantage:'}
                </span>
              </div>
              <span className="text-zinc-200 text-xs sm:text-[11px] leading-relaxed flex-1">
                {prodSpec ? prodSpec.highlight[lang] : system.tagline[lang]}
              </span>
            </div>

            {/* Product Context Action Button */}
            {system.links.demo ? (
              <a
                href={system.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15 hover:border-emerald-500/50 text-emerald-300 hover:text-white text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group shadow-sm shadow-emerald-500/10"
              >
                <span>🚀</span>
                <span>
                  {lang === 'es' ? 'Explorar Experiencia en Vivo (Demo)' : 'Launch Live Product Demo'}
                </span>
                <span className="text-xs text-emerald-400 group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            ) : system.links.github ? (
              <a
                href={system.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-zinc-300 hover:text-white text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>📦</span>
                <span>
                  {lang === 'es' ? 'Inspeccionar Repositorio & Documentación' : 'Inspect Repository & Documentation'}
                </span>
                <span className="text-xs text-zinc-400 group-hover:translate-x-0.5 transition-transform">↗</span>
              </a>
            ) : (
              <a
                href="#contact"
                className="w-full py-2.5 px-3 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 text-amber-300 hover:text-white text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span>💬</span>
                <span>
                  {lang === 'es' ? 'Consultar por Implementación y Alcance' : 'Inquire for Implementation & Scope'}
                </span>
                <span className="text-xs text-amber-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </a>
            )}
          </div>
        ) : (
          /* ARCHITECTURE LENS CONTENT */
          <SystemTopologyViewer
            systemId={system.id}
            rawTopology={system.topology}
            lang={lang}
            lens={lens}
          />
        )}
      </div>

      {/* SHARED FULL TECHNOLOGY STACK (Available in both views for perfect balance) */}
      <div className="pt-4 mt-3 border-t border-white/[0.06]">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">
          {lang === 'es' ? 'Stack Tecnológico' : 'Full Technology Stack'}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {system.stack.map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-zinc-300 font-mono text-xs hover:border-white/20 transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Actions row: Demo, GitHub, NPM Package, or Request Spec */}
      <div className="pt-5 mt-4 border-t border-white/[0.08] flex flex-wrap items-center gap-3">
        {system.links.demo && (
          <a
            href={system.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all duration-200 cursor-pointer shadow-md"
          >
            {t(lang, 'systems.launch_demo')}
          </a>
        )}

        {system.links.github && (
          <a
            href={system.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
            <span>GitHub</span>
            {liveStats?.stars !== null && liveStats?.stars !== undefined && (
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.08] text-amber-300 font-semibold flex items-center gap-1">
                ★ {liveStats.stars}
              </span>
            )}
          </a>
        )}

        {system.links.npm && (
          <a
            href={system.links.npm}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-300 text-xs font-mono font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          >
            <span>npm</span>
            <span className="text-zinc-500">&bull;</span>
            <span>{system.name === 'gripm' ? '@gripm/board' : '@gripm/playbook'}</span>
            {liveStats?.version && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-200 border border-red-500/30">
                v{liveStats.version}
              </span>
            )}
          </a>
        )}

        {system.visibility === 'private' && (
          <a
            href="#contact"
            className="px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-400/5 text-amber-300 text-xs font-medium hover:bg-amber-400/10 transition-colors cursor-pointer"
          >
            {t(lang, 'systems.request_teaser')}
          </a>
        )}
      </div>

    </div>
  )
}

export function SystemsSection() {
  const { lang } = useLanguage()
  const [selected, setSelected] = useState<string>(systems[0].id)
  const { lens } = useLens()
  const { getStats, isLive: hasAnyLiveSync } = useLiveStats()

  const selectedSystem = systems.find((s) => s.id === selected)!
  const selectedLiveStats = getStats(selectedSystem.id)

  return (
    <section id="systems" className="pt-14 pb-24 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        {/* Section header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest block">01</span>
            {hasAnyLiveSync && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {lang === 'es' ? 'DATOS EN VIVO' : 'LIVE SYNC ACTIVE'}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t(lang, 'systems.title')}</h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl whitespace-pre-line">{t(lang, 'systems.subtitle')}</p>
        </div>

        {/* System list */}
        <div className="divide-y divide-white/[0.04] border-y border-white/[0.04] mb-8">
          {systems.map((s) => (
            <SystemRow
              key={s.id}
              system={s}
              isSelected={s.id === selected}
              onSelect={() => setSelected(s.id)}
              lang={lang}
              liveStats={getStats(s.id)}
            />
          ))}
        </div>

        {/* Spec Sheet Inspector */}
        <SpecSheet
          system={selectedSystem}
          lens={lens}
          lang={lang}
          liveStats={selectedLiveStats}
        />
      </div>
    </section>
  )
}
