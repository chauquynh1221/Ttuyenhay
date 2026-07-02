'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Cover from './Cover'
import { Clock, ChevronRight } from './icons'

interface HistItem {
  truyenId?: { _id: string; title: string; slug: string; coverImage?: string; totalChapters?: number }
  chapterId?: { _id: string; chapterNumber?: number }
}

export default function ContinueReading() {
  const [items, setItems] = useState<HistItem[] | null>(null)

  useEffect(() => {
    fetch('/api/history')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setItems(d?.success ? (d.history || []) : []))
      .catch(() => setItems([]))
  }, [])

  // Chưa tải xong hoặc không có gì → không hiện
  if (!items || items.length === 0) return null

  const valid = items.filter((h) => h.truyenId?.slug).slice(0, 12)
  if (valid.length === 0) return null

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide text-foreground">Đang đọc dở</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
        {valid.map((h, idx) => {
          const t = h.truyenId!
          const ch = h.chapterId?.chapterNumber
          const total = t.totalChapters || 0
          const pct = ch && total ? Math.min(100, Math.round((ch / total) * 100)) : 0
          return (
            <Link key={idx} href={ch ? `/truyen/${t.slug}/${ch}` : `/truyen/${t.slug}`}
              className="group flex-shrink-0 w-28 sm:w-32">
              <div className="card overflow-hidden">
                <div className="book-cover">
                  <Cover src={t.coverImage} title={t.title} />
                  <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] font-semibold px-1.5 py-1 flex items-center justify-between">
                    <span>{ch ? `C.${ch}` : 'Đọc tiếp'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                  {pct > 0 && (
                    <span className="absolute top-0 left-0 h-1 bg-primary" style={{ width: `${pct}%` }} />
                  )}
                </div>
                <div className="p-2">
                  <h3 className="text-[12px] font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">{t.title}</h3>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
