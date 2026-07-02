import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Follow from '@/models/Follow'
import Truyen from '@/models/Truyen'
import { getCurrentUser } from '@/lib/auth'

// POST /api/notifications/seen — đánh dấu đã đọc chương mới
//   body { slug }   → 1 truyện   |   body { all: true } → tất cả
export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    await dbConnect()
    const body = await req.json().catch(() => ({}))

    if (body?.all) {
      const follows = await Follow.find({ userId: currentUser.userId }).select('truyenId').lean() as any[]
      if (follows.length) {
        const truyens = await Truyen.find({ _id: { $in: follows.map((f) => f.truyenId) } })
          .select('totalChapters').lean() as any[]
        const byId = new Map(truyens.map((t) => [t._id.toString(), t.totalChapters || 0]))
        const ops = follows.map((f) => ({
          updateOne: { filter: { _id: f._id }, update: { $set: { seenChapters: byId.get(f.truyenId.toString()) || 0 } } },
        }))
        if (ops.length) await Follow.bulkWrite(ops)
      }
      return NextResponse.json({ success: true })
    }

    const slug = body?.slug
    if (!slug) return NextResponse.json({ error: 'Thiếu slug' }, { status: 400 })

    const truyen = await Truyen.findOne({ slug }).select('_id totalChapters').lean() as any
    if (!truyen) return NextResponse.json({ success: true }) // không có truyện → coi như xong

    await Follow.updateOne(
      { userId: currentUser.userId, truyenId: truyen._id },
      { $set: { seenChapters: truyen.totalChapters || 0 } }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
