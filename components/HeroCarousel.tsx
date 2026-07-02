'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import Cover from './Cover'
import Mascot from './Mascot'
import { Star, Play, ChevronRight, CatEars, Sparkle, Cloud, Heart, Paw } from './icons'

export interface HeroItem {
  slug: string
  title: string
  author?: string
  description?: string
  coverImage?: string
  rating?: number
  genres?: string[]
}

export default function HeroCarousel({ items }: { items: HeroItem[] }) {
  const [i, setI] = useState(0)
  const n = items.length
  const decorRef = useRef<HTMLDivElement>(null)
  const go = useCallback((idx: number) => setI(((idx % n) + n) % n), [n])

  useEffect(() => {
    if (n <= 1) return
    const t = setInterval(() => setI((v) => (v + 1) % n), 5500)
    return () => clearInterval(t)
  }, [n])

  if (n === 0) return null
  const it = items[i]

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const mx = (e.clientX - r.left) / r.width - 0.5
    const my = (e.clientY - r.top) / r.height - 0.5
    if (decorRef.current) decorRef.current.style.transform = `translate(${mx * 18}px, ${my * 18}px)`
  }
  const onLeave = () => { if (decorRef.current) decorRef.current.style.transform = '' }

  return (
    <div className="relative mb-10">
      <CatEars className="absolute left-10 -top-[13px] z-20 w-14 h-6 text-primary drop-shadow-sm" />

      <div onMouseMove={onMove} onMouseLeave={onLeave}
        className="relative overflow-hidden rounded-[28px] border border-border shadow-card select-none min-h-[300px] sm:min-h-[336px] mesh-pastel">

        {/* Hoạ tiết bay lơ lửng — parallax theo chuột */}
        <div ref={decorRef} className="absolute inset-0 pointer-events-none transition-transform duration-200 ease-out will-change-transform">
          <Cloud className="absolute top-7 left-[22%] w-14 h-14 text-white/70 anim-floatx" />
          <Cloud className="absolute bottom-8 right-[8%] w-10 h-10 text-white/60 anim-floatx" style={{ animationDelay: '1.2s' }} />
          <Sparkle className="absolute top-8 right-[34%] w-5 h-5 text-primary/60 anim-twinkle" />
          <Sparkle className="absolute bottom-12 left-[46%] w-4 h-4 text-accent anim-twinkle" style={{ animationDelay: '0.8s' }} />
          <Sparkle className="absolute top-1/2 right-[6%] w-4 h-4 text-primary/50 anim-twinkle" style={{ animationDelay: '1.6s' }} />
          <Heart className="absolute top-[30%] right-[30%] w-5 h-5 text-primary/45 anim-float" />
          <Paw className="absolute bottom-6 left-8 w-6 h-6 text-primary/25 anim-float2" />
          <Paw className="absolute top-10 left-[42%] w-4 h-4 text-accent/40 anim-float" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative flex items-center gap-4 sm:gap-6 p-5 sm:p-8">
          {/* Bìa nghiêng */}
          <Link href={`/truyen/${it.slug}`} className="group flex-shrink-0 w-28 sm:w-40">
            <div className="book-cover shadow-pop -rotate-[5deg] group-hover:rotate-0 transition-transform duration-300">
              <Cover src={it.coverImage} title={it.title} />
            </div>
          </Link>

          {/* Thông tin */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-primary text-primary-fg text-[10px] font-bold uppercase tracking-wide">🐾 Nổi bật</span>
              {it.rating ? (
                <span className="flex items-center gap-1 text-sm font-bold text-foreground">
                  <Star filled className="w-4 h-4 text-yellow-400" />{it.rating.toFixed(1)}
                </span>
              ) : null}
            </div>
            <Link href={`/truyen/${it.slug}`}>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-foreground leading-[1.1] line-clamp-2 hover:text-primary transition-colors">
                {it.title}
              </h2>
            </Link>
            {it.author && <p className="text-muted text-xs sm:text-sm mt-1.5">✍ {it.author}</p>}
            <p className="hidden sm:block text-muted text-sm mt-2.5 line-clamp-2 max-w-md">{it.description}</p>
            {it.genres && it.genres.length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-1.5 mt-3">
                {it.genres.slice(0, 3).map((g) => (
                  <span key={g} className="px-2.5 py-0.5 rounded-full bg-surface/70 border border-border text-foreground/70 text-[11px] font-medium backdrop-blur-sm">{g}</span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 mt-4">
              <Link href={`/truyen/${it.slug}/1`} className="btn btn-primary shadow-[0_6px_16px_rgb(var(--primary)/0.35)]">
                <Play className="w-4 h-4" /> Đọc ngay
              </Link>
              <Link href={`/truyen/${it.slug}`} className="btn btn-default">
                Chi tiết <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Linh vật mèo chào (desktop) */}
          <div className="hidden lg:flex flex-col items-center flex-shrink-0 w-44 relative">
            <div className="relative mb-3 px-3.5 py-2 rounded-2xl bg-surface border border-border shadow-card text-center anim-float">
              <p className="text-[12px] font-semibold text-foreground leading-snug">Chào cậu~ 🐾<br />Đọc gì hôm nay nào?</p>
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-surface border-b border-r border-border rotate-45" />
            </div>
            <Mascot pose="wave" className="w-36 h-36 anim-float drop-shadow-[0_8px_16px_rgb(0_0_0/0.10)]" />
          </div>
        </div>

        {n > 1 && (
          <div className="absolute bottom-4 right-6 flex gap-1.5 z-10">
            {items.map((_, idx) => (
              <button key={idx} onClick={() => go(idx)} aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-primary' : 'w-1.5 bg-primary/30 hover:bg-primary/60'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
