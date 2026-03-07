import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Chapter from '@/models/Chapter'
import Truyen from '@/models/Truyen'
import { getCurrentUser } from '@/lib/auth'
import mongoose from 'mongoose'

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') throw new Error('Unauthorized')
    return user
}

// GET — danh sách chương theo truyện
export async function GET(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const truyenId = req.nextUrl.searchParams.get('truyenId')
        if (!truyenId) return NextResponse.json({ error: 'Thiếu truyenId' }, { status: 400 })

        const page = parseInt(req.nextUrl.searchParams.get('page') || '1')
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '50')

        const [chapters, total] = await Promise.all([
            Chapter.find({ truyenId: new mongoose.Types.ObjectId(truyenId) })
                .sort({ chapterNumber: 1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('chapterNumber title content createdAt updatedAt')
                .lean(),
            Chapter.countDocuments({ truyenId: new mongoose.Types.ObjectId(truyenId) }),
        ])

        return NextResponse.json({
            success: true,
            chapters: chapters.map((c: any) => ({
                ...c,
                _id: c._id.toString(),
                contentLength: c.content?.length || 0,
                content: undefined,  // Không trả content trong list
            })),
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// POST — thêm chương mới
export async function POST(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { truyenId, chapterNumber, title, content } = await req.json()

        if (!truyenId || !chapterNumber || !content) {
            return NextResponse.json({ error: 'Thiếu truyenId, chapterNumber hoặc content' }, { status: 400 })
        }

        const truyen = await Truyen.findById(truyenId)
        if (!truyen) return NextResponse.json({ error: 'Truyện không tồn tại' }, { status: 404 })

        // Kiểm tra chương trùng
        const exists = await Chapter.findOne({ truyenId: new mongoose.Types.ObjectId(truyenId), chapterNumber })
        if (exists) return NextResponse.json({ error: `Chương ${chapterNumber} đã tồn tại` }, { status: 409 })

        const chapter = await Chapter.create({
            truyenId: new mongoose.Types.ObjectId(truyenId),
            chapterNumber,
            title: title?.trim() || `Chương ${chapterNumber}`,
            content: content.trim(),
        })

        // Cập nhật totalChapters
        const count = await Chapter.countDocuments({ truyenId: new mongoose.Types.ObjectId(truyenId) })
        await Truyen.findByIdAndUpdate(truyenId, { totalChapters: count })

        return NextResponse.json({ success: true, chapter: { ...chapter.toObject(), content: undefined } }, { status: 201 })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        console.error('Admin POST chapter error:', e)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// PUT — sửa chương
export async function PUT(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id, title, content, chapterNumber } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        const updates: any = {}
        if (title !== undefined) updates.title = title.trim()
        if (content !== undefined) updates.content = content.trim()
        if (chapterNumber !== undefined) updates.chapterNumber = chapterNumber

        const chapter = await Chapter.findByIdAndUpdate(id, updates, { new: true })
        if (!chapter) return NextResponse.json({ error: 'Chương không tồn tại' }, { status: 404 })

        return NextResponse.json({ success: true, chapter: { ...(chapter as any).toObject(), content: undefined } })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}

// DELETE — xóa chương
export async function DELETE(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id, truyenId } = await req.json()
        if (!id) return NextResponse.json({ error: 'Thiếu ID' }, { status: 400 })

        await Chapter.findByIdAndDelete(id)

        // Cập nhật totalChapters
        if (truyenId) {
            const count = await Chapter.countDocuments({ truyenId: new mongoose.Types.ObjectId(truyenId) })
            await Truyen.findByIdAndUpdate(truyenId, { totalChapters: count })
        }

        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
