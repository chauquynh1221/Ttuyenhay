import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Follow from '@/models/Follow'
import Truyen from '@/models/Truyen'
import { getCurrentUser } from '@/lib/auth'

// GET /api/follow/[slug] - kiểm tra đang follow không
// DELETE /api/follow/[slug] - unfollow
export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return NextResponse.json({ following: false })

        await dbConnect()
        const { slug } = await params
        const truyen = await Truyen.findOne({ slug }).select('_id').lean()
        if (!truyen) return NextResponse.json({ following: false })

        const follow = await Follow.findOne({
            userId: currentUser.userId,
            truyenId: (truyen as any)._id,
        }).lean()

        return NextResponse.json({ following: !!follow })
    } catch {
        return NextResponse.json({ following: false })
    }
}

// POST /api/follow/[slug] - toggle follow
export async function POST(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

        await dbConnect()
        const { slug } = await params
        const truyen = await Truyen.findOne({ slug }).select('_id title coverImage').lean() as any
        if (!truyen) return NextResponse.json({ error: 'Không tìm thấy truyện' }, { status: 404 })

        const existing = await Follow.findOne({
            userId: currentUser.userId,
            truyenId: truyen._id,
        })

        if (existing) {
            await existing.deleteOne()
            return NextResponse.json({ following: false, message: 'Đã bỏ theo dõi' })
        }

        await Follow.create({
            userId: currentUser.userId,
            truyenId: truyen._id,
            truyenSlug: slug,
            truyenTitle: truyen.title,
            truyenCover: truyen.coverImage || '',
        })

        return NextResponse.json({ following: true, message: 'Đang theo dõi' })
    } catch (error) {
        console.error('Follow toggle error:', error)
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
