import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'

export interface SidebarItem { id: string; title: string; slug: string; views?: number; rating?: number }

// 3 danh sách CÓ THẬT & khác nhau cho sidebar: xem nhiều / đánh giá cao / mới cập nhật.
export async function getSidebarData(): Promise<{
  topViews: SidebarItem[]
  topRating: SidebarItem[]
  topUpdated: SidebarItem[]
}> {
  try {
    await dbConnect()
    const [v, r, u] = await Promise.all([
      Truyen.find({}).sort({ views: -1 }).limit(8).select('title slug views').lean() as any,
      Truyen.find({ reviewCount: { $gt: 0 } }).sort({ rating: -1 }).limit(8).select('title slug rating').lean() as any,
      Truyen.find({}).sort({ updatedAt: -1 }).limit(8).select('title slug').lean() as any,
    ])
    const map = (arr: any[]): SidebarItem[] => arr.map((t) => ({
      id: t._id.toString(), title: t.title, slug: t.slug, views: t.views, rating: t.rating,
    }))
    return { topViews: map(v), topRating: map(r), topUpdated: map(u) }
  } catch {
    return { topViews: [], topRating: [], topUpdated: [] }
  }
}
