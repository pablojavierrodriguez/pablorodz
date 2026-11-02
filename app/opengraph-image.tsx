import { ImageResponse } from 'next/og'
import { profile, thesis } from '@/lib/content'

export const alt = `${profile.name} · ${profile.role.en}`
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0d0f14',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.14) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(99, 102, 241, 0.1) 0%, transparent 45%)',
          padding: '56px 64px',
          boxSizing: 'border-box',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#f4f4f5',
          position: 'relative',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
              borderRadius: '9999px',
              padding: '8px 18px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                marginRight: '10px',
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#34d399',
                textTransform: 'uppercase',
              }}
            >
              Sistemas · Producto · Arquitectura
            </span>
          </div>

          {/* Monogram / Handle Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '6px 16px',
              color: '#f4f4f5',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'monospace',
            }}
          >
            <span style={{ color: '#10b981', marginRight: '2px' }}>/</span>
            <span>{profile.handle}</span>
          </div>
        </div>

        {/* Center Main Hero */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginTop: '12px',
            marginBottom: '12px',
          }}
        >
          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '12px',
            }}
          >
            {profile.name}
          </div>

          {/* Subtitle / Role */}
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              fontWeight: 600,
              color: '#34d399',
              letterSpacing: '-0.01em',
              marginBottom: '18px',
            }}
          >
            {profile.role.es}
          </div>

          {/* Core Thesis (synchronized with lib/content.ts) */}
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              lineHeight: 1.55,
              color: '#a1a1aa',
              maxWidth: '980px',
            }}
          >
            {thesis.es}
          </div>
        </div>

        {/* Bottom Stats & Pillars Bar */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '235px',
              backgroundColor: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#f4f4f5', marginBottom: '4px' }}>
              3,500+
            </span>
            <span style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.3 }}>
              Usuarios en Sistemas Críticos OSS
            </span>
          </div>

          {/* Card 2 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '235px',
              backgroundColor: 'rgba(16, 185, 129, 0.05)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>
              130k+ / mes
            </span>
            <span style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.3 }}>
              Incidentes ITSM · -25% MTTR
            </span>
          </div>

          {/* Card 3 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '235px',
              backgroundColor: 'rgba(99, 102, 241, 0.05)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '12px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#818cf8', marginBottom: '4px' }}>
              gripm &amp; MCP
            </span>
            <span style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.3 }}>
              Tooling Open Source &amp; Agentes IA
            </span>
          </div>

          {/* Card 4 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '235px',
              backgroundColor: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#f4f4f5', marginBottom: '4px' }}>
              End-to-End
            </span>
            <span style={{ fontSize: 12, color: '#a1a1aa', lineHeight: 1.3 }}>
              Negocio, Producto &amp; Arquitectura
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
