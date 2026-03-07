import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Chapter from '@/models/Chapter'

// GET /api/chapters/[slug]/[chapterNumber] - Get chapter content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; chapterNumber: string }> }
) {
  try {
    await dbConnect()
    const { slug, chapterNumber } = await params

    const truyen = await Truyen.findOne({ slug })
      .select('_id title slug totalChapters')
      .lean() as any

    if (!truyen) {
      return NextResponse.json(
        { success: false, error: 'Truyện không tồn tại' },
        { status: 404 }
      )
    }

    const chapter = await Chapter.findOne({
      truyenId: truyen._id,
      chapterNumber: parseInt(chapterNumber),
    }).lean() as any

    if (!chapter) {
      return NextResponse.json(
        { success: false, error: 'Chương không tồn tại' },
        { status: 404 }
      )
    }

    // Increment views
    await Chapter.findByIdAndUpdate(chapter._id, { $inc: { views: 1 } })

    // Get prev/next chapter numbers
    const prevChapter = await Chapter.findOne({
      truyenId: truyen._id,
      chapterNumber: { $lt: parseInt(chapterNumber) },
    })
      .sort({ chapterNumber: -1 })
      .select('chapterNumber')
      .lean() as any

    const nextChapter = await Chapter.findOne({
      truyenId: truyen._id,
      chapterNumber: { $gt: parseInt(chapterNumber) },
    })
      .sort({ chapterNumber: 1 })
      .select('chapterNumber')
      .lean() as any

    return NextResponse.json({
      success: true,
      data: {
        ...chapter,
        truyenTitle: truyen.title,
        truyenSlug: truyen.slug,
        totalChapters: truyen.totalChapters,
        prevChapter: prevChapter?.chapterNumber,
        nextChapter: nextChapter?.chapterNumber,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
