import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Follow from '@/models/Follow'
import { getCurrentUser } from '@/lib/auth'

// GET /api/follow - lấy danh sách truyện đang theo dõi
export async function GET(_req: NextRequest) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

        await dbConnect()
        const follows = await Follow.find({ userId: currentUser.userId })
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json({
            success: true,
            follows: follows.map((f: any) => ({
                truyenId: f.truyenId.toString(),
                truyenSlug: f.truyenSlug,
                truyenTitle: f.truyenTitle,
                truyenCover: f.truyenCover,
                followedAt: f.createdAt,
            })),
        })
    } catch (error) {
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
