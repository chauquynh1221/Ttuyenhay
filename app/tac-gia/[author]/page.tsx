import dbConnect from '@/lib/mongodb'
import Truyen from '@/models/Truyen'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

interface PageProps {
    params: Promise<{ author: string }>
}

export async function generateMetadata({ params }: PageProps) {
    const { author } = await params
    const name = decodeURIComponent(author)
    return {
        title: `Tác giả ${name} | Đọc Truyện Online`,
        description: `Tất cả tác phẩm của tác giả ${name}`,
    }
}

export default async function TacGiaPage({ params }: PageProps) {
    await dbConnect()
    const { author } = await params
    const authorName = decodeURIComponent(author)

    const truyenList = await Truyen.find({
        author: { $regex: new RegExp(`^${authorName}$`, 'i') }
    })
        .sort({ createdAt: -1 })
        .select('title slug coverImage totalChapters status views rating genres createdAt')
        .lean()

    if (truyenList.length === 0) notFound()

    const totalViews = truyenList.reduce((acc: number, t: any) => acc + (t.views || 0), 0)
    const avgRating = truyenList.filter((t: any) => t.rating > 0).reduce((acc: number, t: any, _: any, arr: any[]) => acc + t.rating / arr.length, 0)

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            {/* Author header */}
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 mb-6 flex gap-5 items-start">
                <div className="w-16 h-16 bg-[#C0392B] rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {authorName.charAt(0)}
                </div>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-[#1C1C1C] mb-1">{authorName}</h1>
                    <p className="text-sm text-[#888]">Tác giả</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                        <div className="text-center">
                            <div className="font-bold text-[#1C1C1C]">{truyenList.length}</div>
                            <div className="text-[#AAA] text-xs">Tác phẩm</div>
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-[#1C1C1C]">
                                {totalViews >= 1000000 ? `${(totalViews / 1000000).toFixed(1)}M` : totalViews >= 1000 ? `${(totalViews / 1000).toFixed(0)}K` : totalViews}
                            </div>
                            <div className="text-[#AAA] text-xs">Lượt xem</div>
                        </div>
                        {avgRating > 0 && (
                            <div className="text-center">
                                <div className="font-bold text-[#1C1C1C]">⭐ {avgRating.toFixed(1)}</div>
                                <div className="text-[#AAA] text-xs">Đánh giá TB</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Truyen list */}
            <h2 className="text-base font-bold text-[#1C1C1C] mb-4">Tất cả tác phẩm ({truyenList.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {truyenList.map((truyen: any) => {
                    const status = truyen.status === 'completed'
                    return (
                        <Link key={truyen._id?.toString()} href={`/truyen/${truyen.slug}`}
                            className="bg-white border border-[#E5E0D8] rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                            <div className="relative aspect-[2/3] bg-[#F3F1EE]">
                                {truyen.coverImage && (
                                    <Image src={truyen.coverImage} alt={truyen.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, 20vw" />
                                )}
                                <div className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${status ? 'bg-green-500 text-white' : 'bg-orange-400 text-white'}`}>
                                    {status ? 'Full' : 'Đang ra'}
                                </div>
                            </div>
                            <div className="p-2">
                                <p className="text-[13px] font-semibold text-[#1C1C1C] line-clamp-2 leading-snug group-hover:text-[#C0392B] transition-colors">
                                    {truyen.title}
                                </p>
                                <p className="text-[11px] text-[#AAA] mt-0.5">{truyen.totalChapters} chương</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
