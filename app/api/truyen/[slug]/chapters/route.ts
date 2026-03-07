import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Chapter from '@/models/Chapter'

// GET /api/truyen/[slug]/chapters - Get all chapters of a truyen
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params

    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const truyen = await Truyen.findOne({ slug }).select('_id').lean() as any

    if (!truyen) {
      return NextResponse.json(
        { success: false, error: 'Truyện không tồn tại' },
        { status: 404 }
      )
    }

    const skip = (page - 1) * limit

    const [chapters, total] = await Promise.all([
      Chapter.find({ truyenId: truyen._id })
        .sort({ chapterNumber: 1 })
        .limit(limit)
        .skip(skip)
        .select('chapterNumber title createdAt views')
        .lean(),
      Chapter.countDocuments({ truyenId: truyen._id }),
    ])

    return NextResponse.json({
      success: true,
      data: chapters,
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

// POST /api/truyen/[slug]/chapters - Create new chapter
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params
    const body = await request.json()

    const truyen = await Truyen.findOne({ slug }).select('_id').lean() as any

    if (!truyen) {
      return NextResponse.json(
        { success: false, error: 'Truyện không tồn tại' },
        { status: 404 }
      )
    }

    const chapter = await Chapter.create({
      ...body,
      truyenId: truyen._id,
    })

    // Update totalChapters
    await Truyen.findByIdAndUpdate(truyen._id, {
      $inc: { totalChapters: 1 },
    })

    return NextResponse.json({
      success: true,
      data: chapter,
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    )
  }
}
