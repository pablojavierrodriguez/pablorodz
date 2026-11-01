'use client'

import { useState } from 'react'
import { useLens, type Lens } from '@/lib/lens-context'
import { useLanguage } from '@/lib/language-context'

interface LensSwitcherProps {
  className?: string
  compact?: boolean
}

export function LensSwitcher({ className = '', compact = false }: LensSwitcherProps) {
  const { lens, setLens, toggleLens } = useLens()
  const { lang } = useLanguage()
  const [hoveredLens, setHoveredLens] = useState<Lens | null>(null)

  const tooltips = {
    product: {
      es: 'Lente de Producto: Visión PM · métricas de negocio, valor y problemas resueltos',
      en: 'Product Lens: PM view · business metrics, user value & problems solved',
    },
    arch: {
      es: 'Lente de Arquitectura: Visión Arquitecto · protocolos, latencias, esquemas y resiliencia',
      en: 'Architecture Lens: Solutions Architect view · protocols, latencies, schemas & resilience',
    },
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault()
      toggleLens()
    } else if (e.key === '1') {
      e.preventDefault()
      setLens('product')
    } else if (e.key === '2') {
      e.preventDefault()
      setLens('arch')
    }
  }

  const currentHover = hoveredLens || lens

  return (
    <div className={`relative flex-col items-center group/switcher ${className.includes('hidden') ? className : `inline-flex ${className}`}`}>
      {/* Switcher Pill */}
      <div
        role="radiogroup"
        aria-label={lang === 'es' ? 'Selector de perspectiva técnica y de producto' : 'Product and Architecture Lens Selector'}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative inline-flex items-center p-0.5 rounded-full bg-[#0d0f14] border border-white/10 shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/40 select-none"
      >
        {/* Product Lens Button */}
        <button
          type="button"
          role="radio"
          aria-checked={lens === 'product'}
          onClick={() => setLens('product')}
          onMouseEnter={() => setHoveredLens('product')}
          onMouseLeave={() => setHoveredLens(null)}
          className={`relative z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer active:scale-95 ${
            lens === 'product'
              ? 'bg-white/10 text-white font-medium shadow-sm border border-emerald-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
          }`}
          title={tooltips.product[lang]}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              lens === 'product'
                ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                : 'bg-zinc-600'
            }`}
          />
          <span>{compact ? 'PM' : 'Product'}</span>
        </button>

        {/* Arch Lens Button */}
        <button
          type="button"
          role="radio"
          aria-checked={lens === 'arch'}
          onClick={() => setLens('arch')}
          onMouseEnter={() => setHoveredLens('arch')}
          onMouseLeave={() => setHoveredLens(null)}
          className={`relative z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-all duration-200 cursor-pointer active:scale-95 ${
            lens === 'arch'
              ? 'bg-white/10 text-white font-medium shadow-sm border border-indigo-500/30'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04] border border-transparent'
          }`}
          title={tooltips.arch[lang]}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              lens === 'arch'
                ? 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]'
                : 'bg-zinc-600'
            }`}
          />
          <span>{compact ? 'Arch' : 'Arch'}</span>
        </button>
      </div>

      {/* Floating Hover Tooltip */}
      <div
        role="tooltip"
        className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/switcher:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap hidden sm:block"
      >
        <div className="px-2.5 py-1 rounded-md bg-[#161922] border border-white/10 text-[11px] font-sans text-zinc-300 shadow-xl shadow-black/50 backdrop-blur-md flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              currentHover === 'product' ? 'bg-emerald-400' : 'bg-indigo-400'
            }`}
          />
          <span>{tooltips[currentHover][lang]}</span>
        </div>
      </div>
    </div>
  )
}
