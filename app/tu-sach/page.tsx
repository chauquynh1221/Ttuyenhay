import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Follow from '@/models/Follow'
import BookshelfTabs from './BookshelfTabs'

function formatTimeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${Math.max(1, mins)} phút trước`
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 24) return `${hrs} giờ trước`
    const days = Math.floor(diff / 86400000)
    return `${days} ngày trước`
}

export default async function TuSachPage() {
    const currentUser = await getCurrentUser()
    if (!currentUser) redirect('/dang-nhap?redirect=/tu-sach')

    await dbConnect()

    const user = await User.findById(currentUser.userId)
        .populate({ path: 'bookmarks.truyenId', select: 'title slug coverImage totalChapters' })
        .populate({ path: 'readingHistory.truyenId', select: 'title slug coverImage totalChapters' })
        .lean()

    const bookmarks = ((user as any)?.bookmarks || [])
        .filter((b: any) => b.truyenId)
        .map((b: any) => ({
            id: b._id?.toString() || b.truyenId._id.toString(),
            title: b.truyenId.title,
            slug: b.truyenId.slug,
            coverImage: b.truyenId.coverImage,
            currentChapter: b.currentChapter || 1,
        }))

    const history = [...((user as any)?.readingHistory || [])].reverse()
        .filter((h: any) => h.truyenId)
        .slice(0, 50)
        .map((h: any) => ({
            id: h._id?.toString() || h.truyenId._id.toString(),
            title: h.truyenId.title,
            slug: h.truyenId.slug,
            coverImage: h.truyenId.coverImage,
            timeAgo: formatTimeAgo(h.readAt),
        }))

    const followDocs = await Follow.find({ userId: currentUser.userId }).sort({ createdAt: -1 }).lean() as any[]
    const follows = followDocs.map((f) => ({
        id: f._id.toString(),
        title: f.truyenTitle,
        slug: f.truyenSlug,
        coverImage: f.truyenCover,
    }))

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-primary-fg font-bold">
                    {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-xl font-bold text-foreground">Tủ sách của {currentUser.name}</h1>
                    <p className="text-sm text-muted">{currentUser.email}</p>
                </div>
            </div>

            <BookshelfTabs bookmarks={bookmarks} follows={follows} history={history} />
        </div>
    )
}
