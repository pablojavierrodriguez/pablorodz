import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b0d12',
          backgroundImage: 'linear-gradient(135deg, #131720 0%, #090b10 100%)',
          borderRadius: '40px',
          border: '3px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <svg
          width="136"
          height="136"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 14 46 L 23 18"
            stroke="#10b981"
            strokeWidth="6.5"
            strokeLinecap="round"
          />
          <path
            d="M 31 46 V 18 H 42 C 47.8 18 51.5 21.3 51.5 26.2 C 51.5 31.1 47.8 34.4 42 34.4 H 31"
            stroke="#f8fafc"
            strokeWidth="6.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
