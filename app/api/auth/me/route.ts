import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { getCurrentUser, signToken, setAuthCookie } from '@/lib/auth'
import { sanitizeText } from '@/lib/apiHelpers'

export async function GET() {
    const user = await getCurrentUser()
    if (!user) {
        return NextResponse.json({ user: null }, { status: 401 })
    }
    // Bổ sung avatar + trạng thái xác thực từ DB (JWT không chứa)
    await dbConnect()
    const doc = await User.findById(user.userId).select('avatar emailVerified').lean() as any
    return NextResponse.json({ user: { ...user, avatar: doc?.avatar || '', emailVerified: !!doc?.emailVerified } })
}

// PATCH /api/auth/me — cập nhật hồ sơ (tên / avatar / đổi mật khẩu)
export async function PATCH(req: NextRequest) {
    const current = await getCurrentUser()
    if (!current) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    await dbConnect()
    const body = await req.json()
    const user = await User.findById(current.userId)
    if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })

    const name = sanitizeText(body.name)
    if (name) user.name = name.slice(0, 50)
    if (typeof body.avatar === 'string') user.avatar = body.avatar

    // Đổi mật khẩu (yêu cầu mật khẩu hiện tại nếu tài khoản có mật khẩu)
    if (body.newPassword) {
        if (String(body.newPassword).length < 6) {
            return NextResponse.json({ error: 'Mật khẩu mới tối thiểu 6 ký tự' }, { status: 400 })
        }
        if (user.password) {
            const ok = await bcrypt.compare(body.currentPassword || '', user.password)
            if (!ok) return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 400 })
        }
        user.password = await bcrypt.hash(body.newPassword, 12)
    }

    await user.save()

    // Ký lại token nếu tên đổi (JWT chứa name)
    if (name) {
        const token = await signToken({ userId: user._id.toString(), email: user.email, name: user.name, role: user.role })
        await setAuthCookie(token)
    }

    return NextResponse.json({ success: true, user: { name: user.name, email: user.email, avatar: user.avatar || '' } })
}
