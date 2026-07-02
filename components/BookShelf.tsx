import Link from 'next/link'
import TruyenCard from './TruyenCard'
import { ChevronRight } from './icons'

// Kệ sách cuộn ngang — tiêu đề editorial: overline nhỏ + serif lớn.
export default function BookShelf({
  title, href, items, overline,
}: {
  title: string
  href: string
  items: any[]
  overline?: string
}) {
  if (!items || items.length === 0) return null
  return (
    <section className="mb-10 sm:mb-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          {overline && <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-1.5">{overline}</p>}
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">{title}</h2>
        </div>
        <Link href={href} className="flex items-center gap-0.5 text-sm font-semibold text-muted hover:text-primary transition-colors flex-shrink-0 pb-1">
          Tất cả <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 sm:-mx-1 sm:px-1 snap-x">
        {items.map((t) => (
          <div key={t.id} className="flex-shrink-0 w-[138px] sm:w-[164px] snap-start">
            <TruyenCard {...t} />
          </div>
        ))}
      </div>
    </section>
  )
}
