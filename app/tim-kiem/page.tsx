import TruyenList from '@/components/TruyenList'
import TruyenCard from '@/components/TruyenCard'
import Breadcrumb from '@/components/Breadcrumb'
import Pagination from '@/components/Pagination'
import Sidebar from '@/components/Sidebar'
import ViewToggle from './ViewToggle'
import EmptyState from '@/components/EmptyState'
import { getSidebarData } from '@/lib/sidebarData'

const GENRES = [
  'Tiên Hiệp', 'Kiếm Hiệp', 'Ngôn Tình', 'Đô Thị', 'Huyền Huyễn',
  'Xuyên Không', 'Trọng Sinh', 'Cung Đấu', 'Nữ Cường', 'Điền Văn',
  'Đam Mỹ', 'Bách Hợp', 'Hài Hước', 'Trinh Thám', 'Vòng Du', 'Linh Dị',
  'Hệ Thống', 'Khoa Huyễn', 'Quân Sự', 'Lịch Sử',
]

const SORT_OPTIONS = [
  { value: 'views', label: 'Lượt xem' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'updated', label: 'Cập nhật gần đây' },
  { value: 'chapters', label: 'Nhiều chương nhất' },
]

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string; view?: string; genre?: string; status?: string; sort?: string }>
}

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 60) return `${minutes} phút trước`
  if (hours < 24) return `${hours} giờ trước`
  return `${days} ngày trước`
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = '', page = '1', view = 'grid', genre = '', status = '', sort = 'views' } = await searchParams
  const currentPage = parseInt(page)
  const sidebar = await getSidebarData()

  let results: any[] = []
  let totalPages = 0
  let totalResults = 0

  const hasFilters = q.trim() || genre || status
  if (hasFilters) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const params = new URLSearchParams({
        page,
        limit: '20',
        sort,
        ...(q.trim() && { q: q.trim() }),
        ...(genre && { genre }),
        ...(status && { status }),
      })
      const res = await fetch(`${baseUrl}/api/search?${params}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          results = data.data.map((t: any) => ({
            id: t._id,
            title: t.title,
            slug: t.slug,
            author: t.author,
            genres: t.genres,
            isHot: t.isHot,
            isFull: t.isFull,
            isNew: t.isNew,
            coverImage: t.coverImage,
            views: t.views,
            totalChapters: t.totalChapters,
            latestChapter: { number: t.totalChapters, title: `Chương ${t.totalChapters}` },
            updatedAt: formatTimeAgo(t.updatedAt),
          }))
          totalPages = data.pagination.pages
          totalResults = data.pagination.total
        }
      }
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  const buildUrl = (params: Record<string, string>) => {
    const base = new URLSearchParams({ ...(q && { q }), ...(genre && { genre }), ...(status && { status }), sort, page: '1', ...params })
    return `/tim-kiem?${base}`
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <Breadcrumb items={[{ label: 'Tìm kiếm' }]} />

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Search Box */}
          <div className="card p-5 mb-5">
            <h2 className="text-base font-bold text-foreground mb-3">🔍 Tìm kiếm truyện</h2>
            <form action="/tim-kiem" method="GET" className="flex gap-2">
              <input type="hidden" name="genre" value={genre} />
              <input type="hidden" name="status" value={status} />
              <input type="hidden" name="sort" value={sort} />
              <input type="hidden" name="view" value={view} />
              <input
                type="search"
                name="q"
                defaultValue={q}
                placeholder="Nhập tên truyện, tác giả..."
                className="form-control flex-1"
              />
              <button type="submit" className="btn btn-primary px-4 py-2">
                <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            {/* Bộ lọc nhanh */}
            <div className="mt-4 space-y-3">
              {/* Thể loại */}
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Thể loại</p>
                <div className="flex flex-wrap gap-1.5">
                  <a href={buildUrl({ genre: '' })}
                    className={`px-2.5 py-1 text-xs rounded-full border transition-all ${!genre ? 'bg-primary text-primary-fg border-primary' : 'border-border text-foreground/90 hover:border-primary hover:text-primary'}`}>
                    Tất cả
                  </a>
                  {GENRES.map(g => (
                    <a key={g} href={buildUrl({ genre: g })}
                      className={`px-2.5 py-1 text-xs rounded-full border transition-all ${genre === g ? 'bg-primary text-primary-fg border-primary' : 'border-border text-foreground/90 hover:border-primary hover:text-primary'}`}>
                      {g}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {/* Trạng thái */}
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Trạng thái</p>
                  <div className="flex gap-2">
                    {[{ v: '', l: 'Tất cả' }, { v: 'ongoing', l: 'Đang ra' }, { v: 'full', l: 'Hoàn thành' }].map(({ v, l }) => (
                      <a key={v} href={buildUrl({ status: v })}
                        className={`px-3 py-1 text-xs rounded-lg border transition-all ${status === v ? 'bg-primary text-primary-fg border-primary' : 'border-border text-foreground/90 hover:border-primary hover:text-primary'}`}>
                        {l}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Sắp xếp */}
                <div>
                  <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Sắp xếp</p>
                  <div className="flex gap-2 flex-wrap">
                    {SORT_OPTIONS.map(({ value, label }) => (
                      <a key={value} href={buildUrl({ sort: value })}
                        className={`px-3 py-1 text-xs rounded-lg border transition-all ${sort === value ? 'bg-primary text-primary-fg border-primary' : 'border-border text-foreground/90 hover:border-primary hover:text-primary'}`}>
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          {hasFilters ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-foreground/90">
                  {q && <span>Từ khoá: <strong className="text-foreground">&quot;{q}&quot;</strong></span>}
                  {genre && <span className={q ? ' · ' : ''}><strong className="text-foreground">{genre}</strong></span>}
                  {' '}
                  {results.length > 0 && <span className="text-muted-2">({totalResults} kết quả)</span>}
                </div>
                <ViewToggle currentView={view} query={q} genre={genre} status={status} sort={sort} />
              </div>

              {results.length > 0 ? (
                <>
                  {view === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {results.map((truyen) => (
                        <TruyenCard key={truyen.id} {...truyen} />
                      ))}
                    </div>
                  ) : (
                    <TruyenList items={results} />
                  )}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    baseUrl={`/tim-kiem?q=${encodeURIComponent(q)}&genre=${encodeURIComponent(genre)}&status=${status}&sort=${sort}`}
                  />
                </>
              ) : (
                <div className="card">
                  <EmptyState title="Meo~ không tìm thấy truyện nào" hint="Thử đổi từ khoá hoặc bộ lọc khác xem sao nhé!" />
                </div>
              )}
            </>
          ) : (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="text-lg font-bold mb-2">Tìm kiếm truyện</h3>
              <p className="text-muted-2 text-sm">Nhập tên truyện, tác giả hoặc chọn thể loại bên trên</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-[27%]">
          <Sidebar {...sidebar} />
        </div>
      </div>
    </div>
  )
}
