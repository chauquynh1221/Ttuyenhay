import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import ChapterReport from '@/models/ChapterReport'
import { getCurrentUser } from '@/lib/auth'
import { isRateLimited } from '@/lib/ratelimit'
import { clientIp, sanitizeText } from '@/lib/apiHelpers'

export async function POST(req: NextRequest) {
    try {
        if (isRateLimited(`report:${clientIp(req)}`, 10, 5 * 60_000)) {
            return NextResponse.json({ error: 'Bạn gửi báo lỗi quá nhanh, thử lại sau.' }, { status: 429 })
        }
        await dbConnect()
        const raw = await req.json()
        const { truyenSlug, chapterId, chapterNumber, type } = raw
        const message = sanitizeText(raw.message)

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
            message,
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Report error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
