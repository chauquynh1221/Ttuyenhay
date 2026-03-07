import Link from 'next/link'
import Image from 'next/image'

interface TruyenCardProps {
  id: string
  title: string
  slug: string
  coverImage?: string
  author?: string
  genres?: string[]
  isHot?: boolean
  isFull?: boolean
  isNew?: boolean
  views?: number
  latestChapter?: { number: number; title: string }
  updatedAt?: string
}

export default function TruyenCard({
  title, slug, coverImage, author, isHot, isFull, isNew, latestChapter, updatedAt
}: TruyenCardProps) {
  return (
    <Link href={`/truyen/${slug}`} className="group block">
      <div className="bg-white border border-[#E5E0D8] rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
        {/* Cover */}
        <div className="book-cover bg-[#E8E4DC] rounded-none" style={{ borderRadius: 0 }}>
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          )}

          {/* Overlay gradient từ dưới lên */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Badges — góc trên trái */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {isHot && <span className="label label-hot">HOT</span>}
            {isFull && <span className="label label-full">FULL</span>}
            {isNew && <span className="label label-new">MỚI</span>}
          </div>

          {/* Info overlay — góc dưới */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
            <h3 className="text-white font-semibold text-[13px] leading-tight line-clamp-2 mb-1.5 drop-shadow">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-white/80">
              {latestChapter && (
                <span className="bg-black/30 px-1.5 py-0.5 rounded">
                  C.{latestChapter.number}
                </span>
              )}
              {updatedAt && (
                <span suppressHydrationWarning>{updatedAt}</span>
              )}
            </div>
            {author && (
              <div className="text-[11px] text-white/60 mt-0.5 truncate">{author}</div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
