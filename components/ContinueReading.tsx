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
    <section className="mb-10 sm:mb-12">
      <div className="mb-4">
        <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-primary mb-1.5">
          <Clock className="w-4 h-4" /> Tiếp tục hành trình
        </p>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">Đọc tiếp</h2>
      </div>
      <div className="flex gap-3.5 overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:-mx-1 sm:px-1">
        {valid.map((h, idx) => {
          const t = h.truyenId!
          const ch = h.chapterId?.chapterNumber
          const total = t.totalChapters || 0
          const pct = ch && total ? Math.min(100, Math.round((ch / total) * 100)) : 0
          return (
            <Link key={idx} href={ch ? `/truyen/${t.slug}/${ch}` : `/truyen/${t.slug}`}
              className="group flex-shrink-0 w-28 sm:w-32">
              <div className="book-cover shadow-card ring-1 ring-white/5 group-hover:-translate-y-1 transition-transform duration-300">
                <Cover src={t.coverImage} title={t.title} />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-black/0 text-white text-[11px] font-semibold px-2 pt-4 pb-1.5 flex items-center justify-between">
                  <span>{ch ? `C.${ch}` : 'Đọc tiếp'}</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
                {pct > 0 && (
                  <span className="absolute bottom-0 left-0 h-[3px] bg-primary z-10" style={{ width: `${pct}%` }} />
                )}
              </div>
              <h3 className="pt-2 px-0.5 text-xs font-medium text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">{t.title}</h3>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
