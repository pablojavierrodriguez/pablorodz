'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'
import { profile, thesis } from '@/lib/content'

export function Hero() {
  const { lang } = useLanguage()
  const [isInspecting, setIsInspecting] = useState(false)

  const scrollToSection = (e: React.MouseEvent<HTMLElement>, selector: string) => {
    e.preventDefault()
    const target = document.querySelector(selector) as HTMLElement | null
    if (target) {
      const heading = target.querySelector('h2') || target
      const topOffset = heading.getBoundingClientRect().top + window.scrollY - 76
      window.scrollTo({ top: Math.max(0, topOffset), behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-2.5rem)] flex items-center pt-20 pb-14 overflow-hidden">
      {/* Ambient mineral glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 left-[10%] w-[640px] h-[640px] bg-emerald-500/[0.035] rounded-full blur-[110px]" />
        <div
          className={`absolute top-1/4 right-[10%] w-[460px] h-[460px] rounded-full blur-[100px] transition-colors duration-500 ${
            isInspecting ? 'bg-emerald-500/[0.06]' : 'bg-zinc-400/[0.03]'
          }`}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* ─── LEFT COLUMN: EDITORIAL IDENTITY (Aligned strictly to left axis) ─── */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <p className="text-xs sm:text-[13px] font-mono text-zinc-400 mb-3.5 flex flex-wrap items-center gap-2">
              <span>{t(lang, 'hero.role')}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-500">{profile.location.country}</span>
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-[-0.035em] leading-[1.06] text-white mb-6">
              {profile.name}
            </h1>

            <div className="max-w-[590px] mb-9 min-h-[6.5rem] sm:min-h-[5.5rem] flex items-center">
              <p className="text-base sm:text-lg lg:text-[19px] text-zinc-300 leading-[1.62] font-normal">
                {thesis[lang]}
              </p>
            </div>

            {/* CTA Row aligned to left axis */}
            <div className="flex flex-wrap items-center gap-3.5 mb-9 w-full sm:w-auto">
              <a
                href="#systems"
                onClick={(e) => scrollToSection(e, '#systems')}
                className="px-6 py-3 rounded-xl bg-white text-zinc-950 text-sm font-semibold hover:bg-zinc-200 hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer shadow-lg shadow-white/5 min-w-[11rem]"
              >
                {t(lang, 'hero.cta_systems')} →
              </a>
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, '#contact')}
                className="px-6 py-3 rounded-xl border border-white/12 bg-white/[0.03] text-zinc-200 text-sm font-medium hover:bg-white/[0.07] hover:border-white/20 hover:text-white hover:-translate-y-0.5 transition-all duration-200 text-center cursor-pointer min-w-[9rem]"
              >
                {t(lang, 'hero.cta_contact')}
              </a>
            </div>

            {/* Social & Timezone metadata aligned to left axis */}
            <div className="flex items-center gap-3.5 text-xs font-mono text-zinc-500">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-300 transition-colors cursor-pointer"
              >
                GitHub
              </a>
              <span className="text-zinc-700">·</span>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-300 transition-colors cursor-pointer"
              >
                LinkedIn
              </a>
              <span className="text-zinc-700">·</span>
              <span className="text-zinc-500">{profile.location.timezone}</span>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: INTERACTIVE PORTRAIT ⇄ SNAPSHOT DOSSIER ─── */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              role="region"
              aria-label={
                lang === 'es'
                  ? 'Retrato y resumen de perfil interactivo'
                  : 'Interactive portrait and profile snapshot'
              }
              className="relative w-full max-w-[440px] h-[420px] flex items-center justify-center select-none"
            >
              {/* STATE 1: RESTING (Clean Portrait Node with Orbital Rings) */}
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ease-out pointer-events-none ${
                  isInspecting
                    ? 'opacity-0 scale-95'
                    : 'opacity-100 scale-100'
                }`}
              >
                {/* Concentric subtle architectural rings */}
                <div className="absolute w-[330px] h-[330px] sm:w-[350px] sm:h-[350px] rounded-full border border-white/[0.04]" />
                <div className="absolute w-[235px] h-[235px] sm:w-[245px] sm:h-[245px] rounded-full border border-dashed border-white/[0.08]" />
                <div className="absolute w-[156px] h-[156px] rounded-[36px] border border-white/10 bg-white/[0.02] backdrop-blur-md shadow-2xl shadow-black/60" />

                {/* 4 individual orbiting words */}
                <div className="absolute top-12 left-8 sm:left-10 z-10 px-3 py-1 rounded-full bg-[#0e1016]/90 border border-white/[0.09] font-mono text-[10px] text-zinc-400 backdrop-blur-md shadow-lg">
                  {lang === 'es' ? 'Sistemas' : 'Systems'}
                </div>

                <div className="absolute top-8 right-8 sm:right-10 z-10 px-3 py-1 rounded-full bg-[#0e1016]/90 border border-white/[0.09] font-mono text-[10px] text-zinc-400 backdrop-blur-md shadow-lg">
                  {lang === 'es' ? 'Producto' : 'Product'}
                </div>

                <div className="absolute bottom-20 left-6 sm:left-8 z-10 px-3 py-1 rounded-full bg-[#0e1016]/90 border border-white/[0.09] font-mono text-[10px] text-zinc-400 backdrop-blur-md shadow-lg">
                  {lang === 'es' ? 'Arquitectura' : 'Architecture'}
                </div>

                <div className="absolute bottom-24 right-8 sm:right-10 z-10 px-3 py-1 rounded-full bg-[#0e1016]/90 border border-white/[0.09] font-mono text-[10px] text-zinc-400 backdrop-blur-md shadow-lg">
                  OSS
                </div>

                {/* Native-scale sharp Portrait — ONLY hovering/clicking the photo triggers the effect */}
                <div
                  onMouseEnter={() => setIsInspecting(true)}
                  onClick={() => setIsInspecting(true)}
                  className={`relative z-10 w-[114px] h-[114px] rounded-[26px] overflow-hidden border border-white/20 hover:border-emerald-400/50 shadow-2xl shadow-black/60 transition-all duration-200 cursor-pointer ${
                    isInspecting ? 'pointer-events-none' : 'pointer-events-auto'
                  }`}
                >
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    width={114}
                    height={114}
                    className="w-full h-full object-cover grayscale contrast-105"
                    priority
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="relative z-20 -mt-3 ml-24 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#08090c] shadow-[0_0_10px_rgba(16,185,129,0.6)]"
                />

                {/* Bottom interactive cue */}
                <div className="absolute bottom-3 z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/[0.07] border border-emerald-500/25 font-mono text-[10px] text-emerald-400 backdrop-blur-md shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {lang === 'es'
                      ? 'Hover en la imagen para conocerme mejor ↗'
                      : 'Hover image to get to know me better ↗'}
                  </span>
                </div>
              </div>

              {/* STATE 2: HOVER / ACTIVE (Profile & Scope Snapshot Card) */}
              <div
                onMouseLeave={() => setIsInspecting(false)}
                className={`w-full bg-[#0d0f15]/95 border border-emerald-500/30 rounded-[22px] p-5 sm:p-6 backdrop-blur-2xl shadow-[0_28px_70px_rgba(0,0,0,0.75),0_0_40px_rgba(16,185,129,0.06)] transition-all duration-300 ease-out ${
                  isInspecting
                    ? 'opacity-100 scale-100 pointer-events-auto'
                    : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-white/[0.07]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20 shrink-0">
                      <Image
                        src={profile.avatar}
                        alt={profile.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    <div>
                      <div className="font-mono text-[11px] font-semibold text-emerald-400 tracking-wider uppercase">
                        {lang === 'es'
                          ? 'Resumen de Perfil & Alcance'
                          : 'Profile & Scope Snapshot'}
                      </div>
                      <div className="font-mono text-[11px] text-zinc-400">
                        {lang === 'es'
                          ? 'Sistemas · Producto · Arquitectura'
                          : 'Systems · Product · Architecture'}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-zinc-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">
                    {lang === 'es' ? 'Trayectoria' : 'Track Record'}
                  </span>
                </div>

                {/* Current vs. Previous Scope & Own Products Rows */}
                <div className="flex flex-col gap-2 mb-3.5">
                  {/* ROW 1: Current Role (Solutions Architect) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      scrollToSection(e, '#experience')
                    }}
                    className="w-full text-left bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/15 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-zinc-100">
                        {lang === 'es'
                          ? 'Arquitecto de Soluciones · Personal'
                          : 'Solutions Architect · Personal'}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {lang === 'es'
                          ? 'Dominio OSS, Inventario y Assurance · Tickets, Órdenes y Workflows'
                          : 'OSS, Inventory & Assurance Domain · Tickets, Orders & Workflows'}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md shrink-0">
                      {lang === 'es' ? 'Actual' : 'Current'}
                    </span>
                  </button>

                  {/* ROW 2: Previous Roles (PO & Project Lead) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      scrollToSection(e, '#experience')
                    }}
                    className="w-full text-left bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/15 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-zinc-100">
                        {lang === 'es'
                          ? 'Product Owner & Project Lead · Telecom'
                          : 'Product Owner & Project Lead · Telecom'}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {lang === 'es'
                          ? 'Ticketing OSS (ITSM, BMC Helix) y liderazgo de migración crítica'
                          : 'OSS Ticketing (ITSM, BMC Helix) & critical migration leadership'}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-300 bg-white/[0.05] border border-white/10 px-2 py-0.5 rounded-md shrink-0">
                      {lang === 'es' ? 'Previo' : 'Previous'}
                    </span>
                  </button>

                  {/* ROW 3: Own Products & Systems */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      scrollToSection(e, '#systems')
                    }}
                    className="w-full text-left bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/15 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-semibold text-zinc-100">
                        {lang === 'es'
                          ? 'Productos & Sistemas Propios'
                          : 'Own Products & Systems'}
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        gripm (MCP) · gripm-playbook · c3admin · DOM
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md shrink-0">
                      {lang === 'es' ? '4 Activos' : '4 Active'}
                    </span>
                  </button>
                </div>

                {/* Key Milestones Strip (Contextualized to Project Lead & PO achievements) */}
                <div className="grid grid-cols-3 gap-2.5 mb-3">
                  <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-2.5">
                    <div className="font-mono text-sm sm:text-[15px] font-bold text-white mb-0.5">
                      3,500+
                    </div>
                    <div className="text-[10px] text-zinc-400 leading-tight">
                      {lang === 'es'
                        ? 'Usuarios migrados (Project Lead)'
                        : 'Migrated users (Project Lead)'}
                    </div>
                  </div>
                  <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-2.5">
                    <div className="font-mono text-sm sm:text-[15px] font-bold text-white mb-0.5">
                      130k+
                    </div>
                    <div className="text-[10px] text-zinc-400 leading-tight">
                      {lang === 'es'
                        ? 'Incidentes/mes en migración ITSM'
                        : 'Incidents/mo in ITSM migration'}
                    </div>
                  </div>
                  <div className="bg-white/[0.025] border border-white/[0.06] rounded-xl p-2.5">
                    <div className="font-mono text-sm sm:text-[15px] font-bold text-white mb-0.5">
                      -25%
                    </div>
                    <div className="text-[10px] text-zinc-400 leading-tight">
                      {lang === 'es'
                        ? 'MTTR vía automatización (PO)'
                        : 'MTTR via automation (PO)'}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.05] font-mono text-[10px] text-zinc-500">
                  <span>
                    {lang === 'es'
                      ? 'Clic en cada fila para ir a la sección'
                      : 'Click any row to jump to section'}
                  </span>
                  <span className="text-emerald-400">
                    {lang === 'es' ? '● Verificado' : '● Verified'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
