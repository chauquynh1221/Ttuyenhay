import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { signToken, setAuthCookie } from '@/lib/auth'

// GET /api/auth/google/callback — Google redirect về đây sau khi user đồng ý
export async function GET(req: NextRequest) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
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

    // Parse returnTo từ state
    let returnTo = '/'
    try {
        if (state) {
            const parsed = JSON.parse(Buffer.from(state, 'base64url').toString())
            returnTo = parsed.returnTo || '/'
        }
    } catch { /* ignore */ }

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
            // User đã tồn tại → cập nhật googleId nếu chưa có
            if (!user.googleId) {
                user.googleId = googleUser.id
                user.avatar = user.avatar || googleUser.picture
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

        // Bước 5: Redirect về trang gốc
        return NextResponse.redirect(`${baseUrl}${returnTo}`)

    } catch (err) {
        console.error('Google OAuth callback error:', err)
        return NextResponse.redirect(`${baseUrl}/dang-nhap?error=server_error`)
    }
}
