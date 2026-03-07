import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { signToken, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Vui lòng điền email và mật khẩu' }, { status: 400 })
        }

        // Tìm user theo email
        const user = await User.findOne({ email: email.toLowerCase().trim() })
        if (!user) {
            return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
        }

        // So sánh password
        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            return NextResponse.json({ error: 'Email hoặc mật khẩu không đúng' }, { status: 401 })
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
