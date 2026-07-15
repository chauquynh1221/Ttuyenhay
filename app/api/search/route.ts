import { NextRequest, NextResponse } from 'next/server'
import { searchTruyen } from '@/lib/truyenQuery'

// GET /api/search - Search truyen với bộ lọc nâng cao
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams
    const result = await searchTruyen({
      q: sp.get('q'),
      genre: sp.get('genre'),
      status: sp.get('status'),
      sort: sp.get('sort'),
      page: sp.get('page'),
      limit: sp.get('limit'),
    })
    return NextResponse.json({ success: true, ...result })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
