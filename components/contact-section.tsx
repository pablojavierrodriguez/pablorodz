'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { t } from '@/lib/translations'
import { profile } from '@/lib/content'
import {
  Copy,
  Check,
  Mail,
  FileText,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react'

export function ContactSection() {
  const { lang } = useLanguage()
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedTemplate, setCopiedTemplate] = useState(false)
  const [showActionBar, setShowActionBar] = useState(false)

  const items = [
    {
      title: lang === 'es' ? 'Advisory técnico o de producto' : 'Technical or product advisory',
      desc: lang === 'es' ? 'Arquitectura de sistemas, estrategia de producto, OKRs' : 'Systems architecture, product strategy, OKRs',
    },
    {
      title: lang === 'es' ? 'Proyectos con impacto real' : 'Real-impact projects',
      desc: lang === 'es' ? 'Transformación digital, automatización, IA agentica' : 'Digital transformation, automation, agentic AI',
    },
    {
      title: lang === 'es' ? 'Co-fundación o construcción conjunta' : 'Co-founding or joint ventures',
      desc: lang === 'es' ? 'Si tenés una idea ambiciosa y necesitás quien la arquitecte' : "If you have an ambitious idea that needs an architect",
    },
  ]

  const introTemplate =
    lang === 'es'
      ? 'Hola Pablo, estuve revisando tu portfolio y proyectos (gripm, c3admin). Me interesó tu enfoque en arquitectura y producto y me gustaría conversar sobre un proyecto/oportunidad...'
      : 'Hi Pablo, I was reviewing your portfolio and projects (gripm, c3admin). I was impressed by your approach to architecture and product, and would love to discuss a project/opportunity...'

  const gmailWebIntentUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email
  )}&su=${encodeURIComponent(
    lang === 'es'
      ? 'Conversación con Pablo Javier Rodríguez'
      : 'Conversation with Pablo Javier Rodríguez'
  )}`

  const schedule15MinUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email
  )}&su=${encodeURIComponent(
    lang === 'es'
      ? 'Agendar 15 min — Consulta de Arquitectura & Producto'
      : 'Schedule 15 min — Architecture & Product Advisory'
  )}&body=${encodeURIComponent(
    lang === 'es'
      ? 'Hola Pablo, estuve revisando tu portfolio. Me gustaría coordinar una charla breve de 15 minutos para explorar una oportunidad o asesoría técnica.'
      : 'Hi Pablo, I reviewed your portfolio. I would like to set up a quick 15-minute sync to explore an advisory or project inquiry.'
  )}`

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopiedEmail(true)
      setShowActionBar(true)
      setTimeout(() => setCopiedEmail(false), 3000)
    } catch {
      // Fallback
      setCopiedEmail(true)
      setShowActionBar(true)
      setTimeout(() => setCopiedEmail(false), 3000)
    }
  }

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(introTemplate)
      setCopiedTemplate(true)
      setTimeout(() => setCopiedTemplate(false), 3000)
    } catch {
      setCopiedTemplate(true)
      setTimeout(() => setCopiedTemplate(false), 3000)
    }
  }

  return (
    <section id="contact" className="py-24 px-5 border-t border-white/[0.04] scroll-mt-14">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest block mb-1">04</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{t(lang, 'contact.title')}</h2>
          <p className="text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">{t(lang, 'contact.subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          {/* Contact channels */}
          <div className="space-y-5">
            {/* ─── UPGRADED ZERO-FRICTION EMAIL CONVERSION BLOCK ─── */}
            <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.015] backdrop-blur-xs relative overflow-hidden transition-all duration-300 hover:border-white/[0.14] shadow-lg">
              {/* Header row: Label + SLA Response Pill */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">
                  {t(lang, 'contact.email_label')}
                </span>

                {/* Subtle SLA response pill */}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 shadow-xs">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  <span>⚡ &lt; 24h Response Time &middot; Direct Architect Channel</span>
                </span>
              </div>

              {/* Email address row with tactile Copy Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 pb-3">
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm sm:text-base text-white hover:text-indigo-300 transition-colors font-medium font-mono cursor-pointer flex items-center gap-1.5 group"
                  title={lang === 'es' ? 'Enviar correo directamente' : 'Send email directly'}
                >
                  <Mail className="w-4 h-4 text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                  <span>{profile.email}</span>
                </a>

                {/* Morphing Copy Button */}
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-300 cursor-pointer shrink-0 ${
                    copiedEmail
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse shadow-sm shadow-emerald-500/20'
                      : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                  }`}
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{lang === 'es' ? '✓ Copiado al portapapeles' : '✓ Copied to clipboard'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{lang === 'es' ? 'Copiar' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Response Time Notice */}
              <p className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5 pb-1">
                <span>{t(lang, 'contact.response_time')}</span>
                <span className="text-zinc-600">&bull;</span>
                <span className="text-zinc-500">{lang === 'es' ? 'Sin intermediarios' : 'Direct contact'}</span>
              </p>

              {/* ─── CONTEXTUAL ZERO-FRICTION ACTION BAR ─── */}
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  showActionBar ? 'max-h-96 opacity-100 pt-3 mt-3 border-t border-white/[0.06]' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    {lang === 'es' ? 'Handoff de Conversión Inmediato' : 'Instant Conversion Handoff'}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500">
                    {lang === 'es' ? 'Cero fricción' : 'Zero friction'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* [ ✉️ Abrir en Gmail ] */}
                  <a
                    href={gmailWebIntentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-mono font-medium text-white bg-white/[0.04] hover:bg-indigo-500/15 hover:text-indigo-300 border border-white/[0.08] hover:border-indigo-500/30 transition-all cursor-pointer text-center group"
                    title={lang === 'es' ? 'Redactar directamente en Gmail Web' : 'Draft directly in Gmail Web'}
                  >
                    <Mail className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
                    <span>{lang === 'es' ? '✉️ Abrir en Gmail' : '✉️ Open in Gmail'}</span>
                  </a>

                  {/* [ 📋 Copiar Intro Template ] */}
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-mono font-medium transition-all cursor-pointer text-center ${
                      copiedTemplate
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                        : 'bg-white/[0.04] text-zinc-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.08]'
                    }`}
                    title={introTemplate}
                  >
                    {copiedTemplate ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'es' ? '✓ Template copiado' : '✓ Template copied'}</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{lang === 'es' ? '📋 Copiar Intro Template' : '📋 Copy Intro Template'}</span>
                      </>
                    )}
                  </button>

                  {/* [ ⚡ Agendar 15 min ] */}
                  <a
                    href={schedule15MinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg text-[11px] font-mono font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer text-center group"
                    title={lang === 'es' ? 'Coordinar llamada de 15 minutos' : 'Schedule a 15-minute sync'}
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>{lang === 'es' ? '⚡ Agendar 15 min' : '⚡ Book 15 min'}</span>
                  </a>
                </div>

                {copiedTemplate && (
                  <p className="text-[10px] text-zinc-400 font-mono mt-2 bg-black/40 p-2 rounded border border-white/[0.04] line-clamp-2">
                    &ldquo;{introTemplate}&rdquo;
                  </p>
                )}
              </div>

              {/* Toggle to expand action bar if not opened yet */}
              {!showActionBar && (
                <div className="pt-2 border-t border-white/[0.04]">
                  <button
                    type="button"
                    onClick={() => setShowActionBar(true)}
                    className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>{lang === 'es' ? '⚡ Ver opciones de contacto rápido (Gmail, Templates, 15m)' : '⚡ Quick contact shortcuts (Gmail, Template, 15m)'}</span>
                    <span>↓</span>
                  </button>
                </div>
              )}
            </div>

            {/* LinkedIn card (preserved intact) */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
              <p className="text-[11px] font-mono text-zinc-500 mb-1">{t(lang, 'contact.linkedin_label')}</p>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium cursor-pointer inline-flex items-center gap-1"
              >
                <span>{t(lang, 'contact.linkedin_cta')}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Location card (preserved intact) */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.01]">
              <p className="text-[11px] font-mono text-zinc-500 mb-1">{t(lang, 'contact.location_label')}</p>
              <p className="text-sm text-white">{profile.location.country} — {profile.location.timezone}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{t(lang, 'contact.location_detail')}</p>
            </div>
          </div>

          {/* What I'm looking for (preserved intact) */}
          <div>
            <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-4">{t(lang, 'contact.looking_for')}</p>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-zinc-600 shrink-0 mt-0.5 font-mono text-xs">→</span>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
              <p className="text-xs text-zinc-400 leading-relaxed italic">{t(lang, 'contact.closing')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
