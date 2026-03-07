import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── URL redirect: /truyen/{slug}/chuong-{id} → /truyen/{slug}/{id}
  const oldChapterPattern = /^\/truyen\/([^/]+)\/chuong-(\d+)$/
  const match = pathname.match(oldChapterPattern)
  if (match) {
    const [, slug, chapterId] = match
    return NextResponse.redirect(new URL(`/truyen/${slug}/${chapterId}`, req.url), 301)
  }

  // ── Auth guards
  const token = req.cookies.get('tf_token')?.value

  // /admin requires admin role
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/dang-nhap?redirect=/admin', req.url))
    }
    try {
      const payload = await verifyToken(token) as any
      if (payload?.role !== 'admin') {
        return NextResponse.redirect(new URL('/?error=forbidden', req.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/dang-nhap?redirect=/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
