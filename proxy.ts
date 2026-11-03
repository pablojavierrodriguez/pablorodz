import { NextResponse, type NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const urlLang = searchParams.get('lang')
  const cookieLang = request.cookies.get('lang')?.value

  let resolvedLang: 'es' | 'en' = 'es'

  if (urlLang === 'es' || urlLang === 'en') {
    resolvedLang = urlLang
  } else if (cookieLang === 'es' || cookieLang === 'en') {
    resolvedLang = cookieLang
  } else {
    const accept = request.headers.get('accept-language')
    if (accept) {
      const lower = accept.toLowerCase()
      const enPos = lower.indexOf('en')
      const esPos = lower.indexOf('es')
      if (enPos !== -1 && (esPos === -1 || enPos < esPos)) {
        resolvedLang = 'en'
      }
    }
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-lang', resolvedLang)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  // Keep cookie in sync so future reloads immediately have the preference
  if (cookieLang !== resolvedLang) {
    response.cookies.set('lang', resolvedLang, {
      path: '/',
      maxAge: 31536000,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|apple-icon|icon|opengraph-image|twitter-image|robots.txt|sitemap.xml).*)',
  ],
}
