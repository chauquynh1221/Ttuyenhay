import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Chapter from '@/models/Chapter'
import { requireAdmin } from '@/lib/auth'

// GET /api/truyen/[slug] - Get truyen details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect()
    const { slug } = await params

    const truyen = await Truyen.findOne({ slug }).lean() as any

    if (!truyen) {
      return NextResponse.json(
        { success: false, error: 'Truyện không tồn tại' },
        { status: 404 }
      )
    }

    // Get first 50 chapters
    const chapters = await Chapter.find({ truyenId: truyen._id })
      .sort({ chapterNumber: 1 })
      .limit(50)
      .select('chapterNumber title createdAt')
      .lean()

    // (Đếm view đã chuyển sang POST /api/truyen/[slug]/view có dedupe — GET không side-effect)

    return NextResponse.json({
      success: true,
      data: {
        ...truyen,
        chapters,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/truyen/[slug] - Update truyen
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin()
    await dbConnect()
    const { slug } = await params
    const body = await request.json()

    const truyen = await Truyen.findOneAndUpdate(
      { slug },
      body,
      { new: true, runValidators: true }
    )

    if (!truyen) {
      return NextResponse.json(
        { success: false, error: 'Truyện không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: truyen,
    })
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

// DELETE /api/truyen/[slug] - Delete truyen
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await requireAdmin()
    await dbConnect()
    const { slug } = await params

    const truyen = await Truyen.findOneAndDelete({ slug })

    if (!truyen) {
      return NextResponse.json(
        { success: false, error: 'Truyện không tồn tại' },
        { status: 404 }
      )
    }

    // Delete all chapters
    await Chapter.deleteMany({ truyenId: truyen._id })

    return NextResponse.json({
      success: true,
      message: 'Xóa truyện thành công',
    })
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
