import Link from 'next/link'
import Cover from './Cover'
import { ChevronRight } from './icons'

interface Item {
  id: string
  title: string
  slug: string
  author?: string
  coverImage?: string
  latestChapter?: { number: number; title: string }
  updatedAt?: string
  isNew?: boolean
}

// "Mới cập nhật" kiểu tạp chí: hàng đánh số + bìa nhỏ + chương mới + thời gian.
// Thay cho lưới thẻ 4 cột "web truyện chuẩn".
export default function UpdateList({ items }: { items: Item[] }) {
  if (!items || items.length === 0) return null
  return (
    <section className="mb-10 sm:mb-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-1.5">Vừa ra lò</p>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">Mới cập nhật</h2>
        </div>
        <Link href="/danh-sach/truyen-moi" className="flex items-center gap-0.5 text-sm font-semibold text-muted hover:text-primary transition-colors flex-shrink-0 pb-1">
          Tất cả <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid md:grid-cols-2 md:gap-x-12">
        {items.slice(0, 14).map((t, i) => (
          <Link key={t.id} href={`/truyen/${t.slug}`}
            className="group flex items-center gap-4 py-3 border-b border-border/70">
            <span className="font-display text-xl font-bold w-8 text-center text-muted-2 group-hover:text-primary transition-colors flex-shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="w-10 flex-shrink-0">
              <div className="book-cover !rounded">
                <Cover src={t.coverImage} title={t.title} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-semibold text-foreground leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                {t.title}
              </h3>
              {t.author && <p className="mt-0.5 text-xs text-muted-2 line-clamp-1">{t.author}</p>}
            </div>
            <div className="text-right flex-shrink-0">
              {t.latestChapter && (
                <span className="block text-[13px] font-semibold text-foreground/85">C.{t.latestChapter.number}</span>
              )}
              {t.updatedAt && (
                <span className="block mt-0.5 text-[11px] text-muted-2 whitespace-nowrap" suppressHydrationWarning>{t.updatedAt}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
