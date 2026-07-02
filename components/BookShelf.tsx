import Link from 'next/link'
import TruyenCard from './TruyenCard'
import { ChevronRight } from './icons'

// Kệ sách cuộn ngang — tiêu đề display lớn kiểu cinematic.
export default function BookShelf({
  icon: Icon, title, href, items, accent = 'primary',
}: {
  icon: any
  title: string
  href: string
  items: any[]
  accent?: 'primary' | 'accent'
}) {
  if (!items || items.length === 0) return null
  const iconCls = accent === 'accent' ? 'text-accent' : 'text-primary'
  return (
    <section className="mb-10 sm:mb-12">
      <div className="flex items-end justify-between mb-4">
        <h2 className="flex items-center gap-2.5 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
          <Icon className={`w-6 h-6 ${iconCls}`} />
          {title}
        </h2>
        <Link href={href} className="flex items-center gap-0.5 text-sm font-semibold text-muted hover:text-primary transition-colors flex-shrink-0 pb-0.5">
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
