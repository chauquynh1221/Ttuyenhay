import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'

// GET /api/search - Search truyen với bộ lọc nâng cao
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''
    const genre = searchParams.get('genre') || ''
    const status = searchParams.get('status') || ''
    const sort = searchParams.get('sort') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build query
    const filter: any = {}

    if (q.trim()) {
      // Normalize: cho phép tìm kiếm cả có dấu và không dấu
      const normalized = q.trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')  // bỏ dấu
        .replace(/đ/gi, 'd')
      const patterns = [...new Set([normalized, q.trim()])]
      filter.$or = patterns.flatMap((p: string) => [
        { title: { $regex: p, $options: 'i' } },
        { author: { $regex: p, $options: 'i' } },
      ])
    }

    if (genre) {
      filter.genres = { $in: [genre] }
    }

    if (status === 'full') {
      filter.isFull = true
    } else if (status === 'ongoing') {
      filter.isFull = { $ne: true }
    }

    // Sort
    let sortQuery: any = { views: -1 }
    if (sort === 'newest') sortQuery = { createdAt: -1 }
    else if (sort === 'updated') sortQuery = { updatedAt: -1 }
    else if (sort === 'chapters') sortQuery = { totalChapters: -1 }
    else if (sort === 'rating') sortQuery = { rating: -1 }

    const [truyen, total] = await Promise.all([
      Truyen.find(filter)
        .sort(sortQuery)
        .limit(limit)
        .skip(skip)
        .select('-__v')
        .lean(),
      Truyen.countDocuments(filter),
    ])

    return NextResponse.json({
      success: true,
      data: truyen,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
