import Link from 'next/link'
import Cover from './Cover'
import { Star, Play, Sparkle } from './icons'

interface Item {
  id: string
  title: string
  slug: string
  author?: string
  coverImage?: string
  rating?: number
  description?: string
}

function Tile({ t, big = false }: { t: Item; big?: boolean }) {
  return (
    <Link
      href={`/truyen/${t.slug}`}
      className={`group relative overflow-hidden rounded-2xl border border-border shadow-card
                  ${big ? 'col-span-2 md:row-span-2 min-h-[220px] md:min-h-0' : 'min-h-[150px]'}`}
    >
      <Cover src={t.coverImage} title={t.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
      <div className={`absolute inset-x-0 bottom-0 ${big ? 'p-4 sm:p-5' : 'p-3'} text-white`}>
        {big && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 mb-2 rounded-full bg-primary text-primary-fg text-[10px] font-bold uppercase tracking-wide">
            <Sparkle className="w-3 h-3" /> Tuyển chọn
          </span>
        )}
        <h3 className={`font-extrabold leading-tight line-clamp-2 group-hover:text-primary-fg/90 ${big ? 'text-lg sm:text-2xl font-display' : 'text-[13px]'}`}>
          {t.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          {t.rating ? (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-yellow-300">
              <Star filled className="w-3 h-3" />{t.rating.toFixed(1)}
            </span>
          ) : null}
          {big && t.author && <span className="text-[11px] text-white/70">{t.author}</span>}
        </div>
        {big && (
          <span className="inline-flex items-center gap-1.5 mt-3 px-3.5 h-9 rounded-full bg-primary text-primary-fg text-sm font-bold group-hover:opacity-90">
            <Play className="w-4 h-4" /> Đọc ngay
          </span>
        )}
      </div>
    </Link>
  )
}

export default function FeaturedBento({ items }: { items: Item[] }) {
  if (!items || items.length < 5) return null
  const [big, ...rest] = items
  const smalls = rest.slice(0, 4)
  return (
    <section className="mb-9">
      <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-extrabold text-foreground mb-3.5">
        <span className="grid place-items-center w-9 h-9 rounded-2xl bg-primary-soft text-primary"><Sparkle className="w-5 h-5" /></span>
        Tuyển chọn tuần này
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:auto-rows-[152px]">
        <Tile t={big} big />
        {smalls.map((t) => <Tile key={t.id} t={t} />)}
      </div>
    </section>
  )
}
