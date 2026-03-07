import TruyenCard from '@/components/TruyenCard'
import Breadcrumb from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'
import Sidebar from '@/components/Sidebar'
import SortDropdown from './SortDropdown'

interface PageProps {
  params: Promise<{ category: string }>
  searchParams: Promise<{ page?: string; sort?: string; order?: string }>
}

const categoryNames: Record<string, { title: string; filter: Record<string, string> }> = {
  'truyen-moi': {
    title: 'Truyện Mới Cập Nhật',
    filter: { sort: 'updatedAt', order: 'desc' },
  },
  'truyen-hot': {
    title: 'Truyện Hot',
    filter: { isHot: 'true', sort: 'views', order: 'desc' },
  },
  'truyen-full': {
    title: 'Truyện Đã Hoàn Thành',
    filter: { isFull: 'true', sort: 'updatedAt', order: 'desc' },
  },
  'truyen-tranh': {
    title: 'Truyện Tranh',
    filter: { genre: 'Truyện Tranh', sort: 'updatedAt', order: 'desc' },
  },
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = await params
  const { page = '1', sort, order } = await searchParams
  const currentPage = parseInt(page)

  const categoryInfo = categoryNames[category] || {
    title: 'Danh Sách Truyện',
    filter: {},
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // FIX #6: Sort dropdown giờ có tác dụng thực sự qua searchParams
  // Nếu user chọn sort, ghi đè filter mặc định của category
  const effectiveFilter = {
    ...categoryInfo.filter,
    ...(sort ? { sort, order: order || 'desc' } : {}),
  }

  const filterParams = new URLSearchParams({
    page,
    limit: '20',
    ...effectiveFilter,
  })

  // Fetch main content + sidebar data song song
  const [res, topAllTimeRes] = await Promise.all([
    fetch(`${baseUrl}/api/truyen?${filterParams.toString()}`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/truyen?limit=10&sort=views&order=desc`, { cache: 'no-store' }),
  ])

  let truyenData: { data: any[]; pagination: { pages: number } } = {
    data: [],
    pagination: { pages: 1 },
  }
  if (res.ok) {
    const json = await res.json()
    if (json.success) truyenData = json
  }

  // Sidebar data - Top All Time cho trang danh sách
  let topAllTime: { id: string; title: string; slug: string; views?: number; rating?: number }[] = []
  if (topAllTimeRes.ok) {
    const json = await topAllTimeRes.json()
    if (json.success) {
      topAllTime = json.data.map((t: any) => ({
        id: t._id,
        title: t.title,
        slug: t.slug,
        views: t.views,
        rating: t.rating,
      }))
    }
  }

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
    totalChapters: t.totalChapters,
    latestChapter: { number: t.totalChapters, title: `Chương ${t.totalChapters}` },
    updatedAt: formatTimeAgo(t.updatedAt),
  }))

  const totalPages = truyenData.pagination.pages

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <Breadcrumb items={[{ label: categoryInfo.title }]} />

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4 sm:mt-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="title-list flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm sm:text-base">
            <span className="font-bold">{categoryInfo.title.toUpperCase()}</span>
            {/* FIX #6: SortDropdown là Client Component, cập nhật URL khi chọn */}
            <SortDropdown category={category} currentSort={sort} currentOrder={order} />
          </div>

          {items.length === 0 ? (
            <div className="text-center py-12 text-[#888]">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-sm">Không tìm thấy truyện nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 sm:gap-6 my-6">
              {items.map((truyen) => (
                <TruyenCard key={truyen.id} {...truyen} />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            baseUrl={`/danh-sach/${category}`}
          />
        </div>

        {/* Sidebar - FIX: Truyền data thực cho sidebar trang danh sách */}
        <div className="lg:w-[300px] xl:w-[320px] flex-shrink-0">
          <Sidebar
            topDaily={topAllTime}
            topMonthly={topAllTime}
            topAllTime={topAllTime}
          />
        </div>
      </div>
    </div>
  )
}
