import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import { LensProvider } from '@/lib/lens-context'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pablorodz.com'),
  title: {
    default: 'Pablo Javier Rodríguez — Solutions Architect & Digital Products Builder',
    template: '%s | Pablo Javier Rodríguez',
  },
  description:
    'Entre la visión del negocio y la realidad del código suele haber un abismo. Mi trabajo es cerrarlo: diseño arquitecturas de software y productos digitales con el pragmatismo que exige la operación y la solidez técnica que demanda el largo plazo.',
  keywords: [
    'Pablo Javier Rodríguez',
    'pablorodz',
    'Solutions Architect',
    'Arquitecto de Soluciones',
    'Digital Products Builder',
    'Telecom OSS',
    'Autonomous Agents',
    'Model Context Protocol',
    'MCP',
    'Local-First Software',
    'ITSM Automation',
    'BMC Helix ITSM',
    'Next.js',
    'TypeScript',
    'gripm',
    'Software Architecture',
    'Systems Design',
    'Argentina Tech',
  ],
  authors: [{ name: 'Pablo Javier Rodríguez', url: 'https://pablorodz.com' }],
  creator: 'Pablo Javier Rodríguez',
  publisher: 'Pablo Javier Rodríguez',
  alternates: {
    canonical: '/',
    languages: {
      'es-AR': '/',
      'en-US': '/?lang=en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    alternateLocale: ['en_US'],
    url: 'https://pablorodz.com',
    siteName: 'Pablo Javier Rodríguez — Portfolio & Living System Index',
    title: 'Pablo Javier Rodríguez — Solutions Architect & Digital Products Builder',
    description:
      'Between business vision and engineering reality, there is often a gap. My work is closing it: I design software architectures and digital products with the pragmatism operations demand and the technical resilience the long term requires.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pablo Javier Rodríguez — Solutions Architect & Digital Products Builder',
    description:
      'Solutions Architect & Digital Products Builder. Closing the gap between business vision, product sense, and engineering reality.',
    creator: '@pablitorodz',
    site: '@pablitorodz',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://pablorodz.com/#website',
      url: 'https://pablorodz.com',
      name: 'Pablo Javier Rodríguez — Portfolio & Architecture Chronicle',
      description:
        'Portfolio profesional y living systems index de Pablo Javier Rodríguez, Solutions Architect y Digital Products Builder.',
      publisher: {
        '@id': 'https://pablorodz.com/#person',
      },
      inLanguage: ['es-AR', 'en-US'],
    },
    {
      '@type': 'Person',
      '@id': 'https://pablorodz.com/#person',
      name: 'Pablo Javier Rodríguez',
      alternateName: ['Pablo Rodríguez', 'pablorodz'],
      jobTitle: 'Solutions Architect & Digital Products Builder',
      description:
        'Solutions Architect specializing in OSS domains, autonomous agents, resilient distributed systems, and local-first software.',
      url: 'https://pablorodz.com',
      image: 'https://avatars.githubusercontent.com/u/36267403?v=4',
      email: 'mailto:pabjrodriguez@gmail.com',
      sameAs: [
        'https://github.com/pablojavierrodriguez',
        'https://linkedin.com/in/pablojavierrodriguez',
        'https://x.com/pablitorodz',
        'https://instagram.com/pablojvrodriguez',
      ],
      worksFor: {
        '@type': 'Organization',
        name: 'Personal (Telecom Argentina)',
        url: 'https://institucional.telecom.com.ar',
      },
      alumniOf: [
        {
          '@type': 'CollegeOrUniversity',
          name: 'Universidad Nacional de Lomas de Zamora (UNLZ)',
        },
        {
          '@type': 'CollegeOrUniversity',
          name: 'Universidad Tecnológica Nacional (UTN)',
        },
      ],
      knowsAbout: [
        'Solution Architecture',
        'Autonomous AI Agents',
        'Model Context Protocol (MCP)',
        'Local-First Software',
        'OSS / BSS Operations',
        'BMC Helix ITSM',
        'Next.js',
        'TypeScript',
        'Multi-Agent Orchestration',
        'Continuous Improvement',
        'Double-Entry Accounting Engines',
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'AR',
      },
    },
    {
      '@type': 'ProfilePage',
      '@id': 'https://pablorodz.com/#profilepage',
      url: 'https://pablorodz.com',
      name: 'Pablo Javier Rodríguez — Profile',
      isPartOf: {
        '@id': 'https://pablorodz.com/#website',
      },
      mainEntity: {
        '@id': 'https://pablorodz.com/#person',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} font-sans h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0d0f14] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
        <LanguageProvider>
          <LensProvider>{children}</LensProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
