import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ChapterReport from '@/models/ChapterReport'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const { truyenSlug, chapterId, chapterNumber, type, message } = await req.json()

        if (!truyenSlug || !chapterId || !type) {
            return NextResponse.json({ error: 'Thiếu thông tin' }, { status: 400 })
        }

        const currentUser = await getCurrentUser()

        await ChapterReport.create({
            truyenSlug,
            chapterId,
            chapterNumber: chapterNumber || 0,
            userId: currentUser?.userId || null,
            guestName: currentUser ? '' : 'Ẩn danh',
            type,
            message: message?.trim() || '',
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Report error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
