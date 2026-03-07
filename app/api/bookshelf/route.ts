import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { getCurrentUser } from '@/lib/auth'
import mongoose from 'mongoose'

// GET /api/bookshelf — lấy tủ sách của user
export async function GET() {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    await dbConnect()
    const user = await User.findById(currentUser.userId)
        .populate('bookmarks.truyenId', 'title slug coverImage totalChapters')
        .lean()

    if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })

    return NextResponse.json({ success: true, bookmarks: (user as any).bookmarks || [] })
}

// POST /api/bookshelf — thêm vào tủ sách
export async function POST(req: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    await dbConnect()
    const { truyenId, currentChapter = 1 } = await req.json()

    if (!truyenId) return NextResponse.json({ error: 'Thiếu truyenId' }, { status: 400 })

    const user = await User.findById(currentUser.userId)
    if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })

    const truyenObjId = new mongoose.Types.ObjectId(truyenId)

    // Kiểm tra đã bookmark chưa
    const existing = (user as any).bookmarks.find(
        (b: any) => b.truyenId.toString() === truyenId
    )

    if (existing) {
        // Cập nhật chapter hiện tại
        existing.currentChapter = currentChapter
    } else {
        // Thêm mới
        ; (user as any).bookmarks.push({ truyenId: truyenObjId, currentChapter, addedAt: new Date() })
    }

    await user.save()
    return NextResponse.json({ success: true, message: 'Đã thêm vào tủ sách' })
}

// DELETE /api/bookshelf?truyenId=xxx — xoá khỏi tủ sách
export async function DELETE(req: NextRequest) {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    await dbConnect()
    const { searchParams } = new URL(req.url)
    const truyenId = searchParams.get('truyenId')

    if (!truyenId) return NextResponse.json({ error: 'Thiếu truyenId' }, { status: 400 })

    const user = await User.findById(currentUser.userId)
    if (!user) return NextResponse.json({ error: 'Không tìm thấy user' }, { status: 404 })

        ; (user as any).bookmarks = (user as any).bookmarks.filter(
            (b: any) => b.truyenId.toString() !== truyenId
        )

    await user.save()
    return NextResponse.json({ success: true, message: 'Đã xoá khỏi tủ sách' })
}
