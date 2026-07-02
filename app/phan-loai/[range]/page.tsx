import TruyenCard from '@/components/TruyenCard'
import Breadcrumb from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'
import Sidebar from '@/components/Sidebar'
import { notFound } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'

export const revalidate = 600

const RANGES: Record<string, { title: string; filter: Record<string, any> }> = {
  'duoi-100-chuong': { title: 'Truyện dưới 100 chương', filter: { totalChapters: { $lt: 100 } } },
  '100-500-chuong': { title: 'Truyện 100 - 500 chương', filter: { totalChapters: { $gte: 100, $lte: 500 } } },
  '500-1000-chuong': { title: 'Truyện 500 - 1000 chương', filter: { totalChapters: { $gte: 500, $lte: 1000 } } },
  'tren-1000-chuong': { title: 'Truyện trên 1000 chương', filter: { totalChapters: { $gt: 1000 } } },
}

const PER_PAGE = 20

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (h < 24) return `${Math.max(1, h)} giờ trước`
  if (d < 30) return `${d} ngày trước`
  return `${Math.floor(d / 30)} tháng trước`
}

interface PageProps {
  params: Promise<{ range: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { range } = await params
  const info = RANGES[range]
  return { title: info ? info.title : 'Phân loại theo chương' }
}

export default async function PhanLoaiPage({ params, searchParams }: PageProps) {
  const { range } = await params
  const { page = '1' } = await searchParams
  const info = RANGES[range]
  if (!info) notFound()

  const currentPage = Math.max(1, parseInt(page) || 1)
  await dbConnect()

  const [docs, total, topRaw] = await Promise.all([
    Truyen.find(info.filter).sort({ updatedAt: -1 }).skip((currentPage - 1) * PER_PAGE).limit(PER_PAGE).lean(),
    Truyen.countDocuments(info.filter),
    Truyen.find({}).sort({ views: -1 }).limit(10).lean(),
  ])

  const items = (docs as any[]).map((t) => ({
    id: t._id.toString(), title: t.title, slug: t.slug, author: t.author, genres: t.genres,
    isHot: t.isHot, isFull: t.isFull, isNew: t.isNew, coverImage: t.coverImage, totalChapters: t.totalChapters,
    latestChapter: { number: t.totalChapters, title: `Chương ${t.totalChapters}` }, updatedAt: timeAgo(t.updatedAt),
  }))
  const topAllTime = (topRaw as any[]).map((t) => ({ id: t._id.toString(), title: t.title, slug: t.slug, views: t.views, rating: t.rating }))
  const totalPages = Math.ceil(total / PER_PAGE)

  return (
    <div className="container py-4 sm:py-6">
      <Breadcrumb items={[{ label: info.title }]} />
      <div className="flex flex-col lg:flex-row gap-6 mt-2">
        <div className="flex-1 min-w-0">
          <h1 className="text-base sm:text-lg font-bold uppercase tracking-wide text-foreground pl-3 border-l-[3px] border-primary mb-4">
            {info.title} <span className="text-muted font-normal normal-case">({total.toLocaleString('vi-VN')})</span>
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-12 text-muted">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-sm">Không tìm thấy truyện nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {items.map((t) => <TruyenCard key={t.id} {...t} />)}
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/phan-loai/${range}`} />
        </div>

        <aside className="w-full lg:w-[320px] flex-shrink-0">
          <Sidebar topDaily={topAllTime} topMonthly={topAllTime} topAllTime={topAllTime} />
        </aside>
      </div>
    </div>
  )
}
