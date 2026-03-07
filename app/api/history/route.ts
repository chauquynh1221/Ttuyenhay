import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { getCurrentUser } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/history — lấy lịch sử đọc
export async function GET() {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    await dbConnect()
    const user = await User.findById(currentUser.userId)
        .populate('readingHistory.truyenId', 'title slug coverImage totalChapters')
        .lean()

    if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })

    // Trả về mới nhất trước
    const history = [...((user as any).readingHistory || [])].reverse()
    return NextResponse.json({ success: true, history })
}

// POST /api/history — lưu lịch sử đọc
export async function POST(req: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    await dbConnect()
    const { truyenId, chapterId } = await req.json()

    if (!truyenId || !chapterId) {
        return NextResponse.json({ error: 'Thiếu truyenId hoặc chapterId' }, { status: 400 })
    }

    const user = await User.findById(currentUser.userId)
    if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })

    const truyenObjId = new mongoose.Types.ObjectId(truyenId)
    const chapterObjId = new mongoose.Types.ObjectId(chapterId)

        // Xóa entry cũ cùng truyện (để đẩy lên đầu)
        ; (user as any).readingHistory = (user as any).readingHistory.filter(
            (h: any) => h.truyenId.toString() !== truyenId
        )

        // Thêm entry mới
        ; (user as any).readingHistory.push({
            truyenId: truyenObjId,
            chapterId: chapterObjId,
            readAt: new Date(),
        })

    await user.save()
    return NextResponse.json({ success: true })
}

// DELETE /api/history?truyenId=xxx — xóa khỏi lịch sử
export async function DELETE(req: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    await dbConnect()
    const { searchParams } = new URL(req.url)
    const truyenId = searchParams.get('truyenId')

    const user = await User.findById(currentUser.userId)
    if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })

    if (truyenId) {
        ; (user as any).readingHistory = (user as any).readingHistory.filter(
            (h: any) => h.truyenId.toString() !== truyenId
        )
    } else {
        // Xóa toàn bộ lịch sử
        ; (user as any).readingHistory = []
    }

    await user.save()
    return NextResponse.json({ success: true })
}
