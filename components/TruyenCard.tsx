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

// Kiểu poster cinematic: bìa nổi trực tiếp trên nền trang (không hộp card),
// chữ đặt dưới bìa — giống Netflix/Webtoon thay vì "card trắng web truyện".
export default function TruyenCard({
  title, slug, coverImage, author, isHot, isFull, isNew, rating, rank, latestChapter, updatedAt,
}: TruyenCardProps) {
  return (
    <Link href={`/truyen/${slug}`} className="group block">
      {/* Cover */}
      <div className="book-cover shadow-card ring-1 ring-white/5 transition-all duration-300 group-hover:shadow-card-hover group-hover:-translate-y-1.5">
        <Cover src={coverImage} title={title} />

        {/* Hover overlay: gợi ý Đọc ngay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 grid place-items-center">
          <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-primary text-primary-fg text-xs font-bold">
            <Play className="w-3.5 h-3.5" /> Đọc ngay
          </span>
        </div>

        {/* Rank badge */}
        {rank !== undefined && (
          <span className={`absolute top-2 left-2 z-10 grid place-items-center w-7 h-7 rounded-md text-xs font-extrabold shadow
            ${rank === 1 ? 'bg-primary text-primary-fg' : rank === 2 ? 'bg-[#C6CDD8] text-[#1A1D24]' : rank === 3 ? 'bg-[#B3703E] text-white' : 'bg-black/60 text-white'}`}>
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
          <span className="absolute bottom-2 left-2 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[11px] font-semibold backdrop-blur-sm">
            <Star filled className="w-3 h-3 text-[#F6B14E]" />{rating.toFixed(1)}
          </span>
        ) : null}
        {latestChapter && (
          <span className="absolute bottom-2 right-2 z-10 px-1.5 py-0.5 rounded bg-black/70 text-white text-[11px] font-semibold backdrop-blur-sm">
            C.{latestChapter.number}
          </span>
        )}
      </div>

      {/* Text — dưới bìa, không hộp */}
      <div className="pt-2.5 px-0.5">
        <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors min-h-[2.6em]">
          {title}
        </h3>
        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-2">
          {author ? <span className="truncate">{author}</span> : <span />}
          {updatedAt && <span className="flex-shrink-0 whitespace-nowrap" suppressHydrationWarning>{updatedAt}</span>}
        </div>
      </div>
    </Link>
  )
}
