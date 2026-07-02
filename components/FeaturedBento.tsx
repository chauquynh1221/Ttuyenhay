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
      className={`group relative overflow-hidden rounded-lg ring-1 ring-white/10 shadow-card
                  ${big ? 'col-span-2 md:row-span-2 min-h-[240px] md:min-h-0' : 'min-h-[156px]'}`}
    >
      <Cover src={t.coverImage} title={t.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className={`absolute inset-x-0 bottom-0 ${big ? 'p-4 sm:p-6' : 'p-3'} text-white`}>
        {big && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 mb-2.5 rounded bg-primary text-primary-fg text-[10px] font-bold uppercase tracking-widest">
            <Sparkle className="w-3 h-3" /> Tuyển chọn
          </span>
        )}
        <h3 className={`leading-tight line-clamp-2 ${big ? 'text-xl sm:text-3xl font-display font-extrabold tracking-tight' : 'text-sm font-bold'}`}>
          {t.title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          {t.rating ? (
            <span className="flex items-center gap-0.5 text-[11px] font-semibold text-[#F6B14E]">
              <Star filled className="w-3 h-3" />{t.rating.toFixed(1)}
            </span>
          ) : null}
          {big && t.author && <span className="text-xs text-white/70">{t.author}</span>}
        </div>
        {big && (
          <span className="inline-flex items-center gap-1.5 mt-4 px-4 h-10 rounded-md bg-primary text-primary-fg text-sm font-bold group-hover:opacity-90 transition-opacity">
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
    <section className="mb-10 sm:mb-12">
      <div className="mb-5">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-1.5">
          <Sparkle className="w-4 h-4" /> Biên tập chọn
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">Tuyển chọn tuần này</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 md:auto-rows-[160px]">
        <Tile t={big} big />
        {smalls.map((t) => <Tile key={t.id} t={t} />)}
      </div>
    </section>
  )
}
