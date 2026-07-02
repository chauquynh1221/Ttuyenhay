import Link from 'next/link'
import Cover from './Cover'
import { Star, Play } from './icons'

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
  rating?: number
  rank?: number
  latestChapter?: { number: number; title: string }
  updatedAt?: string
}

export default function TruyenCard({
  title, slug, coverImage, author, isHot, isFull, isNew, rating, rank, latestChapter, updatedAt,
}: TruyenCardProps) {
  return (
    <Link href={`/truyen/${slug}`} className="group block">
      <div className="card overflow-hidden h-full transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1">
        {/* Cover */}
        <div className="book-cover">
          <Cover src={coverImage} title={title} />

          {/* Hover overlay: gợi ý Đọc ngay */}
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 grid place-items-center">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-[#111] text-xs font-bold">
              <Play className="w-3.5 h-3.5" /> Đọc ngay
            </span>
          </div>

          {/* Rank badge */}
          {rank !== undefined && (
            <span className={`absolute top-2 left-2 z-10 grid place-items-center w-7 h-7 rounded-full text-xs font-bold text-white shadow
              ${rank === 1 ? 'bg-primary' : rank === 2 ? 'bg-[#D35400]' : rank === 3 ? 'bg-[#C9A227]' : 'bg-black/60'}`}>
              {rank}
            </span>
          )}

          {/* Badges (khi không có rank) */}
          {rank === undefined && (
            <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
              {isHot && <span className="label label-hot shadow-sm">HOT</span>}
              {isFull && <span className="label label-full shadow-sm">FULL</span>}
              {isNew && <span className="label label-new shadow-sm">MỚI</span>}
            </div>
          )}

          {/* Rating + chapter */}
          {rating ? (
            <span className="absolute bottom-2 left-2 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/65 text-white text-[11px] font-semibold backdrop-blur-sm">
              <Star filled className="w-3 h-3 text-yellow-400" />{rating.toFixed(1)}
            </span>
          ) : null}
          {latestChapter && (
            <span className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 rounded bg-black/65 text-white text-[11px] font-semibold backdrop-blur-sm">
              C.{latestChapter.number}
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-2.5">
          <h3 className="text-[13px] sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5em]">
            {title}
          </h3>
          <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-muted-2">
            {author ? <span className="truncate">{author}</span> : <span />}
            {updatedAt && <span className="flex-shrink-0 whitespace-nowrap" suppressHydrationWarning>{updatedAt}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
