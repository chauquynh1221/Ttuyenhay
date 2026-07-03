import Link from 'next/link'
import { Fire, TrendingUp, Crown } from './icons'

interface TruyenItem {
  id: string
  title: string
  slug: string
  views?: number
  rating?: number
}

interface SidebarProps {
  topViews?: TruyenItem[]
  topRating?: TruyenItem[]
  topUpdated?: TruyenItem[]
}

function RankBadge({ n }: { n: number }) {
  const top = n <= 3
  const bg = ['bg-primary', 'bg-[#D35400]', 'bg-[#C9A227]'][n - 1] || 'bg-surface-3'
  return (
    <span className={`grid place-items-center w-6 h-6 rounded-md text-[12px] font-bold flex-shrink-0 ${top ? `${bg} text-white` : 'text-muted-2'}`}>
      {n}
    </span>
  )
}

function TopList({ items, showRating }: { items: TruyenItem[]; showRating?: boolean }) {
  if (items.length === 0) {
    return <div className="px-4 py-5 text-center text-sm text-muted-2">Đang cập nhật...</div>
  }
  return (
    <div className="divide-y divide-border">
      {items.map((t, i) => (
        <div key={t.id} className="flex items-start gap-2.5 px-3.5 py-2.5 hover:bg-surface-2 transition-colors">
          <RankBadge n={i + 1} />
          <div className="flex-1 min-w-0">
            <Link href={`/truyen/${t.slug}`} className="block text-[13px] font-medium text-foreground hover:text-primary line-clamp-2 leading-snug transition-colors">
              {t.title}
            </Link>
            {showRating && t.rating ? (
              <div className="text-[11px] text-muted-2 mt-0.5">⭐ {t.rating.toFixed(1)}/10</div>
            ) : t.views ? (
              <div className="text-[11px] text-muted-2 mt-0.5">{t.views.toLocaleString('vi-VN')} lượt xem</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

function SidebarBox({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 py-3 border-b border-border bg-surface-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="text-[13px] font-bold uppercase tracking-wide text-foreground">{title}</span>
      </div>
      {children}
    </div>
  )
}

export default function Sidebar({ topViews = [], topRating = [], topUpdated = [] }: SidebarProps) {
  return (
    <div className="space-y-4 lg:sticky lg:top-32">
      <SidebarBox title="Xem nhiều nhất" icon={Fire}><TopList items={topViews} /></SidebarBox>
      <SidebarBox title="Đánh giá cao" icon={Crown}><TopList items={topRating} showRating /></SidebarBox>
      <SidebarBox title="Mới cập nhật" icon={TrendingUp}><TopList items={topUpdated} /></SidebarBox>
    </div>
  )
}
