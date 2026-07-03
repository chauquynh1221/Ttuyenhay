import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Chapter from '@/models/Chapter'
import Truyen from '@/models/Truyen'
import { requireAdmin } from '@/lib/auth'
import { clampLimit, parsePage } from '@/lib/apiHelpers'
import mongoose from 'mongoose'

// GET — danh sách chương theo truyện
export async function GET(req: NextRequest) {
    try {
        await requireAdmin()
        await dbConnect()
        const truyenId = req.nextUrl.searchParams.get('truyenId')
        if (!truyenId) return NextResponse.json({ error: 'Thiếu truyenId' }, { status: 400 })

        const page = parsePage(req.nextUrl.searchParams.get('page'))
        const limit = clampLimit(req.nextUrl.searchParams.get('limit'), 50, 200)

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

        const current = await Chapter.findById(id).select('truyenId chapterNumber').lean() as any
        if (!current) return NextResponse.json({ error: 'Chương không tồn tại' }, { status: 404 })

        const updates: any = {}
        if (title !== undefined) updates.title = title.trim()
        if (content !== undefined) updates.content = content.trim()
        if (chapterNumber !== undefined && chapterNumber !== current.chapterNumber) {
            // Chặn đổi sang số chương đã tồn tại
            const dup = await Chapter.findOne({ truyenId: current.truyenId, chapterNumber, _id: { $ne: id } }).select('_id').lean()
            if (dup) return NextResponse.json({ error: `Chương ${chapterNumber} đã tồn tại` }, { status: 409 })
            updates.chapterNumber = chapterNumber
        }

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
