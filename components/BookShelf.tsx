import Link from 'next/link'
import TruyenCard from './TruyenCard'

// Kệ sách cuộn ngang — thay cho lưới 4 cột "web truyện chuẩn".
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
  const badge = accent === 'accent' ? 'bg-accent-soft text-accent' : 'bg-primary-soft text-primary'
  return (
    <section className="mb-9">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="flex items-center gap-2.5 text-lg sm:text-xl font-extrabold text-foreground">
          <span className={`grid place-items-center w-9 h-9 rounded-2xl ${badge}`}>
            <Icon className="w-5 h-5" />
          </span>
          {title}
        </h2>
        <Link href={href} className="text-[13px] font-semibold text-primary hover:underline flex-shrink-0">
          Tất cả →
        </Link>
      </div>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1 snap-x">
        {items.map((t) => (
          <div key={t.id} className="flex-shrink-0 w-[132px] sm:w-[158px] snap-start">
            <TruyenCard {...t} />
          </div>
        ))}
      </div>
    </section>
  )
}
