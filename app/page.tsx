import TruyenCard from '@/components/TruyenCard'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

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

// Fetch data from API
async function fetchTruyenHot() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/truyen?isHot=true&limit=8&sort=-views`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data.map((t: any) => ({
      id: t._id,
      title: t.title,
      slug: t.slug,
      author: t.author,
      genres: t.genres,
      isHot: t.isHot,
      isFull: t.isFull,
      isNew: t.isNew,
      views: t.views,
      coverImage: t.coverImage,
      latestChapter: { number: t.totalChapters, title: `Chương ${t.totalChapters}` },
      updatedAt: formatTimeAgo(t.updatedAt)
    }))
  } catch (error) {
    console.error('Error fetching truyen hot:', error)
    return []
  }
}

async function fetchTruyenMoi() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/truyen?limit=10&sort=-updatedAt`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data.map((t: any) => ({
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
      updatedAt: formatTimeAgo(t.updatedAt)
    }))
  } catch (error) {
    console.error('Error fetching truyen moi:', error)
    return []
  }
}

async function fetchTruyenFull() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/truyen?isFull=true&limit=10&sort=-updatedAt`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.data.map((t: any) => ({
      id: t._id,
      title: t.title,
      slug: t.slug,
      author: t.author,
      genres: t.genres,
      isFull: t.isFull,
      coverImage: t.coverImage,
      totalChapters: t.totalChapters,
      latestChapter: { number: t.totalChapters, title: `Chương ${t.totalChapters}` },
      updatedAt: formatTimeAgo(t.updatedAt)
    }))
  } catch (error) {
    console.error('Error fetching truyen full:', error)
    return []
  }
}

// FIX #3: Fetch 3 bộ data riêng biệt cho từng tab trong Sidebar
// - Top Ngày: cập nhật trong 24h qua, sort theo views
// - Top Tháng: cập nhật trong 30 ngày, sort theo views  
// - Top All Time: sort theo views toàn thời gian
async function fetchTopDaily() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    // Lấy truyen được cập nhật trong 7 ngày để có đủ data, sort theo views
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const res = await fetch(
      `${baseUrl}/api/truyen?limit=10&sort=views&order=desc&since=${since}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.data.map((t: any) => ({
      id: t._id, title: t.title, slug: t.slug, views: t.views, rating: t.rating
    }))
  } catch {
    return []
  }
}

async function fetchTopMonthly() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    // Lấy truyen được cập nhật trong 30 ngày, sort theo views
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const res = await fetch(
      `${baseUrl}/api/truyen?limit=10&sort=views&order=desc&since=${since}`,
      { cache: 'no-store' }
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.data.map((t: any) => ({
      id: t._id, title: t.title, slug: t.slug, views: t.views, rating: t.rating
    }))
  } catch {
    return []
  }
}

export default async function Home() {
  const [truyenHot, truyenMoi, truyenFull, topDaily, topMonthly, topAllTime] = await Promise.all([
    fetchTruyenHot(),
    fetchTruyenMoi(),
    fetchTruyenFull(),
    fetchTopDaily(),
    fetchTopMonthly(),
    // Top All Time: gọi thẳng không filter thời gian - sort views toàn thời gian
    (async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const res = await fetch(`${baseUrl}/api/truyen?limit=10&sort=views&order=desc`, { cache: 'no-store' })
        if (!res.ok) return []
        const data = await res.json()
        return data.data.map((t: any) => ({ id: t._id, title: t.title, slug: t.slug, views: t.views, rating: t.rating }))
      } catch { return [] }
    })()
  ])
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
