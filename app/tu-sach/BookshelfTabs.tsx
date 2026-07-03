'use client'

import { useState } from 'react'
import Link from 'next/link'
import Cover from '@/components/Cover'
import EmptyState from '@/components/EmptyState'

interface BookItem { id: string; title: string; slug: string; coverImage?: string; currentChapter?: number; timeAgo?: string }

export default function BookshelfTabs({ bookmarks, follows, history }: {
  bookmarks: BookItem[]; follows: BookItem[]; history: BookItem[]
}) {
  const [tab, setTab] = useState<'yeu-thich' | 'theo-doi' | 'lich-su'>('yeu-thich')

  const tabs = [
    { key: 'yeu-thich' as const, label: `❤️ Yêu thích`, count: bookmarks.length },
    { key: 'theo-doi' as const, label: `🔔 Đang theo dõi`, count: follows.length },
    { key: 'lich-su' as const, label: `🕐 Lịch sử đọc`, count: history.length },
  ]

  return (
    <>
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition-colors ${tab === t.key ? 'text-primary border-primary' : 'text-foreground/80 border-transparent hover:text-foreground'}`}>
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {tab === 'yeu-thich' && (
        bookmarks.length === 0 ? (
          <div className="card"><EmptyState title="Tủ sách còn trống, meo~" hint="Thêm truyện yêu thích để Bongmeow giữ giúp bạn nhé!" action={<Link href="/" className="btn btn-primary btn-sm">Khám phá truyện ngay</Link>} /></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {bookmarks.map((b) => (
              <div key={b.id} className="group">
                <Link href={`/truyen/${b.slug}`} className="block">
                  <div className="book-cover shadow-card ring-1 ring-white/5 group-hover:-translate-y-1 transition-transform duration-300">
                    <Cover src={b.coverImage} title={b.title} />
                  </div>
                  <p className="pt-2 text-[13px] font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">{b.title}</p>
                  <p className="text-[11px] text-muted-2 mt-0.5">Đang đọc: Chương {b.currentChapter || 1}</p>
                </Link>
                <Link href={`/truyen/${b.slug}/${b.currentChapter || 1}`} className="btn btn-primary btn-sm w-full mt-1.5">Đọc tiếp</Link>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'theo-doi' && (
        follows.length === 0 ? (
          <div className="card"><EmptyState title="Chưa theo dõi truyện nào" hint="Theo dõi để nhận thông báo khi có chương mới." action={<Link href="/" className="btn btn-primary btn-sm">Khám phá ngay</Link>} /></div>
        ) : (
          <div className="card divide-y divide-border overflow-hidden">
            {follows.map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors">
                <div className="w-10 flex-shrink-0"><div className="book-cover !rounded"><Cover src={f.coverImage} title={f.title} /></div></div>
                <Link href={`/truyen/${f.slug}`} className="flex-1 min-w-0 text-sm font-semibold text-foreground hover:text-primary truncate">{f.title}</Link>
                <Link href={`/truyen/${f.slug}`} className="btn btn-default btn-sm flex-shrink-0">Đọc</Link>
              </div>
            ))}
          </div>
        )
      )}

      {tab === 'lich-su' && (
        history.length === 0 ? (
          <div className="card"><EmptyState title="Chưa có lịch sử đọc" hint="Bắt đầu đọc một chương, Bongmeow sẽ nhớ giúp bạn!" /></div>
        ) : (
          <div className="card divide-y divide-border overflow-hidden">
            {history.map((h) => (
              <div key={h.id} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2 transition-colors">
                <div className="w-10 flex-shrink-0"><div className="book-cover !rounded"><Cover src={h.coverImage} title={h.title} /></div></div>
                <div className="flex-1 min-w-0">
                  <Link href={`/truyen/${h.slug}`} className="text-sm font-semibold text-foreground hover:text-primary truncate block">{h.title}</Link>
                  <p className="text-[12px] text-muted-2">{h.timeAgo}</p>
                </div>
                <Link href={`/truyen/${h.slug}`} className="btn btn-default btn-sm flex-shrink-0">Xem</Link>
              </div>
            ))}
          </div>
        )
      )}
    </>
  )
}
