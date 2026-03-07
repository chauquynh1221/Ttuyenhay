import Link from 'next/link'
import Breadcrumb from '@/components/Breadcrumb'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Chapter from '@/models/Chapter'
import ChapterContent from './ChapterContent'

interface ChapterData {
  id: string
  truyenId: string
  chapterNumber: number
  title: string
  content: string
  truyenTitle: string
  truyenSlug: string
  prevChapter?: number
  nextChapter?: number
  totalChapters: number
}

interface PageProps {
  params: Promise<{ slug: string; chapterId: string }>
}

async function getChapterData(slug: string, chapterNumber: number): Promise<ChapterData | null> {
  try {
    await dbConnect()

    // Find truyen by slug
    const truyen = await Truyen.findOne({ slug }).lean()
    if (!truyen) {
      return null
    }

    // Find chapter
    const chapter = await Chapter.findOne({
      truyenId: truyen._id,
      chapterNumber: chapterNumber,
    }).lean()

    if (!chapter) {
      return null
    }

    // Find prev and next chapters
    const prevChapter = await Chapter.findOne({
      truyenId: truyen._id,
      chapterNumber: { $lt: chapterNumber },
    })
      .sort({ chapterNumber: -1 })
      .select('chapterNumber')
      .lean()

    const nextChapter = await Chapter.findOne({
      truyenId: truyen._id,
      chapterNumber: { $gt: chapterNumber },
    })
      .sort({ chapterNumber: 1 })
      .select('chapterNumber')
      .lean()

    // Get total chapters
    const totalChapters = await Chapter.countDocuments({ truyenId: truyen._id })

    // Format response
    return {
      id: chapter._id.toString(),
      truyenId: truyen._id.toString(),
      chapterNumber: chapter.chapterNumber,
      title: chapter.title,
      content: chapter.content,
      truyenTitle: truyen.title,
      truyenSlug: truyen.slug,
      prevChapter: prevChapter?.chapterNumber,
      nextChapter: nextChapter?.chapterNumber,
      totalChapters,
    }
  } catch (error) {
    console.error('Error fetching chapter:', error)
    return null
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const resolvedParams = await params

  const { slug, chapterId } = resolvedParams

  if (!chapterId) {
    notFound()
  }

  // Extract chapter number from chapterId (should be just a number like "1")
  const chapterNumber = parseInt(chapterId)

  if (isNaN(chapterNumber)) {
    notFound()
  }

  const chapter = await getChapterData(slug, chapterNumber)

  if (!chapter) {
    notFound()
  }

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            { label: chapter.truyenTitle, href: `/truyen/${chapter.truyenSlug}` },
            { label: `Chương ${chapter.chapterNumber}` },
          ]}
        />
      </div>
      <ChapterContent chapter={chapter} />
    </>
  )
}
