import { NextRequest, NextResponse } from 'next/server'

// GET /api/auth/google — redirect đến Google OAuth consent screen
export async function GET(req: NextRequest) {
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) {
        return NextResponse.json({ error: 'Google OAuth chưa được cấu hình' }, { status: 500 })
    }

    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
    const scope = 'openid email profile'

    // state để bảo vệ CSRF - lưu origin để redirect về sau
    const state = Buffer.from(JSON.stringify({
        returnTo: req.nextUrl.searchParams.get('returnTo') || '/',
        rand: Math.random().toString(36).slice(2)
    })).toString('base64url')

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    googleAuthUrl.searchParams.set('client_id', clientId)
    googleAuthUrl.searchParams.set('redirect_uri', redirectUri)
    googleAuthUrl.searchParams.set('response_type', 'code')
    googleAuthUrl.searchParams.set('scope', scope)
    googleAuthUrl.searchParams.set('state', state)
    googleAuthUrl.searchParams.set('access_type', 'offline')
    googleAuthUrl.searchParams.set('prompt', 'select_account')

    return NextResponse.redirect(googleAuthUrl.toString())
}
