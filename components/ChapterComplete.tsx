'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Mascot from './Mascot'
import { Play } from './icons'

const COLORS = ['#F26D8B', '#8FB8ED', '#F6C445', '#5FBf8f', '#C89BE8']

function updateStreak(): number {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const raw = localStorage.getItem('tf_streak')
    const data = raw ? JSON.parse(raw) : null
    if (data?.date === today) return data.count || 1
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const count = data?.date === yesterday ? (data.count || 0) + 1 : 1
    localStorage.setItem('tf_streak', JSON.stringify({ date: today, count }))
    return count
  } catch {
    return 1
  }
}

export default function ChapterComplete({
  slug, chapterNumber, totalChapters, nextChapter,
}: {
  slug: string
  chapterNumber: number
  totalChapters: number
  nextChapter?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [fired, setFired] = useState(false)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !fired) {
          setFired(true)
          setStreak(updateStreak())
          io.disconnect()
        }
      })
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [fired])

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border border-border mesh-pastel shadow-card p-6 my-8 text-center max-w-md mx-auto">
      {/* confetti */}
      {fired && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 26 }).map((_, k) => (
            <span key={k} className="confetti-piece"
              style={{
                left: `${(k * 3.8) % 100}%`,
                background: COLORS[k % COLORS.length],
                animationDelay: `${(k % 6) * 0.12}s`,
              }} />
          ))}
        </div>
      )}

      <Mascot pose="celebrate" className="w-24 h-24 mx-auto relative" />
      <h3 className="text-lg font-extrabold text-foreground mt-1">Hoàn thành chương {chapterNumber}! 🎉</h3>
      <p className="text-sm text-muted mt-1">
        {streak > 1 ? <>Chuỗi đọc <b className="text-primary">🔥 {streak} ngày</b> — giữ phong độ nhé!</> : 'Mèo Bong tự hào về cậu, meo~'}
      </p>

      <div className="flex items-center justify-center gap-2 mt-4">
        {nextChapter ? (
          <Link href={`/truyen/${slug}/${nextChapter}`} className="btn btn-primary">
            <Play className="w-4 h-4" /> Đọc chương {nextChapter}
          </Link>
        ) : (
          <span className="btn btn-default opacity-70 cursor-default">Hết truyện rồi, meo~</span>
        )}
        <Link href={`/truyen/${slug}`} className="btn btn-default">📚 Mục lục</Link>
      </div>
      <p className="text-[11px] text-muted-2 mt-2">Chương {chapterNumber}/{totalChapters}</p>
    </div>
  )
}
