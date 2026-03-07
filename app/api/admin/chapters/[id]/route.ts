import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Chapter from '@/models/Chapter'
import { getCurrentUser } from '@/lib/auth'

async function requireAdmin() {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') throw new Error('Unauthorized')
    return user
}

// GET — lấy nội dung đầy đủ 1 chương (để edit)
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await requireAdmin()
        await dbConnect()
        const { id } = await params
        const chapter = await Chapter.findById(id).lean()
        if (!chapter) return NextResponse.json({ error: 'Chương không tồn tại' }, { status: 404 })

        return NextResponse.json({
            success: true,
            chapter: { ...(chapter as any), _id: (chapter as any)._id.toString() },
        })
    } catch (e: any) {
        if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
    }
}
