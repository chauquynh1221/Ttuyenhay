import Link from 'next/link'
import TruyenCard from './TruyenCard'

interface ITruyen {
    id: string
    title: string
    slug: string
    author: string
    genres: string[]
    isHot?: boolean
    isFull?: boolean
    coverImage: string
    views: number
    totalChapters: number
}

interface RelatedTruyenProps {
    currentSlug: string
    genres: string[]
}

async function fetchRelated(currentSlug: string, genres: string[]): Promise<ITruyen[]> {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        const genre = genres[0] || ''
        const res = await fetch(
            `${baseUrl}/api/truyen?genre=${encodeURIComponent(genre)}&limit=8&page=1`,
            { cache: 'no-store' }
        )
        if (!res.ok) return []
        const data = await res.json()
        const items: any[] = data.data || data.truyen || []
        return items
            .filter((t: any) => t.slug !== currentSlug)
            .slice(0, 6)
            .map((t: any) => ({
                id: t._id,
                title: t.title,
                slug: t.slug,
                author: t.author,
                genres: t.genres,
                isHot: t.isHot,
                isFull: t.isFull,
                coverImage: t.coverImage,
                views: t.views,
                totalChapters: t.totalChapters,
            }))
    } catch {
        return []
    }
}

export default async function RelatedTruyen({ currentSlug, genres }: RelatedTruyenProps) {
    const items = await fetchRelated(currentSlug, genres)
    if (items.length === 0) return null

    return (
        <section className="mt-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-[#1C1C1C] flex items-center gap-2">
                    📖 Có thể bạn cũng thích
                </h2>
                {genres[0] && (
                    <Link
                        href={`/the-loai/${encodeURIComponent(genres[0])}`}
                        className="text-xs text-[#C0392B] hover:underline"
                    >
                        Xem thêm {genres[0]} →
                    </Link>
                )}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {items.map(t => (
                    <TruyenCard key={t.id} {...t} />
                ))}
            </div>
        </section>
    )
}
