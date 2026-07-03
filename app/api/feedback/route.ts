import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Feedback from '@/models/Feedback'
import { getCurrentUser, requireAdmin } from '@/lib/auth'
import { isRateLimited } from '@/lib/ratelimit'
import { clientIp, sanitizeText, clampLimit, parsePage } from '@/lib/apiHelpers'

// POST — gửi góp ý (guest hoặc user)
export async function POST(req: NextRequest) {
    try {
        if (isRateLimited(`feedback:${clientIp(req)}`, 5, 10 * 60_000)) {
            return NextResponse.json({ error: 'Bạn gửi quá nhanh, thử lại sau.' }, { status: 429 })
        }
        await dbConnect()
        const raw = await req.json()
        const message = sanitizeText(raw.message)
        const name = sanitizeText(raw.name).slice(0, 60)
        const email = sanitizeText(raw.email).slice(0, 120)

        if (!message || message.length < 5) {
            return NextResponse.json({ error: 'Nội dung góp ý quá ngắn' }, { status: 400 })
        }

        const user = await getCurrentUser()
        await Feedback.create({ name, email, message: message.slice(0, 2000), userId: user?.userId || null })
        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// GET — danh sách góp ý (admin)
export async function GET(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const page = parsePage(req.nextUrl.searchParams.get('page'))
        const limit = clampLimit(req.nextUrl.searchParams.get('limit'))
        const [items, total] = await Promise.all([
            Feedback.find({}).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            Feedback.countDocuments({}),
        ])
        return NextResponse.json({
            success: true,
            items: items.map((f: any) => ({ ...f, _id: f._id.toString() })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// DELETE — xóa góp ý (admin)
export async function DELETE(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })
        await Feedback.findByIdAndDelete(id)
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
