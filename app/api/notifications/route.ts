import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Follow from '@/models/Follow'
import Truyen from '@/models/Truyen'
import { getCurrentUser } from '@/lib/auth'

// GET /api/notifications — danh sách truyện đang theo dõi CÓ chương mới
export async function GET(_req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })

    await dbConnect()
    const follows = await Follow.find({ userId: currentUser.userId }).lean() as any[]
    if (follows.length === 0) return NextResponse.json({ success: true, count: 0, items: [] })

    const ids = follows.map((f) => f.truyenId)
    const truyens = await Truyen.find({ _id: { $in: ids } })
      .select('slug title coverImage totalChapters').lean() as any[]
    const byId = new Map(truyens.map((t) => [t._id.toString(), t]))

    const items: any[] = []
    const lazyInit: any[] = [] // follow cũ thiếu seenChapters → khởi tạo mốc = hiện tại

    for (const f of follows) {
      const t = byId.get(f.truyenId.toString())
      if (!t) continue
      const total = t.totalChapters || 0

      if (f.seenChapters == null) {
        lazyInit.push({ updateOne: { filter: { _id: f._id }, update: { $set: { seenChapters: total } } } })
        continue
      }
      if (total > f.seenChapters) {
        items.push({
          slug: t.slug,
          title: t.title,
          cover: t.coverImage || '',
          newCount: total - f.seenChapters,
          latest: total,
        })
      }
    }

    if (lazyInit.length) { try { await Follow.bulkWrite(lazyInit) } catch { } }

    items.sort((a, b) => b.newCount - a.newCount)
    return NextResponse.json({ success: true, count: items.length, items })
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
