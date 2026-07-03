import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import { requireAdmin } from '@/lib/auth'

// GET /api/admin/truyen/[slug] — lấy 1 truyện theo slug (dùng cho trang sửa/quản lý chương)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin()
    await dbConnect()
    const { slug } = await params
    const truyen = await Truyen.findOne({ slug }).lean() as any
    if (!truyen) return NextResponse.json({ error: 'Không tìm thấy truyện' }, { status: 404 })
    return NextResponse.json({ success: true, truyen: { ...truyen, _id: truyen._id.toString() } })
  } catch (e: any) {
    if (e.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Lỗi máy chủ' }, { status: 500 })
  }
}
