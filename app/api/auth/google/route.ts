import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Chỉ nhận path nội bộ (chống open redirect)
function safeReturnTo(v: string | null): string {
    if (!v || !v.startsWith('/') || v.startsWith('//')) return '/'
    return v
}

// GET /api/auth/google — redirect đến Google OAuth consent screen
export async function GET(req: NextRequest) {
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) {
        return NextResponse.json({ error: 'Google OAuth chưa được cấu hình' }, { status: 500 })
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
    const scope = 'openid email profile'

    // state chống CSRF: random nonce + returnTo, ĐỒNG THỜI lưu nonce vào cookie để callback so khớp
    const nonce = crypto.randomBytes(16).toString('hex')
    const returnTo = safeReturnTo(req.nextUrl.searchParams.get('returnTo'))
    const state = Buffer.from(JSON.stringify({ returnTo, nonce })).toString('base64url')

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', clientId)
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', scope)
    googleAuthUrl.searchParams.set('state', state)
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'select_account')

    const res = NextResponse.redirect(googleAuthUrl.toString())
    res.cookies.set('g_oauth_state', nonce, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600, // 10 phút
        path: '/',
    })
    return res
}
