import { ImageResponse } from 'next/og'

export const alt = 'Pablo Javier Rodríguez · Solutions Architect & Digital Products Builder'
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
            'radial-gradient(circle at 85% 15%, rgba(16, 185, 129, 0.14) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.08) 0%, transparent 45%)',
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
                letterSpacing: '0.12em',
                color: '#34d399',
                textTransform: 'uppercase',
              }}
            >
              Living System Index · Solutions Architecture
            </span>
          </div>

          {/* Monogram / Domain Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '6px 14px',
              color: '#a1a1aa',
              fontSize: 14,
              fontFamily: 'monospace',
            }}
          >
            <span style={{ color: '#10b981', marginRight: '6px', fontWeight: 700 }}>❯</span>
            <span>pablorodz.com</span>
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
              fontSize: 54,
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.025em',
              color: '#ffffff',
              marginBottom: '10px',
            }}
          >
            Pablo Javier Rodríguez
          </div>

          {/* Subtitle / Role */}
          <div
            style={{
              display: 'flex',
              fontSize: 25,
              fontWeight: 600,
              color: '#34d399',
              letterSpacing: '-0.01em',
              marginBottom: '16px',
            }}
          >
            Solutions Architect &amp; Digital Products Builder
          </div>

          {/* Core Thesis */}
          <div
            style={{
              display: 'flex',
              fontSize: 17,
              lineHeight: 1.5,
              color: '#94a3b8',
              maxWidth: '960px',
            }}
          >
            Entre la visión del negocio y la realidad del código suele haber un abismo. Mi trabajo es cerrarlo con arquitecturas pragmáticas y productos construidos para durar.
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
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#f4f4f5', marginBottom: '4px' }}>
              3,500+
            </span>
            <span style={{ fontSize: 12, color: '#71717a', lineHeight: 1.3 }}>
              Usuarios Operaciones Críticas (OSS)
            </span>
          </div>

          {/* Card 2 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '235px',
              backgroundColor: 'rgba(16, 185, 129, 0.04)',
              border: '1px solid rgba(16, 185, 129, 0.16)',
              borderRadius: '12px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>
              -25% MTTR
            </span>
            <span style={{ fontSize: 12, color: '#71717a', lineHeight: 1.3 }}>
              +30% Automatización Operativa
            </span>
          </div>

          {/* Card 3 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '235px',
              backgroundColor: 'rgba(59, 130, 246, 0.04)',
              border: '1px solid rgba(59, 130, 246, 0.16)',
              borderRadius: '12px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#60a5fa', marginBottom: '4px' }}>
              MCP &amp; Agentic
            </span>
            <span style={{ fontSize: 12, color: '#71717a', lineHeight: 1.3 }}>
              gripm · Frameworks Autónomos
            </span>
          </div>

          {/* Card 4 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '235px',
              backgroundColor: 'rgba(168, 85, 247, 0.04)',
              border: '1px solid rgba(168, 85, 247, 0.16)',
              borderRadius: '12px',
              padding: '14px 18px',
            }}
          >
            <span style={{ fontSize: 22, fontWeight: 700, color: '#c084fc', marginBottom: '4px' }}>
              Local-First
            </span>
            <span style={{ fontSize: 12, color: '#71717a', lineHeight: 1.3 }}>
              Sistemas Soberanos &amp; Zero-Knowledge
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
