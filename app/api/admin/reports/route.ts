import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ChapterReport from '@/models/ChapterReport'
import Truyen from '@/models/Truyen'
import { requireAdmin } from '@/lib/auth'
import { clampLimit, parsePage } from '@/lib/apiHelpers'

// GET — danh sách báo lỗi. ?status=pending|resolved (map sang field boolean `resolved`)
export async function GET(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const status = req.nextUrl.searchParams.get('status') || ''
        const page = parsePage(req.nextUrl.searchParams.get('page'))
        const limit = clampLimit(req.nextUrl.searchParams.get('limit'))

        const filter: any = {}
        if (status === 'resolved') filter.resolved = true
        else if (status === 'pending') filter.resolved = { $ne: true }

        const [reports, total] = await Promise.all([
            ChapterReport.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            ChapterReport.countDocuments(filter),
        ])

        // Join tên truyện theo truyenSlug (model không có ref truyenId)
        const slugs = [...new Set(reports.map((r: any) => r.truyenSlug).filter(Boolean))]
        const truyens = slugs.length
            ? await Truyen.find({ slug: { $in: slugs } }).select('title slug').lean() as any[]
            : []
        const titleBySlug = new Map(truyens.map((t) => [t.slug, t.title]))

        return NextResponse.json({
            success: true,
            reports: reports.map((r: any) => ({
                ...r,
                _id: r._id.toString(),
                truyenTitle: titleBySlug.get(r.truyenSlug) || r.truyenSlug,
            })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// PUT — đánh dấu đã xử lý / mở lại (field boolean `resolved`)
export async function PUT(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id, resolved } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        await ChapterReport.findByIdAndUpdate(id, { resolved: resolved !== false })
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
