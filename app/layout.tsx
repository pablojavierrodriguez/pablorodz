import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import { LensProvider } from '@/lib/lens-context'
import { getSiteUrl, profile, thesis } from '@/lib/content'

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

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} · ${profile.role.en}`,
    template: `%s | ${profile.name}`,
  },
  description: thesis.es,
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
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
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
    url: siteUrl,
    siteName: `${profile.name} · Solutions Architect & Digital Products Builder`,
    title: `${profile.name} · ${profile.role.en}`,
    description: thesis.en,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} · ${profile.role.en}`,
    description: thesis.en,
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
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: `${profile.name} · Solutions Architect & Digital Products Builder`,
      description: thesis.es,
      publisher: {
        '@id': `${siteUrl}/#person`,
      },
      inLanguage: ['es-AR', 'en-US'],
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: profile.name,
      alternateName: ['Pablo Rodríguez', profile.handle],
      jobTitle: profile.role.en,
      description: thesis.en,
      url: siteUrl,
      image: profile.avatar,
      email: `mailto:${profile.email}`,
      sameAs: [
        profile.links.github,
        profile.links.linkedin,
        profile.links.x,
        profile.links.instagram,
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
      '@id': `${siteUrl}/#profilepage`,
      url: siteUrl,
      name: `${profile.name} · Profile`,
      isPartOf: {
        '@id': `${siteUrl}/#website`,
      },
      mainEntity: {
        '@id': `${siteUrl}/#person`,
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
      <body className="min-h-full flex flex-col bg-[#0d0f14] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider>
          <LensProvider>{children}</LensProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
