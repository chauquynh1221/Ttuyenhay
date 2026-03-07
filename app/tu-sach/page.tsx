import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import Follow from '@/models/Follow'
import Link from 'next/link'
import Image from 'next/image'

export default async function TuSachPage() {
    const currentUser = await getCurrentUser()
    if (!currentUser) redirect('/dang-nhap')

    await dbConnect()

    const user = await User.findById(currentUser.userId)
        .populate({
            path: 'bookmarks.truyenId',
            select: 'title slug coverImage totalChapters',
        })
        .populate({
            path: 'readingHistory.truyenId',
            select: 'title slug coverImage totalChapters',
        })
        .lean()

    const bookmarks = ((user as any)?.bookmarks || []).filter((b: any) => b.truyenId)
    const history = [...((user as any)?.readingHistory || [])].reverse().filter((h: any) => h.truyenId)

    const follows = await Follow.find({ userId: currentUser.userId })
        .sort({ createdAt: -1 })
        .lean()

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#C0392B] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-xl font-bold text-[#1C1C1C]">Tủ sách của {currentUser.name}</h1>
                    <p className="text-sm text-[#888]">{currentUser.email}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-[#E5E0D8] mb-6 overflow-x-auto">
                <a href="#yeu-thich" className="px-4 py-2.5 text-sm font-semibold text-[#C0392B] border-b-2 border-[#C0392B] -mb-px whitespace-nowrap">
                    ❤️ Yêu thích ({bookmarks.length})
                </a>
                <a href="#theo-doi" className="px-4 py-2.5 text-sm font-medium text-[#666] hover:text-[#1C1C1C] transition-colors whitespace-nowrap">
                    🔔 Đang theo dõi ({follows.length})
                </a>
                <a href="#lich-su" className="px-4 py-2.5 text-sm font-medium text-[#666] hover:text-[#1C1C1C] transition-colors whitespace-nowrap">
                    🕐 Lịch sử đọc ({history.length})
                </a>
            </div>

            {/* Yêu thích */}
            <section id="yeu-thich" className="mb-10">
                <h2 className="text-base font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
                    ❤️ Truyện yêu thích
                    <span className="text-xs font-normal text-[#AAA]">({bookmarks.length} truyện)</span>
                </h2>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-[#E5E0D8]">
                        <div className="text-4xl mb-3">📚</div>
                        <p className="text-[#888] text-sm">Chưa có truyện yêu thích</p>
                        <Link href="/" className="inline-block mt-3 text-sm text-[#C0392B] hover:underline">
                            Khám phá truyện ngay →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {bookmarks.map((b: any) => {
                            const truyen = b.truyenId
                            return (
                                <div key={b._id?.toString()} className="bg-white border border-[#E5E0D8] rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                                    <Link href={`/truyen/${truyen.slug}`} className="block">
                                        <div className="relative aspect-[2/3] bg-[#F3F1EE]">
                                            {truyen.coverImage && (
                                                <Image
                                                    src={truyen.coverImage}
                                                    alt={truyen.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 640px) 50vw, 20vw"
                                                />
                                            )}
                                        </div>
                                        <div className="p-2">
                                            <p className="text-[13px] font-semibold text-[#1C1C1C] line-clamp-2 leading-snug">{truyen.title}</p>
                                            <p className="text-[11px] text-[#AAA] mt-0.5">
                                                Đang đọc: Chương {b.currentChapter}
                                            </p>
                                        </div>
                                    </Link>
                                    <div className="px-2 pb-2">
                                        <Link
                                            href={`/truyen/${truyen.slug}/${b.currentChapter}`}
                                            className="block w-full text-center py-1.5 text-xs bg-[#C0392B] text-white rounded-md hover:bg-[#96281B] transition-colors"
                                        >
                                            Đọc tiếp
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* Theo dõi */}
            <section id="theo-doi" className="mb-10">
                <h2 className="text-base font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
                    🔔 Truyện đang theo dõi
                    <span className="text-xs font-normal text-[#AAA]">({follows.length} truyện)</span>
                </h2>

                {follows.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-[#E5E0D8]">
                        <div className="text-4xl mb-3">🔔</div>
                        <p className="text-[#888] text-sm">Chưa theo dõi truyện nào</p>
                        <Link href="/" className="inline-block mt-3 text-sm text-[#C0392B] hover:underline">
                            Khám phá truyện ngay →
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden divide-y divide-[#EEE9E0]">
                        {follows.map((f: any) => (
                            <div key={f._id?.toString()} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F7F5] transition-colors">
                                <div className="w-10 h-14 bg-[#F3F1EE] rounded flex-shrink-0 overflow-hidden relative">
                                    {f.truyenCover && (
                                        <Image src={f.truyenCover} alt={f.truyenTitle} fill className="object-cover" sizes="40px" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/truyen/${f.truyenSlug}`} className="text-[14px] font-semibold text-[#1C1C1C] hover:text-[#C0392B] truncate block transition-colors">
                                        {f.truyenTitle}
                                    </Link>
                                    <p className="text-[12px] text-[#AAA]">Đang theo dõi</p>
                                </div>
                                <Link
                                    href={`/truyen/${f.truyenSlug}`}
                                    className="text-xs px-3 py-1.5 border border-[#E5E0D8] text-[#444] rounded-md hover:border-[#C0392B] hover:text-[#C0392B] transition-colors flex-shrink-0"
                                >
                                    Đọc
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Lịch sử */}
            <section id="lich-su">
                <h2 className="text-base font-bold text-[#1C1C1C] mb-4 flex items-center gap-2">
                    🕐 Lịch sử đọc
                    <span className="text-xs font-normal text-[#AAA]">(100 mục gần nhất)</span>
                </h2>

                {history.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-[#E5E0D8]">
                        <div className="text-4xl mb-3">📖</div>
                        <p className="text-[#888] text-sm">Chưa có lịch sử đọc</p>
                    </div>
                ) : (
                    <div className="bg-white border border-[#E5E0D8] rounded-xl overflow-hidden divide-y divide-[#EEE9E0]">
                        {history.slice(0, 30).map((h: any) => {
                            const truyen = h.truyenId
                            const readAt = new Date(h.readAt)
                            const timeAgo = formatTimeAgo(readAt)
                            return (
                                <div key={h._id?.toString()} className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8F7F5] transition-colors">
                                    <div className="w-10 h-14 bg-[#F3F1EE] rounded flex-shrink-0 overflow-hidden relative">
                                        {truyen.coverImage && (
                                            <Image src={truyen.coverImage} alt={truyen.title} fill className="object-cover" sizes="40px" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/truyen/${truyen.slug}`} className="text-[14px] font-semibold text-[#1C1C1C] hover:text-[#C0392B] truncate block transition-colors">
                                            {truyen.title}
                                        </Link>
                                        <p className="text-[12px] text-[#AAA]">{timeAgo}</p>
                                    </div>
                                    <Link
                                        href={`/truyen/${truyen.slug}`}
                                        className="text-xs px-3 py-1.5 border border-[#E5E0D8] text-[#444] rounded-md hover:border-[#C0392B] hover:text-[#C0392B] transition-colors flex-shrink-0"
                                    >
                                        Xem
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}

function formatTimeAgo(date: Date): string {
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins} phút trước`
    const hrs = Math.floor(diff / 3600000)
    if (hrs < 24) return `${hrs} giờ trước`
    const days = Math.floor(diff / 86400000)
    return `${days} ngày trước`
}
