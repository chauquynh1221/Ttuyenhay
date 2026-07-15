import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import { requireAdmin } from '@/lib/auth'
import { queryTruyen } from '@/lib/truyenQuery'

// GET /api/truyen - Get list of truyen with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const result = await queryTruyen({
      page: sp.get('page'),
      limit: sp.get('limit'),
      genre: sp.get('genre'),
      status: sp.get('status'),
      isHot: sp.get('isHot'),
      isFull: sp.get('isFull'),
      isNew: sp.get('isNew'),
      sort: sp.get('sort'),
      order: sp.get('order'),
      since: sp.get('since'), // ISO date cho Top Ngày/Tháng
    })
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/truyen - Create new truyen (admin only)
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()
    await dbConnect()

    const body = await request.json()
    const truyen = await Truyen.create(body)

    return NextResponse.json({
      success: true,
      data: truyen,
    }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
