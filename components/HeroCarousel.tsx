'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Cover from './Cover'
import { Star, Play, ChevronRight, CatEars } from './icons'

export interface HeroItem {
  slug: string
  title: string
  author?: string
  description?: string
  coverImage?: string
  rating?: number
  genres?: string[]
}

// Hero cinematic full-bleed: ảnh bìa mờ làm backdrop, tan vào nền trang.
// Render NGOÀI .container (full chiều ngang màn hình).
export default function HeroCarousel({ items }: { items: HeroItem[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = items.length
  const go = useCallback((idx: number) => setI(((idx % n) + n) % n), [n])

  useEffect(() => {
    if (n <= 1 || paused) return
    const t = setInterval(() => setI((v) => (v + 1) % n), 6500)
    return () => clearInterval(t)
  }, [n, paused])

  // Swipe đổi slide trên mobile
  const touch = useRef<{ x: number; y: number } | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touch.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touch.current.x
    const dy = t.clientY - touch.current.y
    touch.current = null
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? i + 1 : i - 1)
  }

  if (n === 0) return null
  const it = items[i]

  return (
    <section
      className="relative overflow-hidden select-none mb-8 sm:mb-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Backdrop: ảnh bìa mờ, crossfade theo slide */}
      <div key={`bg-${i}`} className="absolute inset-0 animate-fade-in">
        {it.coverImage && (
          <img
            src={it.coverImage}
            alt=""
            aria-hidden
            className="backdrop-img"
            onError={(e) => { e.currentTarget.style.opacity = '0' }}
          />
        )}
        <div className="backdrop-fade" />
      </div>

      <div className="container relative">
        <div key={`fg-${i}`} className="flex items-end gap-5 sm:gap-10 pt-14 pb-10 sm:pt-20 sm:pb-14 min-h-[400px] sm:min-h-[480px] animate-slide-up">

          {/* Bìa — trên mobile nhỏ gọn, desktop lớn. Tai mèo = chữ ký Bongmeow */}
          <Link href={`/truyen/${it.slug}`} className="group relative flex-shrink-0 w-28 sm:w-44 lg:w-52">
            <CatEars className="absolute -top-[13px] sm:-top-[17px] left-1/2 -translate-x-1/2 w-14 h-6 sm:w-[72px] sm:h-8 text-primary drop-shadow-sm z-10" />
            <div className="book-cover !rounded-lg shadow-pop ring-1 ring-white/10 group-hover:-translate-y-1.5 transition-transform duration-300">
              <Cover src={it.coverImage} title={it.title} />
            </div>
          </Link>

          {/* Nội dung */}
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="px-2.5 py-1 rounded bg-primary text-primary-fg text-[11px] font-bold uppercase tracking-widest">Nổi bật</span>
              {it.rating ? (
                <span className="flex items-center gap-1 text-sm font-bold text-foreground">
                  <Star filled className="w-4 h-4 text-primary" />{it.rating.toFixed(1)}
                </span>
              ) : null}
            </div>

            <Link href={`/truyen/${it.slug}`}>
              <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.02] tracking-tight line-clamp-2 hover:text-primary transition-colors">
                {it.title}
              </h2>
            </Link>

            {it.author && <p className="text-muted text-sm sm:text-base mt-2.5 font-medium">{it.author}</p>}

            <p className="hidden sm:block text-muted text-base mt-3 line-clamp-2 max-w-xl leading-relaxed">{it.description}</p>

            {it.genres && it.genres.length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-2 mt-4">
                {it.genres.slice(0, 3).map((g) => (
                  <span key={g} className="px-3 py-1 rounded-full bg-surface-2/70 border border-border text-foreground/80 text-xs font-medium backdrop-blur-sm">{g}</span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2.5 mt-5 sm:mt-6">
              <Link href={`/truyen/${it.slug}/1`} className="btn btn-primary sm:h-12 sm:px-7 sm:text-base">
                <Play className="w-4 h-4" /> Đọc ngay
              </Link>
              <Link href={`/truyen/${it.slug}`} className="btn btn-default sm:h-12 sm:px-7 sm:text-base">
                Chi tiết <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Rail thumbnail dọc — xem trước & chuyển slide (desktop) */}
          {n > 1 && (
            <div className="hidden lg:flex flex-col gap-2.5 flex-shrink-0 self-center">
              {items.map((t, idx) => (
                <button
                  key={t.slug}
                  onClick={() => go(idx)}
                  aria-label={t.title}
                  className={`w-12 rounded-md overflow-hidden transition-all duration-200 ${idx === i
                    ? 'ring-2 ring-primary opacity-100'
                    : 'ring-1 ring-white/10 opacity-45 hover:opacity-85'}`}
                >
                  <div className="book-cover !rounded-md">
                    <Cover src={t.coverImage} title={t.title} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dots */}
        {n > 1 && (
          <div className="absolute bottom-4 right-4 sm:right-8 flex gap-1.5 z-10">
            {items.map((_, idx) => (
              <button key={idx} onClick={() => go(idx)} aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-7 bg-primary' : 'w-2 bg-foreground/25 hover:bg-foreground/50'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
