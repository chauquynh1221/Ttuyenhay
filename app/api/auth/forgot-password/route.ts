import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { isRateLimited } from '@/lib/ratelimit'
import { clientIp } from '@/lib/apiHelpers'
import { sendMail, passwordResetHtml } from '@/lib/mail'

// POST /api/auth/forgot-password — gửi email đặt lại mật khẩu
export async function POST(req: NextRequest) {
    try {
        if (isRateLimited(`forgot:${clientIp(req)}`, 5, 10 * 60_000)) {
            return NextResponse.json({ error: 'Bạn thao tác quá nhanh, thử lại sau.' }, { status: 429 })
        }
        await dbConnect()
        const { email } = await req.json()
        if (!email) return NextResponse.json({ error: 'Vui lòng nhập email' }, { status: 400 })

        const user = await User.findOne({ email: String(email).toLowerCase().trim() })
        // Luôn trả về success để KHÔNG lộ email nào tồn tại
        if (user && user.password) {
            const token = crypto.randomBytes(32).toString('hex')
            user.resetToken = token
            user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000) // 60 phút
            await user.save()

            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
            await sendMail(user.email, 'Đặt lại mật khẩu Bongmeow', passwordResetHtml(`${baseUrl}/dat-lai-mat-khau?token=${token}`))
        }

        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
