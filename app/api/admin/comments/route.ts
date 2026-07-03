import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Comment from '@/models/Comment'
import Truyen from '@/models/Truyen'
import { requireAdmin } from '@/lib/auth'
import { escapeRegex, clampLimit, parsePage } from '@/lib/apiHelpers'

// GET — danh sách comments (admin) — bao gồm CẢ reply để kiểm duyệt
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
                { content: { $regex: rx, $options: 'i' } },
                { userName: { $regex: rx, $options: 'i' } },
            ]
        }

        const [comments, total] = await Promise.all([
            Comment.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Comment.countDocuments(filter),
        ])

        // Join truyện info
        const truyenIds = [...new Set(comments.map((c: any) => c.truyenId?.toString()).filter(Boolean))]
        const truyenMap: Record<string, any> = {}
        if (truyenIds.length > 0) {
            const truyens = await Truyen.find({ _id: { $in: truyenIds } }).select('title slug').lean()
            truyens.forEach((t: any) => { truyenMap[t._id.toString()] = t })
        }

        return NextResponse.json({
            success: true,
            comments: comments.map((c: any) => {
                const t = truyenMap[c.truyenId?.toString()]
                return {
                    ...c,
                    _id: c._id.toString(),
                    isReply: !!c.parentId,
                    truyenTitle: t?.title || '',
                    truyenSlug: t?.slug || '',
                }
            }),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
