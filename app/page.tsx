import TruyenCard from '@/components/TruyenCard'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'

// Helper function to format time ago
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

function mapTruyenCard(t: any) {
  return {
    id: t._id.toString(),
    title: t.title,
    slug: t.slug,
    author: t.author,
    genres: t.genres,
    isHot: t.isHot,
    isFull: t.isFull,
    isNew: t.isNew,
    views: t.views,
    coverImage: t.coverImage,
    totalChapters: t.totalChapters,
    latestChapter: { number: t.totalChapters, title: `Chương ${t.totalChapters}` },
    updatedAt: formatTimeAgo(t.updatedAt),
  }
}

function mapTop(t: any) {
  return { id: t._id.toString(), title: t.title, slug: t.slug, views: t.views, rating: t.rating }
}

export const dynamic = 'force-dynamic'

export default async function Home() {
  await dbConnect()

  const [truyenHotRaw, truyenMoiRaw, truyenFullRaw, topDailyRaw, topMonthlyRaw, topAllTimeRaw] = await Promise.all([
    Truyen.find({ isHot: true }).sort({ views: -1 }).limit(8).lean(),
    Truyen.find({}).sort({ updatedAt: -1 }).limit(10).lean(),
    Truyen.find({ isFull: true }).sort({ updatedAt: -1 }).limit(10).lean(),
    Truyen.find({ updatedAt: { $gte: new Date(Date.now() - 7 * 86400000) } }).sort({ views: -1 }).limit(10).lean(),
    Truyen.find({ updatedAt: { $gte: new Date(Date.now() - 30 * 86400000) } }).sort({ views: -1 }).limit(10).lean(),
    Truyen.find({}).sort({ views: -1 }).limit(10).lean(),
  ])

  const truyenHot = truyenHotRaw.map(mapTruyenCard)
  const truyenMoi = truyenMoiRaw.map(mapTruyenCard)
  const truyenFull = truyenFullRaw.map(mapTruyenCard)
  const topDaily = topDailyRaw.map(mapTop)
  const topMonthly = topMonthlyRaw.map(mapTop)
  const topAllTime = topAllTimeRaw.map(mapTop)

  return (
    <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-6">
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Truyện Hot Section */}
          <section className="mb-6 sm:mb-8">
            <div className="title-list flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>🔥</span>
                <span>TRUYỆN HOT</span>
              </span>
              <Link href="/danh-sach/truyen-hot" className="text-xs sm:text-sm font-normal normal-case hover:underline hover:text-primary transition-colors">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 sm:gap-6">
              {truyenHot.map((truyen) => (
                <TruyenCard key={truyen.id} {...truyen} />
              ))}
            </div>
          </section>

          {/* Truyện Mới Cập Nhật Section */}
          <section className="mb-6 sm:mb-8">
            <div className="title-list flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>📚</span>
                <span>TRUYỆN MỚI CẬP NHẬT</span>
              </span>
              <Link href="/danh-sach/truyen-moi" className="text-xs sm:text-sm font-normal normal-case hover:underline hover:text-primary transition-colors">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 sm:gap-6">
              {truyenMoi.map((truyen) => (
                <TruyenCard key={truyen.id} {...truyen} />
              ))}
            </div>
          </section>

          {/* Truyện Đã Hoàn Thành Section */}
          <section className="mb-6 sm:mb-8">
            <div className="title-list flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>✅</span>
                <span>TRUYỆN ĐÃ HOÀN THÀNH</span>
              </span>
              <Link href="/danh-sach/truyen-full" className="text-xs sm:text-sm font-normal normal-case hover:underline hover:text-primary transition-colors">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-5 sm:gap-6">
              {truyenFull.map((truyen) => (
                <TruyenCard key={truyen.id} {...truyen} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] xl:w-[350px] flex-shrink-0">
          {/* FIX #3: Truyền 3 bộ data riêng biệt thay vì cùng 1 data */}
          <Sidebar
            topDaily={topDaily}
            topMonthly={topMonthly}
            topAllTime={topAllTime}
          />
        </aside>
      </div>
    </div>
  )
}
