import TruyenCard from '@/components/TruyenCard'
import Breadcrumb from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'
import Sidebar from '@/components/Sidebar'
import GenrePageClient from './GenrePage'
import dbConnect from '@/lib/mongodb'
import Genre from '@/models/Genre'
import { queryTruyen } from '@/lib/truyenQuery'
import { getSidebarData } from '@/lib/sidebarData'

interface PageProps {
  params: Promise<{ genre: string }>
  searchParams: Promise<{ page?: string; sort?: string }>
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${Math.max(1, minutes)} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  if (days < 30) return `${days} ngày trước`
  return `${Math.floor(days / 30)} tháng trước`
}

export default async function GenrePage({ params, searchParams }: PageProps) {
  const { genre: genreSlug } = await params
  const { page = '1', sort = 'updatedAt' } = await searchParams
  const currentPage = parseInt(page)

  // Fetch genre info from database
  await dbConnect()
  const genreDoc = await Genre.findOne({ slug: genreSlug }).lean() as any
  const genreName = genreDoc?.name || genreSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  // Query THẲNG DB (không tự fetch HTTP → chạy đúng trên Vercel + nhanh hơn)
  const sortParam = sort === 'rating' ? 'rating' : sort === 'views' ? 'views' : sort === 'createdAt' ? 'createdAt' : 'updatedAt'
  const truyenData = await queryTruyen({
    genre: genreName,
    page,
    limit: 20,
    sort: sortParam,
    order: 'desc',
  })

  const items = truyenData.data.map((t: any) => ({
    id: t._id,
    title: t.title,
    slug: t.slug,
    author: t.author,
    genres: t.genres,
    isHot: t.isHot,
    isFull: t.isFull,
    isNew: t.isNew,
    coverImage: t.coverImage,
    latestChapter: { number: t.totalChapters, title: `Chương ${t.totalChapters}` },
    updatedAt: formatTimeAgo(t.updatedAt),
  }))
  const totalPages = truyenData.pagination.pages
  const sidebar = await getSidebarData()

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <Breadcrumb items={[{ label: `Thể loại: ${genreName}` }]} />

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="title-list flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm sm:text-base">
            <span className="font-bold">THỂ LOẠI: {genreName.toUpperCase()}</span>
            <GenrePageClient genre={genreSlug} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 sm:gap-6 my-6">
            {items.map((truyen: any) => (
              <TruyenCard key={truyen.id} {...truyen} />
            ))}
          </div>
          {items.length === 0 && (
            <div className="text-center py-12 text-muted-2">Chưa có truyện nào trong thể loại này.</div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/the-loai/${genreSlug}`}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:w-[27%]">
          <Sidebar {...sidebar} />
        </div>
      </div>
    </div>
  )
}
