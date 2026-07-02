'use client'

import { useEffect, useState, useRef } from 'react'
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

// "Tường poster" accordion — như mặt tiền rạp phim:
// tấm đang chọn trượt mở rộng thành billboard, các tấm còn lại là dải poster sắc nét.
// Mobile: chỉ hiện tấm active (vuốt để đổi) + chấm điều hướng.
export default function HeroCarousel({ items }: { items: HeroItem[] }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = items.length

  useEffect(() => {
    if (n <= 1 || paused) return
    const t = setInterval(() => setI((v) => (v + 1) % n), 6500)
    return () => clearInterval(t)
  }, [n, paused])

  // Vuốt đổi truyện (mobile)
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
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) setI((v) => ((dx < 0 ? v + 1 : v - 1) + n) % n)
  }

  if (n === 0) return null

  return (
    <section
      className="container mt-4 sm:mt-6 mb-10 sm:mb-14 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex gap-2.5 sm:gap-3 h-[440px] sm:h-[clamp(440px,58vh,580px)]">
        {items.map((it, idx) => {
          const active = idx === i
          return (
            <div
              key={it.slug}
              onMouseEnter={() => setI(idx)}
              onClick={() => { if (!active) setI(idx) }}
              className={`relative overflow-hidden rounded-xl ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                ${active ? 'flex-[10] sm:flex-[4.6] shadow-pop' : 'hidden sm:block sm:flex-1 cursor-pointer hover:ring-primary/50'}`}
            >
              {/* ===== Dải poster (inactive): art sắc nét ===== */}
              {!active && (
                <>
                  {it.coverImage ? (
                    <img src={it.coverImage} alt={it.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.opacity = '0' }} />
                  ) : (
                    <div className="absolute inset-0"><Cover src={it.coverImage} title={it.title} /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />
                  <span className="absolute top-3 left-1/2 -translate-x-1/2 grid place-items-center w-7 h-7 rounded-full bg-black/55 text-white/90 text-xs font-bold backdrop-blur-sm">
                    {idx + 1}
                  </span>
                  {it.rating ? (
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-0.5 text-[11px] font-semibold text-white/90">
                      <Star filled className="w-3 h-3 text-[#F6B14E]" />{it.rating.toFixed(1)}
                    </span>
                  ) : null}
                </>
              )}

              {/* ===== Billboard (active): nền mờ + bìa sắc nét + thông tin ===== */}
              {active && (
                <>
                  {it.coverImage && (
                    <img src={it.coverImage} alt="" aria-hidden
                      className="absolute inset-[-24px] w-[calc(100%+48px)] h-[calc(100%+48px)] object-cover blur-2xl brightness-[0.55] saturate-125 kenburns"
                      onError={(e) => { e.currentTarget.style.opacity = '0' }} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  <div className="relative h-full flex items-end p-5 sm:p-7 lg:p-9 animate-fade-in">
                    <div className="flex items-end gap-4 sm:gap-7 w-full min-w-[270px] sm:min-w-[480px]">
                      {/* Bìa sắc nét + tai mèo */}
                      <Link href={`/truyen/${it.slug}`} className="relative flex-shrink-0 w-28 sm:w-40 lg:w-44 group">
                        <CatEars className="absolute -top-[13px] sm:-top-[16px] left-1/2 -translate-x-1/2 w-14 h-6 sm:w-16 sm:h-7 text-primary drop-shadow-sm z-10" />
                        <div className="book-cover !rounded-lg shadow-pop ring-1 ring-white/15 group-hover:-translate-y-1.5 transition-transform duration-300">
                          <Cover src={it.coverImage} title={it.title} />
                        </div>
                      </Link>

                      {/* Thông tin */}
                      <div className="flex-1 min-w-0 pb-0.5 text-white">
                        <div className="flex items-center gap-2.5 mb-2">
                          <span className="px-2.5 py-1 rounded bg-primary text-primary-fg text-[10px] font-bold uppercase tracking-widest">Nổi bật</span>
                          {it.rating ? (
                            <span className="flex items-center gap-1 text-sm font-bold">
                              <Star filled className="w-4 h-4 text-[#F6B14E]" />{it.rating.toFixed(1)}
                            </span>
                          ) : null}
                        </div>

                        <Link href={`/truyen/${it.slug}`}>
                          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.14] pb-0.5 line-clamp-2 hover:text-primary transition-colors">
                            {it.title}
                          </h2>
                        </Link>

                        {it.author && <p className="text-white/65 text-xs sm:text-sm mt-1.5 font-medium">{it.author}</p>}

                        {it.genres && it.genres.length > 0 && (
                          <div className="hidden sm:flex flex-wrap gap-1.5 mt-3">
                            {it.genres.slice(0, 3).map((g) => (
                              <span key={g} className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/85 text-[11px] font-medium backdrop-blur-sm">{g}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2.5 mt-4">
                          <Link href={`/truyen/${it.slug}/1`} className="btn btn-primary">
                            <Play className="w-4 h-4" /> Đọc ngay
                          </Link>
                          <Link href={`/truyen/${it.slug}`} className="btn btn-glass">
                            Chi tiết <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Chấm điều hướng — chỉ mobile (desktop đã thấy đủ các tấm) */}
      {n > 1 && (
        <div className="sm:hidden flex justify-center gap-1.5 mt-3.5">
          {items.map((_, idx) => (
            <button key={idx} onClick={() => setI(idx)} aria-label={`Truyện ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-7 bg-primary' : 'w-2 bg-foreground/25'}`} />
          ))}
        </div>
      )}
    </section>
  )
}
