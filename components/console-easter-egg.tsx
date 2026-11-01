'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    pablorodz?: {
      contact: () => string
      stats: () => void
      help: () => string
      version: string
      runtime: string
    }
  }
}

let globalConsoleInitialized = false

export function ConsoleEasterEgg() {
  const initializedRef = useRef(false)

  useEffect(() => {
    // Prevent duplicate logs in React 19 strict mode or multi-mounts
    if (initializedRef.current || globalConsoleInitialized) {
      return
    }
    initializedRef.current = true
    globalConsoleInitialized = true

    // ASCII Art & Initial System Output
    const asciiBanner = `
  ██████╗  █████╗ ██████╗ ██╗      ██████╗ ██████╗  ██████╗ ██████╗ ███████╗
  ██╔══██╗██╔══██╗██╔══██╗██║     ██╔═══██╗██╔══██╗██╔═══██╗██╔══██╗╚══███╔╝
  ██████╔╝███████║██████╔╝██║     ██║   ██║██████╔╝██║   ██║██║  ██║  ███╔╝ 
  ██╔═══╝ ██╔══██║██╔══██╗██║     ██║   ██║██╔══██╗██║   ██║██║  ██║ ███╔╝  
  ██║     ██║  ██║██████╔╝███████╗╚██████╔╝██║  ██║╚██████╔╝██████╔╝███████╗
  ╚═╝     ╚═╝  ╚═╝╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝
`

    try {
      // 1. ASCII Art Banner
      console.log(
        `%c${asciiBanner}`,
        'color: #10b981; font-family: monospace; font-size: 9px; font-weight: bold; line-height: 1.15;'
      )

      // 2. System Initialized log
      console.log(
        '%c[SYSTEM INITIALIZED] Pablo Javier Rodríguez',
        'color: #34d399; font-weight: bold; font-size: 14px; padding: 4px 0;'
      )

      // 3. Structured Role & Scale Table
      console.table({
        Role: 'Solutions Architect & Product Owner',
        Scale: 'Telecom (130k inc/mo) & Local-First MCP',
        OpenTo: 'High-impact challenges',
      })

      // 4. Interactive Console CLI hint
      console.log(
        '%c⚡ Interactive CLI mounted on window.pablorodz. Try running pablorodz.help()',
        'color: #a1a1aa; font-family: monospace; font-size: 11px; padding: 2px 0;'
      )

      // 5. Mount CLI helper on window.pablorodz
      window.pablorodz = {
        version: '2026.1-turbo',
        runtime: 'Next.js 16 Turbo Edge · React 19',
        contact: () => {
          const email = 'pabjrodriguez@gmail.com'
          console.log(
            `%c✉️ Dispatching mailto:${email}...`,
            'color: #38bdf8; font-weight: bold; font-family: monospace;'
          )
          window.location.href = `mailto:${email}`
          return `Opening default email client for ${email}...`
        },
        stats: () => {
          console.log(
            '%c📊 Operational & System Metrics:',
            'color: #34d399; font-weight: bold; font-family: monospace;'
          )
          console.table({
            'Telecom Incident Volume': '130,000 incidents / month automated',
            'Architecture Paradigm': 'Local-First, Autonomous Agents, Model Context Protocol',
            'Flagship Engine': 'gripm (Sovereign Project Management in Git)',
            'Availability': 'High-impact advisory, solution architecture, founding ventures',
            'Base Timezone': 'ART (UTC-3) · Buenos Aires, Argentina · Remote-first',
          })
        },
        help: () => {
          console.log(
            '%c🛠️ window.pablorodz Command Reference:\n' +
              '  • pablorodz.contact()  → Open email dispatch to pabjrodriguez@gmail.com\n' +
              '  • pablorodz.stats()    → Inspect key architecture, scale and impact metrics\n' +
              '  • pablorodz.help()     → Show this help reference\n' +
              '  • Cmd+K or Ctrl+K      → Open graphical Command Palette in the browser',
            'color: #818cf8; font-family: monospace; font-size: 11px; line-height: 1.6;'
          )
          return 'Command reference displayed.'
        },
      }
    } catch {
      // In restricted environments or if console is overridden, fail silently
    }
  }, [])

  return null
}
