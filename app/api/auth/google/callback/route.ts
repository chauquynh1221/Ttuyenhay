import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { signToken, setAuthCookie } from '@/lib/auth'
import { getRequestOrigin } from '@/lib/apiHelpers'

// GET /api/auth/google/callback — Google redirect về đây sau khi user đồng ý
export async function GET(req: NextRequest) {
    // Lấy domain THẬT từ request → ở lại đúng domain (không đá về localhost do env sai)
    const baseUrl = getRequestOrigin(req)
    const { searchParams } = req.nextUrl
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    const state = searchParams.get('state')

    // User từ chối cấp quyền
    if (error) {
        return NextResponse.redirect(`${baseUrl}/dang-nhap?error=google_denied`)
    }

    if (!code) {
        return NextResponse.redirect(`${baseUrl}/dang-nhap?error=missing_code`)
    }

    // Parse state + KIỂM TRA nonce chống CSRF (so với cookie đã đặt lúc khởi tạo)
    let returnTo = '/'
    let stateNonce = ''
    try {
        if (state) {
            const parsed = JSON.parse(Buffer.from(state, 'base64url').toString())
            const rt = parsed.returnTo
            returnTo = (typeof rt === 'string' && rt.startsWith('/') && !rt.startsWith('//')) ? rt : '/'
            stateNonce = parsed.nonce || ''
        }
    } catch { /* ignore */ }

    const cookieNonce = req.cookies.get('g_oauth_state')?.value
    if (!stateNonce || !cookieNonce || stateNonce !== cookieNonce) {
        return NextResponse.redirect(`${baseUrl}/dang-nhap?error=invalid_state`)
    }

    try {
        const clientId = process.env.GOOGLE_CLIENT_ID!
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET!
        const redirectUri = `${baseUrl}/api/auth/google/callback`

        // Bước 1: Đổi code lấy access_token
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            }),
        })
        const tokenData = await tokenRes.json()
        if (!tokenData.access_token) {
            return NextResponse.redirect(`${baseUrl}/dang-nhap?error=token_exchange_failed`)
        }

        // Bước 2: Lấy thông tin user từ Google
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        })
        const googleUser = await userInfoRes.json()
        if (!googleUser.email) {
            return NextResponse.redirect(`${baseUrl}/dang-nhap?error=no_email`)
        }

        await dbConnect()

        // Bước 3: Tìm hoặc tạo user trong DB
        let user = await User.findOne({
            $or: [
                { googleId: googleUser.id },
                { email: googleUser.email.toLowerCase() }
            ]
        })

        if (user) {
            if (user.isBanned) {
                return NextResponse.redirect(`${baseUrl}/dang-nhap?error=banned`)
            }
            // User đã tồn tại → cập nhật googleId nếu chưa có; email từ Google coi như đã xác thực
            if (!user.googleId) {
                user.googleId = googleUser.id
                user.avatar = user.avatar || googleUser.picture
                user.emailVerified = true
                await user.save()
            }
        } else {
            // Tạo user mới từ Google account
            user = await User.create({
                email: googleUser.email.toLowerCase(),
                name: googleUser.name || googleUser.email.split('@')[0],
                googleId: googleUser.id,
                avatar: googleUser.picture,
                role: 'user',
                emailVerified: true, // email Google đã xác thực
                // Không có password — đăng nhập qua Google
            })
        }

        // Bước 4: Ký JWT và set cookie (giống login thường)
        const token = await signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        })
        await setAuthCookie(token)

        // Bước 5: Redirect về trang gốc + xoá cookie state
        const res = NextResponse.redirect(`${baseUrl}${returnTo}`)
        res.cookies.delete('g_oauth_state')
        return res

    } catch (err) {
        console.error('Google OAuth callback error:', err)
        return NextResponse.redirect(`${baseUrl}/dang-nhap?error=server_error`)
    }
}
