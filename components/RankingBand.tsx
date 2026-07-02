import Link from 'next/link'
import Cover from './Cover'
import { Crown, Star } from './icons'

interface RItem { id: string; title: string; slug: string; coverImage?: string; rating?: number; views?: number }

const PODIUM = ['bg-primary', 'bg-[#D98BA6]', 'bg-[#C9A227]']

function fmtViews(v?: number) {
  if (!v) return null
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
  if (v >= 1000) return `${Math.round(v / 1000)}K`
  return String(v)
}

export default function RankingBand({ items }: { items: RItem[] }) {
  if (!items || items.length === 0) return null
  const top3 = items.slice(0, 3)
  const rest = items.slice(3, 9)

  return (
    <section className="my-10 rounded-3xl border border-border bg-gradient-to-b from-surface-2 to-surface p-5 sm:p-8">
      <div className="flex items-center gap-2.5 mb-6">
        <span className="grid place-items-center w-9 h-9 rounded-2xl bg-primary-soft text-primary"><Crown className="w-5 h-5" /></span>
        <h2 className="text-lg sm:text-xl font-extrabold text-foreground">Bảng vàng Bongmeow</h2>
        <span className="text-xs text-muted-2">— truyện được yêu thích nhất</span>
      </div>

      {/* Podium top 3 — số 1 ở giữa & cao nhất */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-xl mx-auto">
        {top3.map((t, i) => {
          const orderCls = i === 0 ? 'order-2' : i === 1 ? 'order-1' : 'order-3'
          const elevate = i === 0 ? 'sm:-translate-y-4' : ''
          return (
            <Link key={t.id} href={`/truyen/${t.slug}`} className={`group text-center ${orderCls}`}>
              <div className={`relative transition-transform ${elevate}`}>
                <div className="book-cover shadow-card"><Cover src={t.coverImage} title={t.title} /></div>
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 grid place-items-center w-8 h-8 rounded-full text-white text-sm font-extrabold shadow-pop ring-2 ring-surface ${PODIUM[i]}`}>{i + 1}</span>
              </div>
              <h3 className="mt-3 text-[13px] font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">{t.title}</h3>
              {t.rating ? (
                <div className="mt-0.5 text-[11px] text-muted-2 flex items-center justify-center gap-0.5">
                  <Star filled className="w-3 h-3 text-yellow-400" />{t.rating.toFixed(1)}
                </div>
              ) : null}
            </Link>
          )
        })}
      </div>

      {/* Rest 4–9 */}
      {rest.length > 0 && (
        <div className="mt-7 grid sm:grid-cols-2 gap-x-8 gap-y-0.5 max-w-3xl mx-auto">
          {rest.map((t, i) => (
            <Link key={t.id} href={`/truyen/${t.slug}`} className="flex items-center gap-3 py-2 border-b border-border/60 group">
              <span className="w-6 text-center text-sm font-bold text-muted-2">{i + 4}</span>
              <span className="flex-1 min-w-0 text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors">{t.title}</span>
              {fmtViews(t.views) && <span className="text-[11px] text-muted-2 flex-shrink-0">{fmtViews(t.views)} 👁</span>}
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
