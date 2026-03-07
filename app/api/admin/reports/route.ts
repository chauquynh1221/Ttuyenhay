import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ChapterReport from '@/models/ChapterReport'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') throw new Error('Unauthorized')
    return user
}

// GET — danh sách báo lỗi
export async function GET(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const status = req.nextUrl.searchParams.get('status') || ''
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')

        const filter: any = {}
        if (status) filter.status = status

        const [reports, total] = await Promise.all([
            ChapterReport.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate('truyenId', 'title slug')
                .lean(),
            ChapterReport.countDocuments(filter),
        ])

        return NextResponse.json({
            success: true,
            reports: reports.map((r: any) => ({ ...r, _id: r._id.toString() })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// PUT — cập nhật trạng thái report
export async function PUT(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id, status } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        await ChapterReport.findByIdAndUpdate(id, { status: status || 'resolved' })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// DELETE — xóa report
export async function DELETE(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        await ChapterReport.findByIdAndDelete(id)
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
