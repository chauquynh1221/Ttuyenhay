import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
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

        // Tạo user
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: passwordHash,
            role: 'user',
        })

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
