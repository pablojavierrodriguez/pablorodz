'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { useLens } from '@/lib/lens-context'

const emptySubscribe = () => () => {}

export function DynamicBackground() {
  const { lens } = useLens()
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: -1000, y: -1000 })

  useEffect(() => {
    // Only track mouse on desktop (> 1024px) and non-touch devices
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    if (window.innerWidth >= 1024) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true })
    }

    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-700 select-none"
    >
      {/* ─── AMBIENT RADIAL MESH ─── */}
      {/* Product Lens: Organic, warm emerald/teal depth */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          lens === 'product' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[140px]" />
        <div className="absolute top-1/2 -right-40 w-[550px] h-[550px] bg-teal-500/[0.03] rounded-full blur-[160px]" />
        <div className="absolute bottom-20 left-1/3 w-[500px] h-[500px] bg-emerald-600/[0.025] rounded-full blur-[150px]" />
      </div>

      {/* Architecture Lens: Blueprint technical indigo/cyan vector aura */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          lens === 'arch' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute -top-32 right-1/4 w-[650px] h-[650px] bg-indigo-500/[0.05] rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -left-32 w-[550px] h-[550px] bg-cyan-500/[0.035] rounded-full blur-[150px]" />
        <div className="absolute -bottom-20 right-1/3 w-[600px] h-[600px] bg-blue-600/[0.03] rounded-full blur-[160px]" />
      </div>

      {/* ─── SUBTLE ATMOSPHERIC TEXTURE (No harsh wireframe grid) ─── */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          lens === 'product' ? 'opacity-[0.015]' : 'opacity-[0.02]'
        }`}
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* ─── INTERACTIVE DESKTOP FLASHLIGHT / CURSOR AURA ─── */}
      {mousePos.x > 0 && (
        <div
          className="absolute w-[450px] h-[450px] rounded-full blur-[90px] transition-transform duration-100 ease-out hidden lg:block"
          style={{
            transform: `translate3d(${mousePos.x - 225}px, ${mousePos.y - 225}px, 0)`,
            background:
              lens === 'product'
                ? 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Subtle top edge lighting */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}
