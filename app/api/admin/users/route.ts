import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') throw new Error('Unauthorized')
    return user
}

// GET — danh sách users
export async function GET(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const q = req.nextUrl.searchParams.get('q') || ''
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')

        const filter: any = {}
        if (q.trim()) {
            filter.$or = [
                { name: { $regex: q.trim(), $options: 'i' } },
                { email: { $regex: q.trim(), $options: 'i' } },
            ]
        }

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('name email role googleId avatar createdAt')
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

// PUT — đổi role
export async function PUT(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id, role } = await req.json()
        if (!id || !role) return NextResponse.json({ error: 'Thiếu dữ liệu' }, { status: 400 })
        if (!['user', 'vip', 'admin'].includes(role)) return NextResponse.json({ error: 'Role không hợp lệ' }, { status: 400 })

        await User.findByIdAndUpdate(id, { role })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
