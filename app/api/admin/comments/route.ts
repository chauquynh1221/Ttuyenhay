import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Comment from '@/models/Comment'
import Truyen from '@/models/Truyen'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') throw new Error('Unauthorized')
    return user
}

// GET — danh sách comments (admin)
export async function GET(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const q = req.nextUrl.searchParams.get('q') || ''
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20')

        const filter: any = { parentId: null }
        if (q.trim()) {
            filter.$or = [
                { content: { $regex: q.trim(), $options: 'i' } },
                { userName: { $regex: q.trim(), $options: 'i' } },
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
