import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Chapter from '@/models/Chapter'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; chapterNumber: string }> }
) {
  try {
    const { slug, chapterNumber } = await params
    const chapterNum = parseInt(chapterNumber)

    await dbConnect()

    // Find truyen by slug
    const truyen = await Truyen.findOne({ slug }).lean() as any
    if (!truyen) {
      return NextResponse.json({ error: 'Truyện không tồn tại' }, { status: 404 })
    }

    // Find chapter
    const chapter = await Chapter.findOne({
      truyenId: truyen._id,
      chapterNumber: chapterNum,
    }).lean() as any

    if (!chapter) {
      return NextResponse.json({ error: 'Chương không tồn tại' }, { status: 404 })
    }

    // Find prev and next chapters
    const prevChapter = await Chapter.findOne({
      truyenId: truyen._id,
      chapterNumber: { $lt: chapterNum },
    })
      .sort({ chapterNumber: -1 })
      .select('chapterNumber')
      .lean() as any

    const nextChapter = await Chapter.findOne({
      truyenId: truyen._id,
      chapterNumber: { $gt: chapterNum },
    })
      .sort({ chapterNumber: 1 })
      .select('chapterNumber')
      .lean() as any

    // Get total chapters
    const totalChapters = await Chapter.countDocuments({ truyenId: truyen._id })

    // Format response
    const response = {
      id: chapter._id.toString(),
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      content: chapter.content,
      truyenTitle: truyen.title,
      truyenSlug: truyen.slug,
      prevChapter: prevChapter?.chapterNumber,
      nextChapter: nextChapter?.chapterNumber,
      totalChapters,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return NextResponse.json({ error: 'Lỗi server' }, { status: 500 })
  }
}
