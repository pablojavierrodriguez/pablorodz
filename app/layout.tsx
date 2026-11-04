import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { cookies, headers } from 'next/headers'
import './globals.css'
import { LanguageProvider } from '@/lib/language-context'
import { LensProvider } from '@/lib/lens-context'
import { getSiteUrl, profile, thesis } from '@/lib/content'
import type { Language } from '@/lib/translations'
import { Analytics } from '@vercel/analytics/next'

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

export const instant = false

async function resolveInitialLang(): Promise<Language> {
  try {
    const headersList = await headers()
    const headerLang = headersList.get('x-lang') as Language | null
    if (headerLang === 'es' || headerLang === 'en') return headerLang

    const cookieStore = await cookies()
    const cookieLang = cookieStore.get('lang')?.value as Language | undefined
    if (cookieLang === 'es' || cookieLang === 'en') return cookieLang

    const accept = headersList.get('accept-language')
    if (accept) {
      const lower = accept.toLowerCase()
      const enPos = lower.indexOf('en')
      const esPos = lower.indexOf('es')
      if (enPos !== -1 && (esPos === -1 || enPos < esPos)) {
        return 'en'
      }
      if (esPos !== -1) {
        return 'es'
      }
    }
  } catch {
    // Fallback during static generation
  }
  return 'es'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialLang = await resolveInitialLang()

  return (
    <html
      lang={initialLang}
      className={`${geistSans.variable} ${geistMono.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0d0f14] text-zinc-100 font-sans selection:bg-indigo-500/30 selection:text-white overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <LanguageProvider initialLang={initialLang}>
          <LensProvider>{children}</LensProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
