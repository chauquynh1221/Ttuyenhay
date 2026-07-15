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
import { CatEars } from '@/components/icons'
import MarkChapterSeen from '@/components/MarkChapterSeen'
import ReadChapterMarks from '@/components/ReadChapterMarks'
import ViewPing from '@/components/ViewPing'
import { notFound } from 'next/navigation'
import { slugify } from '@/lib/slugify'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Chapter from '@/models/Chapter'
import { getBaseUrl } from '@/lib/getBaseUrl'

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
  const baseUrl = await getBaseUrl()
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

function Meta({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-base sm:text-lg font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted">{label}</span>
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
    <>
      <MarkChapterSeen slug={truyen.slug} />
      <ReadChapterMarks slug={truyen.slug} />
      <ViewPing slug={truyen.slug} />

      {/* === CINEMATIC HEADER: full-bleed, backdrop từ bìa === */}
      <section className="relative overflow-hidden">
        {truyen.coverImage && (
          <img src={truyen.coverImage} alt="" aria-hidden className="backdrop-img" />
        )}
        <div className="backdrop-fade" />

        <div className="container relative pt-4 sm:pt-6 pb-7 sm:pb-10">
          <Breadcrumb items={[{ label: truyen.title }]} />

          <div className="flex items-end gap-5 sm:gap-8 mt-2 sm:mt-6">
            {/* Cover — tai mèo = chữ ký Bongmeow */}
            <div className="relative flex-shrink-0 w-32 sm:w-44 lg:w-52">
              <CatEars className="absolute -top-[13px] sm:-top-[17px] left-1/2 -translate-x-1/2 w-14 h-6 sm:w-[72px] sm:h-8 text-primary drop-shadow-sm z-10" />
              <div className="book-cover !rounded-lg shadow-pop ring-1 ring-white/10">
                <Cover src={truyen.coverImage} title={truyen.title} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pb-0.5">
              <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                {truyen.genres.slice(0, 4).map((g) => (
                  <Link key={g} href={`/the-loai/${slugify(g)}`} className="inline-flex px-2.5 py-1 bg-surface-2/70 border border-border text-foreground/80 rounded-full text-xs font-medium backdrop-blur-sm hover:border-primary/60 hover:text-primary transition-colors">{g}</Link>
                ))}
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${truyen.status === 'completed' ? 'bg-[rgb(var(--success)/0.15)] text-[rgb(var(--success))]' : 'bg-[rgb(var(--warning)/0.15)] text-[rgb(var(--warning))]'}`}>{statusLabel}</span>
              </div>

              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-foreground leading-[1.05] tracking-tight">{truyen.title}</h1>

              <Link href={`/tac-gia/${encodeURIComponent(truyen.author)}`} className="inline-block mt-2 text-sm sm:text-base font-medium text-muted hover:text-primary transition-colors">
                {truyen.author}
              </Link>

              {/* Meta inline */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 sm:mt-4">
                <Meta value={Number(truyen.rating).toFixed(1)} label="★ đánh giá" />
                <Meta value={viewsLabel} label="lượt đọc" />
                <Meta value={String(truyen.totalChapters)} label="chương" />
              </div>

              {/* Actions — desktop */}
              <div className="hidden sm:flex flex-wrap items-center gap-2.5 mt-5">
                <Link href={`/truyen/${truyen.slug}/1`} className="btn btn-primary px-7">Đọc từ đầu</Link>
                <Link href={`/truyen/${truyen.slug}/${latestChapterNumber}`} className="btn btn-default px-6">Đọc mới nhất</Link>
                <FavoriteButton truyenId={truyen.id} currentChapter={1} />
                <FollowButton slug={truyen.slug} title={truyen.title} />
              </div>
            </div>
          </div>

          {/* Actions — mobile (hàng riêng, full width) */}
          <div className="sm:hidden grid grid-cols-2 gap-2.5 mt-5">
            <Link href={`/truyen/${truyen.slug}/1`} className="btn btn-primary">Đọc từ đầu</Link>
            <Link href={`/truyen/${truyen.slug}/${latestChapterNumber}`} className="btn btn-default">Đọc mới nhất</Link>
            <FavoriteButton truyenId={truyen.id} currentChapter={1} />
            <FollowButton slug={truyen.slug} title={truyen.title} />
          </div>

          <div className="mt-4"><ShareButtons url={`/truyen/${truyen.slug}`} title={truyen.title} /></div>
        </div>
      </section>

      <div className="container pb-6 sm:pb-10">
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 min-w-0 space-y-4">

          {/* === GIỚI THIỆU === */}
          <div className="card p-4 sm:p-6">
            <h2 className="text-sm font-bold uppercase text-muted tracking-wide mb-2.5">Giới thiệu</h2>
            <div className="text-[15px] text-foreground/90 leading-relaxed whitespace-pre-line">{truyen.description}</div>
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
                  <Link key={ch.id} href={`/truyen/${truyen.slug}/${ch.chapterNumber}`} data-ch={ch.chapterNumber}
                    className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-md border border-transparent hover:border-border hover:bg-surface-2 transition-all group">
                    <span data-ch-title className="text-sm text-foreground group-hover:text-primary line-clamp-1 flex-1 min-w-0 flex items-center">
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
    </>
  )
}
