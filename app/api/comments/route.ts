import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Comment from '@/models/Comment'
import Truyen from '@/models/Truyen'
import { getCurrentUser } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/comments?truyenId=xxx&chapterId=yyy&page=1
export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const { searchParams } = new URL(req.url)
        const truyenId = searchParams.get('truyenId')
        const chapterId = searchParams.get('chapterId')
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const limit = 20

        if (!truyenId) return NextResponse.json({ error: 'Thiếu truyenId' }, { status: 400 })

        const filter: any = {
            truyenId: new mongoose.Types.ObjectId(truyenId),
            parentId: null,  // Chỉ lấy root comments
        }
        if (chapterId) {
            filter.chapterId = new mongoose.Types.ObjectId(chapterId)
        } else {
            filter.chapterId = null
        }

        const [rawComments, total] = await Promise.all([
            Comment.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Comment.countDocuments(filter),
        ])

        // Lấy replies cho mỗi root comment
        const rootIds = rawComments.map((c: any) => c._id)
        const rawReplies = rootIds.length > 0
            ? await Comment.find({ parentId: { $in: rootIds } }).sort({ createdAt: 1 }).lean()
            : []

        // Serialize ObjectId fields
        const serialize = (c: any) => ({
            ...c,
            _id: c._id.toString(),
            userId: c.userId?.toString() || '',
            truyenId: c.truyenId?.toString() || '',
            chapterId: c.chapterId?.toString() || null,
            parentId: c.parentId?.toString() || null,
        })

        const repliesMap: Record<string, any[]> = {}
        rawReplies.forEach((r: any) => {
            const pid = r.parentId.toString()
            if (!repliesMap[pid]) repliesMap[pid] = []
            repliesMap[pid].push(serialize(r))
        })

        const comments = rawComments.map((c: any) => ({
            ...serialize(c),
            replies: repliesMap[c._id.toString()] || [],
        }))

        return NextResponse.json({
            success: true,
            comments,
            pagination: { total, page, pages: Math.ceil(total / limit) },
        })
    } catch (error) {
        console.error('GET comments error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// POST /api/comments — đăng bình luận (logged in hoặc guest)
export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser()
        await dbConnect()
        const { truyenId, chapterId, content, parentId, guestName } = await req.json()

        // Nếu không login: phải có guestName
        if (!currentUser && (!guestName || !guestName.trim())) {
            return NextResponse.json({ error: 'Vui lòng nhập tên để bình luận' }, { status: 400 })
        }

        if (!truyenId || !content?.trim()) {
            return NextResponse.json({ error: 'Thiếu nội dung hoặc truyenId' }, { status: 400 })
        }
        if (content.trim().length < 2) {
            return NextResponse.json({ error: 'Bình luận quá ngắn' }, { status: 400 })
        }
        if (content.trim().length > 2000) {
            return NextResponse.json({ error: 'Bình luận tối đa 2000 ký tự' }, { status: 400 })
        }

        // Kiểm tra truyện tồn tại
        const truyen = await Truyen.findById(truyenId)
        if (!truyen) return NextResponse.json({ error: 'Truyện không tồn tại' }, { status: 404 })

        const comment = await Comment.create({
            truyenId: new mongoose.Types.ObjectId(truyenId),
            chapterId: chapterId ? new mongoose.Types.ObjectId(chapterId) : null,
            parentId: parentId ? new mongoose.Types.ObjectId(parentId) : null,
            userId: currentUser ? new mongoose.Types.ObjectId(currentUser.userId) : null,
            userName: currentUser ? currentUser.name : guestName.trim().slice(0, 30),
            content: content.trim(),
        })

        const serialized = {
            ...(comment as any).toObject(),
            _id: (comment as any)._id.toString(),
            userId: (comment as any).userId?.toString() || '',
            truyenId: (comment as any).truyenId.toString(),
            chapterId: (comment as any).chapterId?.toString() || null,
            parentId: (comment as any).parentId?.toString() || null,
        }

        return NextResponse.json({ success: true, comment: serialized }, { status: 201 })
    } catch (error) {
        console.error('POST comment error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
