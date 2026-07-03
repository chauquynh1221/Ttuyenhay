import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { requireAdmin } from '@/lib/auth'
import { escapeRegex, clampLimit, parsePage } from '@/lib/apiHelpers'

// GET — danh sách users
export async function GET(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const q = req.nextUrl.searchParams.get('q') || ''
        const page = parsePage(req.nextUrl.searchParams.get('page'))
        const limit = clampLimit(req.nextUrl.searchParams.get('limit'))

        const filter: any = {}
        if (q.trim()) {
            const rx = escapeRegex(q.trim())
            filter.$or = [
                { name: { $regex: rx, $options: 'i' } },
                { email: { $regex: rx, $options: 'i' } },
            ]
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('name email role googleId avatar isBanned emailVerified createdAt')
                .lean(),
            User.countDocuments(filter),
        ])

        return NextResponse.json({
            success: true,
            users: users.map((u: any) => ({ ...u, _id: u._id.toString() })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// PUT — đổi role (chống tự hạ quyền mình & gỡ admin cuối cùng)
export async function PUT(req: NextRequest) {
    try {
        const me = await requireAdmin()
        await dbConnect()
        const { id, role } = await req.json()
        if (!id || !role) return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 })
        if (!['user', 'admin'].includes(role)) return NextResponse.json({ error: 'Role không hợp lệ' }, { status: 400 })

        if (id === me.userId && role !== 'admin') {
            return NextResponse.json({ error: 'Không thể tự hạ quyền chính mình' }, { status: 400 })
        }
        // Nếu đang hạ 1 admin xuống user → đảm bảo còn ít nhất 1 admin khác
        if (role === 'user') {
            const target = await User.findById(id).select('role').lean() as any
            if (target?.role === 'admin') {
                const adminCount = await User.countDocuments({ role: 'admin' })
                if (adminCount <= 1) return NextResponse.json({ error: 'Phải còn ít nhất 1 admin' }, { status: 400 })
            }
        }

        await User.findByIdAndUpdate(id, { role })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// PATCH — khóa/mở khóa tài khoản
export async function PATCH(req: NextRequest) {
    try {
        const me = await requireAdmin()
        await dbConnect()
        const { id, isBanned } = await req.json()
        if (!id || typeof isBanned !== 'boolean') return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 })
        if (id === me.userId) return NextResponse.json({ error: 'Không thể tự khóa chính mình' }, { status: 400 })

        await User.findByIdAndUpdate(id, { isBanned })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// DELETE — xóa user
export async function DELETE(req: NextRequest) {
    try {
        const me = await requireAdmin()
        await dbConnect()
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        if (id === me.userId) return NextResponse.json({ error: 'Không thể tự xóa chính mình' }, { status: 400 })

        const target = await User.findById(id).select('role').lean() as any
        if (target?.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' })
            if (adminCount <= 1) return NextResponse.json({ error: 'Phải còn ít nhất 1 admin' }, { status: 400 })
        }

        await User.findByIdAndDelete(id)
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
