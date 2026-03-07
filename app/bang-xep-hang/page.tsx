import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
    title: 'Bảng Xếp Hạng Truyện | Đọc Truyện Online',
    description: 'Top truyện được đọc nhiều nhất ngày, tuần, tháng và tất cả thời gian.',
}

async function getRankings() {
    await dbConnect()

    const [topViews, topRating, topNew, topCompleted] = await Promise.all([
        Truyen.find({}).sort({ views: -1 }).limit(20)
            .select('title slug coverImage author views rating totalChapters status genres')
            .lean(),
        Truyen.find({ reviewCount: { $gt: 0 } }).sort({ rating: -1, reviewCount: -1 }).limit(20)
            .select('title slug coverImage author views rating reviewCount totalChapters genres')
            .lean(),
        Truyen.find({}).sort({ createdAt: -1 }).limit(20)
            .select('title slug coverImage author createdAt totalChapters genres')
            .lean(),
        Truyen.find({ status: 'completed' }).sort({ views: -1 }).limit(20)
            .select('title slug coverImage author views totalChapters genres')
            .lean(),
    ])

    return { topViews, topRating, topNew, topCompleted }
}

function RankCard({ truyen, rank, meta }: { truyen: any; rank: number; meta?: string }) {
    const rankColor = rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : rank === 3 ? 'bg-amber-600' : 'bg-[#DDD] text-[#666]'

    return (
        <Link href={`/truyen/${truyen.slug}`} className="flex gap-3 items-start p-3 hover:bg-[#F8F7F5] rounded-lg transition-colors group">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white ${rankColor}`}>
                {rank}
            </div>
            <div className="w-12 h-16 bg-[#E5E0D8] rounded flex-shrink-0 overflow-hidden relative">
                {truyen.coverImage && (
                    <Image src={truyen.coverImage} alt={truyen.title} fill className="object-cover" sizes="48px" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1C1C1C] group-hover:text-[#C0392B] transition-colors line-clamp-2 leading-snug">
                    {truyen.title}
                </p>
                <p className="text-xs text-[#888] mt-0.5">{truyen.author}</p>
                <p className="text-xs text-[#AAA] mt-0.5">{meta}</p>
            </div>
        </Link>
    )
}

function formatViews(v: number) {
    if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M lượt xem`
    if (v >= 1000) return `${(v / 1000).toFixed(0)}K lượt xem`
    return `${v} lượt xem`
}

export default async function BangXepHangPage() {
    const { topViews, topRating, topNew, topCompleted } = await getRankings()

    const tabs = [
        { id: 'views', label: '🔥 Lượt xem', data: topViews, meta: (t: any) => formatViews(t.views) },
        { id: 'rating', label: '⭐ Điểm cao', data: topRating, meta: (t: any) => `${Number(t.rating).toFixed(1)}/10 (${t.reviewCount} đánh giá)` },
        { id: 'new', label: '🆕 Mới nhất', data: topNew, meta: (t: any) => `${t.totalChapters} chương` },
        { id: 'completed', label: '✅ Hoàn thành', data: topCompleted, meta: (t: any) => formatViews(t.views) },
    ]

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1C1C1C]">🏆 Bảng Xếp Hạng</h1>
                <p className="text-sm text-[#888] mt-1">Top truyện được yêu thích nhất</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tabs.map((tab) => (
                    <div key={tab.id} className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#E5E0D8] bg-[#F8F7F5]">
                            <h2 className="font-bold text-[#1C1C1C]">{tab.label}</h2>
                        </div>
                        <div className="divide-y divide-[#F3F1EE]">
                            {tab.data.slice(0, 10).map((truyen: any, idx) => (
                                <RankCard
                                    key={truyen._id?.toString()}
                                    truyen={truyen}
                                    rank={idx + 1}
                                    meta={tab.meta(truyen)}
                                />
                            ))}
                            {tab.data.length === 0 && (
                                <p className="text-center text-[#AAA] text-sm py-8">Chưa có dữ liệu</p>
                            )}
                        </div>
                        {tab.data.length > 10 && (
                            <div className="px-4 py-3 border-t border-[#E5E0D8]">
                                <div className="divide-y divide-[#F3F1EE]">
                                    {tab.data.slice(10, 20).map((truyen: any, idx) => (
                                        <RankCard key={truyen._id?.toString()} truyen={truyen} rank={idx + 11} meta={tab.meta(truyen)} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
