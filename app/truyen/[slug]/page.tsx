import Link from 'next/link'
import Image from 'next/image'
import Breadcrumb from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'
import FavoriteButton from '@/components/FavoriteButton'
import FollowButton from '@/components/FollowButton'
import ShareButtons from '@/components/ShareButtons'
import CommentSection from '@/components/CommentSection'
import RatingWidget from '@/components/RatingWidget'
import RelatedTruyen from '@/components/RelatedTruyen'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Chapter from '@/models/Chapter'

const CHAPTERS_PER_PAGE = 50

interface ChapterData {
  id: string
  chapterNumber: number
  title: string
  createdAt: string
}

interface TruyenDetail {
  id: string
  title: string
  slug: string
  author: string
  coverImage?: string
  description: string
  genres: string[]
  status: 'ongoing' | 'completed' | 'paused'
  views: number
  rating: number
  reviewCount: number
  totalChapters: number
  isHot: boolean
  isFull: boolean
  chapters: ChapterData[]
  totalChapterPages: number
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
      .sort({ chapterNumber: 1 })
      .skip(skip)
      .limit(CHAPTERS_PER_PAGE)
      .select('chapterNumber title createdAt')
      .lean() as any[]

    return {
      id: truyen._id.toString(),
      title: truyen.title,
      slug: truyen.slug,
      author: truyen.author,
      coverImage: truyen.coverImage,
      description: truyen.description,
      genres: truyen.genres,
      status: truyen.status,
      views: truyen.views,
      rating: truyen.rating,
      reviewCount: truyen.reviewCount,
      totalChapters: truyen.totalChapters,
      isHot: truyen.isHot,
      isFull: truyen.isFull,
      chapters: chapters.map((ch: any) => ({
        id: ch._id.toString(),
        chapterNumber: ch.chapterNumber,
        title: ch.title,
        createdAt: (ch.createdAt as Date).toISOString(),
      })),
      totalChapterPages,
    }
  } catch (error) {
    console.error('Error fetching truyen detail:', error)
    return null
  }
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { slug } = await params
  const truyen = await getTruyenDetail(slug, 1)
  if (!truyen) return { title: 'Không tìm thấy' }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  return {
    title: `${truyen.title} - ${truyen.author} | Đọc Truyện Online`,
    description: `Đọc ${truyen.title} của tác giả ${truyen.author}. ${truyen.totalChapters} chương. ${truyen.description.slice(0, 120)}...`,
    openGraph: {
      title: truyen.title,
      description: truyen.description.slice(0, 200),
      images: truyen.coverImage ? [{ url: truyen.coverImage, width: 300, height: 450 }] : [],
      url: `${baseUrl}/truyen/${truyen.slug}`,
      type: 'article',
    },
  }
}

export default async function TruyenDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { chapterPage: chapterPageStr = '1' } = await searchParams
  const chapterPage = Math.max(1, parseInt(chapterPageStr) || 1)

  const truyen = await getTruyenDetail(slug, chapterPage)
  if (!truyen) notFound()

  const latestChapterNumber = truyen.totalChapters || 1

  const statusLabel = truyen.status === 'completed' ? 'Hoàn thành' : 'Đang cập nhật'
  const statusColor = truyen.status === 'completed'
    ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#A5D6A7]'
    : 'bg-[#FFF3E0] text-[#E65100] border border-[#FFCC80]'

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <Breadcrumb items={[{ label: truyen.title }]} />

      <div className="flex flex-col lg:flex-row gap-5 mt-4">

        {/* ============ MAIN CONTENT ============ */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* === CARD THÔNG TIN TRUYỆN === */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-sm p-5 sm:p-6">
            <div className="flex flex-col md:flex-row gap-5">

              {/* Bìa truyện */}
              <div className="flex-shrink-0 w-full md:w-44">
                <div className="book-cover bg-[#E8E4DC] max-w-[180px] mx-auto md:mx-0">
                  {truyen.coverImage ? (
                    <Image
                      src={truyen.coverImage}
                      alt={truyen.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 180px, 176px"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Thông tin */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1C1C] leading-tight mb-4">
                  {truyen.title}
                </h1>

                {/* Meta */}
                <div className="space-y-2 text-sm mb-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[#888] w-[88px] flex-shrink-0">Tác giả:</span>
                    <Link
                      href={`/tac-gia/${encodeURIComponent(truyen.author)}`}
                      className="font-semibold text-[#1C1C1C] hover:text-[#C0392B] transition-colors"
                    >
                      {truyen.author}
                    </Link>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-[#888] w-[88px] flex-shrink-0 pt-0.5">Thể loại:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {truyen.genres.map((genre) => (
                        <Link
                          key={genre}
                          href={`/the-loai/${genre.toLowerCase().replace(/\s+/g, '-')}`}
                          className="inline-flex items-center px-2.5 py-0.5 bg-[#F3F1EE] border border-[#E5E0D8] text-[#555] rounded text-xs font-medium hover:bg-[#C0392B] hover:border-[#C0392B] hover:text-white transition-colors"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#888] w-[88px] flex-shrink-0">Trạng thái:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#888] w-[88px] flex-shrink-0">Đánh giá:</span>
                    <span className="font-semibold text-[#1C1C1C]">
                      ⭐ {Number(truyen.rating).toFixed(1)}/10
                    </span>
                    <span className="text-[#AAA] text-xs">({truyen.reviewCount.toLocaleString()})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#888] w-[88px] flex-shrink-0">Lượt xem:</span>
                    <span className="font-semibold text-[#1C1C1C]">{truyen.views.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[#888] w-[88px] flex-shrink-0">Số chương:</span>
                    <span className="font-semibold text-[#1C1C1C]">{truyen.totalChapters} chương</span>
                  </div>
                </div>

                {/* Thống kê nhanh */}
                <div className="grid grid-cols-3 gap-3 mb-5 p-3 bg-[#F8F7F5] border border-[#E5E0D8] rounded-lg">
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#1C1C1C]">
                      {Number(truyen.rating).toFixed(1)}
                    </div>
                    <div className="text-[11px] text-[#888] mt-0.5">Đánh giá</div>
                  </div>
                  <div className="text-center border-x border-[#E5E0D8]">
                    <div className="text-xl font-bold text-[#1C1C1C]">
                      {truyen.views >= 1000000
                        ? `${(truyen.views / 1000000).toFixed(1)}M`
                        : truyen.views >= 1000
                          ? `${(truyen.views / 1000).toFixed(0)}K`
                          : truyen.views.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-[#888] mt-0.5">Lượt xem</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-[#1C1C1C]">{truyen.totalChapters}</div>
                    <div className="text-[11px] text-[#888] mt-0.5">Chương</div>
                  </div>
                </div>

                {/* === NÚT HÀNH ĐỘNG — Rõ ràng, phân cấp === */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Primary: Đọc từ đầu */}
                  <Link
                    href={`/truyen/${truyen.slug}/1`}
                    className="btn btn-primary justify-center py-2.5 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Đọc từ đầu
                  </Link>

                  {/* Secondary: Đọc tiếp */}
                  <Link
                    href={`/truyen/${truyen.slug}/${latestChapterNumber}`}
                    className="btn btn-secondary justify-center py-2.5 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Đọc tiếp
                  </Link>

                  {/* Tertiary: Yêu thích */}
                  <FavoriteButton truyenId={truyen.id} currentChapter={1} />

                  {/* Theo dõi */}
                  <FollowButton slug={truyen.slug} title={truyen.title} />
                </div>

                {/* Share */}
                <div className="pt-2">
                  <ShareButtons url={`/truyen/${truyen.slug}`} title={truyen.title} />
                </div>
              </div>
            </div>

            {/* Giới thiệu */}
            <div className="mt-5 pt-5 border-t border-[#EEE9E0]">
              <h2 className="text-sm font-bold uppercase text-[#888] tracking-wider mb-3">Giới thiệu</h2>
              <div className="text-sm text-[#555] leading-relaxed whitespace-pre-line">
                {truyen.description}
              </div>
            </div>
          </div>

          {/* === DANH SÁCH CHƯƠNG === */}
          <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-sm p-4 sm:p-5">
            <div className="title-list flex items-center justify-between">
              <span>Danh sách chương</span>
              {truyen.totalChapterPages > 1 && (
                <span className="text-xs font-normal text-[#888] normal-case tracking-normal">
                  Trang {chapterPage}/{truyen.totalChapterPages}
                </span>
              )}
            </div>

            {truyen.chapters.length === 0 ? (
              <div className="text-center py-8 text-[#AAA]">Chưa có chương nào.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                {truyen.chapters.map((chapter) => (
                  <Link
                    key={chapter.id}
                    href={`/truyen/${truyen.slug}/${chapter.chapterNumber}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded border border-transparent hover:border-[#E5E0D8] hover:bg-[#F8F7F5] transition-all group"
                  >
                    <span className="text-sm font-medium text-[#C0392B] group-hover:text-[#96281B] line-clamp-1 flex-1 min-w-0">
                      {/^ch(u|ươ)ng\s/i.test(chapter.title)
                        ? chapter.title
                        : `Chương ${chapter.chapterNumber}: ${chapter.title}`}
                    </span>
                    <span className="text-xs text-[#AAA] ml-3 flex-shrink-0">
                      {new Date(chapter.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {truyen.totalChapterPages > 1 && (
              <Pagination
                currentPage={chapterPage}
                totalPages={truyen.totalChapterPages}
                baseUrl={`/truyen/${truyen.slug}?`}
              />
            )}
          </div>

          {/* === BÌNH LUẬN === */}
          <CommentSection truyenId={truyen.id} />

          {/* === TRUYỆN ĐỀ XUẤT === */}
          <RelatedTruyen currentSlug={truyen.slug} genres={truyen.genres} />
        </div>

        {/* ============ SIDEBAR ============ */}
        <div className="lg:w-64 flex-shrink-0">
          {/* Rating widget */}
          <RatingWidget truyenId={truyen.id} />

          <div className="bg-white border border-[#E5E0D8] rounded-lg shadow-sm p-4">
            <div className="title-list">Truyện cùng tác giả</div>
            <div className="text-center py-6 text-sm text-[#AAA]">
              Đang cập nhật...
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
