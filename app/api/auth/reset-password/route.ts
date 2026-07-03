import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// POST /api/auth/reset-password — đặt mật khẩu mới bằng token
export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { token, password } = await req.json()
        if (!token || !password) return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 })
        if (String(password).length < 6) return NextResponse.json({ error: 'Mật khẩu tối thiểu 6 ký tự' }, { status: 400 })

        const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } })
        if (!user) return NextResponse.json({ error: 'Liên kết không hợp lệ hoặc đã hết hạn' }, { status: 400 })

        user.password = await bcrypt.hash(password, 12)
        user.resetToken = undefined
        user.resetTokenExpires = undefined
        await user.save()

        return NextResponse.json({ success: true })
    } catch (e) {
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
