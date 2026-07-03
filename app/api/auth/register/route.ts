import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { signToken, setAuthCookie } from '@/lib/auth'
import { isRateLimited } from '@/lib/ratelimit'
import { clientIp } from '@/lib/apiHelpers'
import { sendMail, verifyEmailHtml } from '@/lib/mail'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
    try {
        // Chống spam đăng ký: tối đa 5 lần/10 phút mỗi IP
        if (isRateLimited(`register:${clientIp(req)}`, 5, 10 * 60_000)) {
            return NextResponse.json({ error: 'Bạn thao tác quá nhanh. Vui lòng đợi ít phút.' }, { status: 429 })
        }
        await dbConnect()
        const body = await req.json()
        const { name, email, password } = body

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 })
        }
        if (password.length < 6) {
            return NextResponse.json({ error: 'Mật khẩu tối thiểu 6 ký tự' }, { status: 400 })
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
        }

        // Kiểm tra email đã tồn tại chưa
        const existing = await User.findOne({ email: email.toLowerCase() })
        if (existing) {
            return NextResponse.json({ error: 'Email này đã được đăng ký' }, { status: 409 })
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12)

        // Token xác thực email (hết hạn 24h)
        const verifyToken = crypto.randomBytes(32).toString('hex')

        // Tạo user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: passwordHash,
            role: 'user',
            emailVerifyToken: verifyToken,
            emailVerifyExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })

        // Gửi email xác thực (không chặn luồng nếu chưa cấu hình Resend)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'
        sendMail(user.email, 'Xác thực email Bongmeow', verifyEmailHtml(`${baseUrl}/api/auth/verify-email?token=${verifyToken}`))
            .catch(() => { })

        // Tạo JWT và set cookie
        const token = await signToken({
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
        })

        await setAuthCookie(token)

        return NextResponse.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        }, { status: 201 })

    } catch (error: any) {
        console.error('Register error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ, vui lòng thử lại' }, { status: 500 })
    }
}
