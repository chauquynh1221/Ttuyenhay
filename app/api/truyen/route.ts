import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'

// GET /api/truyen - Get list of truyen with filters and pagination
export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const genre = searchParams.get('genre')
    const status = searchParams.get('status')
    const isHot = searchParams.get('isHot')
    const isFull = searchParams.get('isFull')
    const isNew = searchParams.get('isNew')
    const sort = searchParams.get('sort') || 'updatedAt'
    const order = searchParams.get('order') || 'desc'
    const since = searchParams.get('since') // ISO date string for time-based filtering (Top Daily/Monthly)

    // Build query
    const query: any = {}
    if (genre) query.genres = genre
    if (status) query.status = status
    if (isHot === 'true') query.isHot = true
    if (isFull === 'true') query.isFull = true
    if (isNew === 'true') query.isNew = true
    // FIX #3: Filter theo thời gian cho Top Ngày/Tháng
    if (since) query.updatedAt = { $gte: new Date(since) }

    // Build sort - handle both 'views' and '-views' format
    const sortObj: any = {}
    const sortField = sort.startsWith('-') ? sort.slice(1) : sort
    sortObj[sortField] = order === 'desc' ? -1 : 1

    const skip = (page - 1) * limit

    const [truyen, total] = await Promise.all([
      Truyen.find(query)
        .sort(sortObj)
        .limit(limit)
        .skip(skip)
        .select('-__v')
        .lean(),
      Truyen.countDocuments(query),
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

// POST /api/truyen - Create new truyen (admin only)
export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const truyen = await Truyen.create(body)

    return NextResponse.json({
      success: true,
      data: truyen,
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
