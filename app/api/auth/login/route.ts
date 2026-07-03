import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { signToken, setAuthCookie } from '@/lib/auth'
import { isRateLimited } from '@/lib/ratelimit'
import { clientIp } from '@/lib/apiHelpers'

export async function POST(req: NextRequest) {
    try {
        // Chống dò mật khẩu: tối đa 10 lần/5 phút mỗi IP
        if (isRateLimited(`login:${clientIp(req)}`, 10, 5 * 60_000)) {
            return NextResponse.json({ error: 'Bạn thử quá nhiều lần. Vui lòng đợi ít phút.' }, { status: 429 })
        }
        await dbConnect()
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Vui lòng điền email và mật khẩu' }, { status: 400 })
        }

        // Tìm user theo email
        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user || !user.password) {
            return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
        }

        // So sánh password
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
        }

        // Tài khoản bị khóa
        if (user.isBanned) {
            return NextResponse.json({ error: 'Tài khoản đã bị khóa.' }, { status: 403 })
        }

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
        })

    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ, vui lòng thử lại' }, { status: 500 })
    }
}
