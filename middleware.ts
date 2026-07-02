import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

// ────────────────────────────────────────────────────────────
// RATE LIMIT chống cào hàng loạt (in-memory, theo từng instance).
// ⚠️ Đây là lớp CƠ BẢN: trên serverless/Vercel bộ nhớ KHÔNG chia sẻ giữa các
// instance nên hiệu quả hạn chế. Để chặn scrape thực sự → đặt Cloudflare
// (Bot Fight Mode + Rate Limiting Rules) trước site, hoặc dùng Upstash Ratelimit.
// ────────────────────────────────────────────────────────────
const WINDOW_MS = 15_000
const MAX_HITS = 60 // ~4 req/giây vùng đọc — người đọc thật không đạt tới, bot nhanh thì dính
const hits = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const arr = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  arr.push(now)
  hits.set(ip, arr)
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t > WINDOW_MS)) hits.delete(k)
  }
  return arr.length > MAX_HITS
}

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Rate limit vùng đọc truyện ──
  if (pathname.startsWith('/truyen/')) {
    if (isRateLimited(clientIp(req))) {
      return new NextResponse('Bạn thao tác quá nhanh, vui lòng thử lại sau ít phút.', {
        status: 429,
        headers: { 'Retry-After': '30', 'Cache-Control': 'no-store' },
      })
    }
  }

  // ── URL redirect: /truyen/{slug}/chuong-{id} → /truyen/{slug}/{id} ──
  const oldChapterPattern = /^\/truyen\/([^/]+)\/chuong-(\d+)$/
  const match = pathname.match(oldChapterPattern)
  if (match) {
    const [, slug, chapterId] = match
    return NextResponse.redirect(new URL(`/truyen/${slug}/${chapterId}`, req.url), 301)
  }

  // ── Auth guards: /admin cần role admin ──
  const token = req.cookies.get('tf_token')?.value
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/dang-nhap?redirect=/admin', req.url))
    }
    try {
      const payload = (await verifyToken(token)) as any
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
