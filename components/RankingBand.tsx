import Link from 'next/link'
import Cover from './Cover'
import { Crown, Star } from './icons'

interface RItem { id: string; title: string; slug: string; coverImage?: string; rating?: number; views?: number }

function fmtViews(v?: number) {
  if (!v) return null
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1000) return `${Math.round(v / 1000)}K`
  return String(v)
}

// "Top 10" kiểu Netflix: số thứ hạng khổng lồ viền amber chồng sau bìa, rail cuộn ngang.
export default function RankingBand({ items }: { items: RItem[] }) {
  if (!items || items.length === 0) return null
  const top = items.slice(0, 10)

  return (
    <section className="mb-10 sm:mb-12">
      <div className="mb-5">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-1.5">
          <Crown className="w-4 h-4" /> Bảng xếp hạng
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">Đọc nhiều nhất</h2>
      </div>

      <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:-mx-1 sm:px-1 snap-x">
        {top.map((t, i) => (
          <Link key={t.id} href={`/truyen/${t.slug}`} className="group flex-shrink-0 snap-start">
            <div className="flex items-end">
              {/* Số thứ hạng khổng lồ — nằm sau bìa */}
              <span className="rank-outline relative z-0 text-[84px] sm:text-[112px] translate-x-3.5 sm:translate-x-5 translate-y-2">
                {i + 1}
              </span>
              <div className="relative z-10 w-[108px] sm:w-[132px]">
                <div className="book-cover shadow-card ring-1 ring-white/5 group-hover:-translate-y-1.5 transition-transform duration-300">
                  <Cover src={t.coverImage} title={t.title} />
                  {t.rating ? (
                    <span className="absolute bottom-1.5 left-1.5 z-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[11px] font-semibold backdrop-blur-sm">
                      <Star filled className="w-3 h-3 text-[#F6B14E]" />{t.rating.toFixed(1)}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="mt-2.5 w-[150px] sm:w-[184px] pl-6 sm:pl-8">
              <h3 className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                {t.title}
              </h3>
              {fmtViews(t.views) && (
                <p className="mt-0.5 text-[11px] text-muted-2">{fmtViews(t.views)} lượt đọc</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
