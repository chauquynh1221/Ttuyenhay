import Link from 'next/link'
import Cover from '@/components/Cover'
import Breadcrumb from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'
import FavoriteButton from '@/components/FavoriteButton'
import FollowButton from '@/components/FollowButton'
import ShareButtons from '@/components/ShareButtons'
import CommentSection from '@/components/CommentSection'
import RatingWidget from '@/components/RatingWidget'
import RelatedTruyen from '@/components/RelatedTruyen'
import { notFound } from 'next/navigation'
import { slugify } from '@/lib/slugify'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Chapter from '@/models/Chapter'

export const revalidate = 600

const CHAPTERS_PER_PAGE = 50

interface ChapterData { id: string; chapterNumber: number; title: string; createdAt: string }
interface TruyenDetail {
  id: string; title: string; slug: string; author: string; coverImage?: string
  description: string; genres: string[]; status: 'ongoing' | 'completed' | 'paused'
  views: number; rating: number; reviewCount: number; totalChapters: number
  isHot: boolean; isFull: boolean; chapters: ChapterData[]; totalChapterPages: number
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ chapterPage?: string }>
}

async function getTruyenDetail(slug: string, chapterPage: number): Promise<TruyenDetail | null> {
  try {
    await dbConnect()
    const truyen = await Truyen.findOne({ slug }).lean() as any
    if (!truyen) return null

    const totalChapterCount = await Chapter.countDocuments({ truyenId: truyen._id })
    const totalChapterPages = Math.ceil(totalChapterCount / CHAPTERS_PER_PAGE)
    const skip = (chapterPage - 1) * CHAPTERS_PER_PAGE
    const chapters = await Chapter.find({ truyenId: truyen._id })
      .sort({ chapterNumber: 1 }).skip(skip).limit(CHAPTERS_PER_PAGE)
      .select('chapterNumber title createdAt').lean() as any[]

    return {
      id: truyen._id.toString(), title: truyen.title, slug: truyen.slug, author: truyen.author,
      coverImage: truyen.coverImage, description: truyen.description, genres: truyen.genres,
      status: truyen.status, views: truyen.views, rating: truyen.rating, reviewCount: truyen.reviewCount,
      totalChapters: truyen.totalChapters, isHot: truyen.isHot, isFull: truyen.isFull,
      chapters: chapters.map((ch: any) => ({
        id: ch._id.toString(), chapterNumber: ch.chapterNumber, title: ch.title,
        createdAt: (ch.createdAt as Date).toISOString(),
      })),
      totalChapterPages,
    }
  } catch (error) {
    console.error('Error fetching truyen detail:', error)
    return null
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const truyen = await getTruyenDetail(slug, 1)
  if (!truyen) return { title: 'Không tìm thấy' }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return {
    title: `${truyen.title} - ${truyen.author}`,
    description: `Đọc ${truyen.title} của ${truyen.author}. ${truyen.totalChapters} chương. ${truyen.description.slice(0, 120)}...`,
    openGraph: {
      title: truyen.title,
      description: truyen.description.slice(0, 200),
      images: truyen.coverImage ? [{ url: truyen.coverImage, width: 300, height: 450 }] : [],
      url: `${baseUrl}/truyen/${truyen.slug}`,
      type: 'article',
    },
  }
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-lg sm:text-xl font-bold text-foreground">{value}</div>
      <div className="text-[11px] text-muted mt-0.5">{label}</div>
    </div>
  )
}

export default async function TruyenDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { chapterPage: chapterPageStr = '1' } = await searchParams
  const chapterPage = Math.max(1, parseInt(chapterPageStr) || 1)

  const truyen = await getTruyenDetail(slug, chapterPage)
  if (!truyen) notFound()

  const latestChapterNumber = truyen.totalChapters || 1
  const statusLabel = truyen.status === 'completed' ? 'Hoàn thành' : 'Đang ra'
  const viewsLabel = truyen.views >= 1000000 ? `${(truyen.views / 1000000).toFixed(1)}M`
    : truyen.views >= 1000 ? `${(truyen.views / 1000).toFixed(0)}K` : truyen.views.toLocaleString('vi-VN')

  return (
    <div className="container py-4 sm:py-6">
      <Breadcrumb items={[{ label: truyen.title }]} />

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 min-w-0 space-y-4">

          {/* === INFO CARD === */}
          <div className="card p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Cover */}
              <div className="flex-shrink-0 w-36 sm:w-44 mx-auto sm:mx-0">
                <div className="book-cover shadow-card">
                  <Cover src={truyen.coverImage} title={truyen.title} />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight mb-3 text-center sm:text-left">{truyen.title}</h1>

                <div className="space-y-1.5 text-sm mb-4">
                  <div className="flex gap-2">
                    <span className="text-muted w-20 flex-shrink-0">Tác giả</span>
                    <Link href={`/tac-gia/${encodeURIComponent(truyen.author)}`} className="font-semibold text-foreground hover:text-primary transition-colors">{truyen.author}</Link>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted w-20 flex-shrink-0 pt-0.5">Thể loại</span>
                    <div className="flex flex-wrap gap-1.5">
                      {truyen.genres.map((g) => (
                        <Link key={g} href={`/the-loai/${slugify(g)}`} className="inline-flex px-2.5 py-0.5 bg-surface-2 border border-border text-muted rounded text-xs font-medium hover:bg-primary hover:border-primary hover:text-primary-fg transition-colors">{g}</Link>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="text-muted w-20 flex-shrink-0">Trạng thái</span>
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${truyen.status === 'completed' ? 'bg-[rgb(var(--success)/0.12)] text-[rgb(var(--success))]' : 'bg-[rgb(var(--warning)/0.14)] text-[rgb(var(--warning))]'}`}>{statusLabel}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-surface-2 border border-border rounded-lg">
                  <Stat value={Number(truyen.rating).toFixed(1)} label="Đánh giá" />
                  <div className="border-x border-border"><Stat value={viewsLabel} label="Lượt xem" /></div>
                  <Stat value={String(truyen.totalChapters)} label="Chương" />
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2.5">
                  <Link href={`/truyen/${truyen.slug}/1`} className="btn btn-primary">Đọc từ đầu</Link>
                  <Link href={`/truyen/${truyen.slug}/${latestChapterNumber}`} className="btn btn-secondary">Đọc mới nhất</Link>
                  <FavoriteButton truyenId={truyen.id} currentChapter={1} />
                  <FollowButton slug={truyen.slug} title={truyen.title} />
                </div>

                <div className="pt-3"><ShareButtons url={`/truyen/${truyen.slug}`} title={truyen.title} /></div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5 pt-5 border-t border-border">
              <h2 className="text-sm font-bold uppercase text-muted tracking-wide mb-2">Giới thiệu</h2>
              <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{truyen.description}</div>
            </div>
          </div>

          {/* === CHAPTER LIST === */}
          <div className="card p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wide text-foreground pl-3 border-l-[3px] border-primary">Danh sách chương</h2>
              {truyen.totalChapterPages > 1 && <span className="text-xs text-muted">Trang {chapterPage}/{truyen.totalChapterPages}</span>}
            </div>

            {truyen.chapters.length === 0 ? (
              <div className="text-center py-8 text-muted-2">Chưa có chương nào.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {truyen.chapters.map((ch) => (
                  <Link key={ch.id} href={`/truyen/${truyen.slug}/${ch.chapterNumber}`}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border border-transparent hover:border-border hover:bg-surface-2 transition-all group">
                    <span className="text-sm text-foreground group-hover:text-primary line-clamp-1 flex-1 min-w-0">
                      {/^ch(u|ươ)ng\s/i.test(ch.title) ? ch.title : `Chương ${ch.chapterNumber}: ${ch.title}`}
                    </span>
                    <span className="text-xs text-muted-2 flex-shrink-0">{new Date(ch.createdAt).toLocaleDateString('vi-VN')}</span>
                  </Link>
                ))}
              </div>
            )}

            {truyen.totalChapterPages > 1 && (
              <Pagination currentPage={chapterPage} totalPages={truyen.totalChapterPages} baseUrl={`/truyen/${truyen.slug}?`} />
            )}
          </div>

          <CommentSection truyenId={truyen.id} />
          <RelatedTruyen currentSlug={truyen.slug} genres={truyen.genres} />
        </div>

        {/* === SIDEBAR === */}
        <div className="lg:w-72 flex-shrink-0 space-y-4">
          <RatingWidget truyenId={truyen.id} />
        </div>
      </div>
    </div>
  )
}
