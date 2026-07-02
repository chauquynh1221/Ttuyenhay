'use client'

import { useEffect, useRef, useState } from 'react'
import { Play } from './icons'

const SPEED_KEY = 'bm-autoscroll-speed'

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  )
}

// Tự cuộn khi đọc. Điều khiển NỔI cố định (luôn thấy dù trang đã cuộn),
// chạm bất kỳ đâu ngoài điều khiển để dừng, tốc độ được nhớ qua localStorage.
export default function AutoScroll() {
  const [on, setOn] = useState(false)
  const [speed, setSpeed] = useState(2) // px mỗi nhịp
  const controlRef = useRef<HTMLDivElement>(null)

  // Nạp tốc độ đã lưu
  useEffect(() => {
    try {
      const s = parseInt(localStorage.getItem(SPEED_KEY) || '')
      if (s >= 1 && s <= 9) setSpeed(s)
    } catch { }
  }, [])

  // Lưu tốc độ
  useEffect(() => {
    try { localStorage.setItem(SPEED_KEY, String(speed)) } catch { }
  }, [speed])

  // Vòng lặp cuộn
  useEffect(() => {
    if (!on) return
    const id = window.setInterval(() => {
      window.scrollBy(0, speed)
      // Dừng khi chạm đáy
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) setOn(false)
    }, 24)
    return () => clearInterval(id)
  }, [on, speed])

  // Chạm bất kỳ đâu (ngoài điều khiển) để dừng — như app đọc truyện
  useEffect(() => {
    if (!on) return
    const onDown = (e: PointerEvent) => {
      const el = e.target as HTMLElement
      if (el?.closest?.('[data-autoscroll]')) return // bấm vào điều khiển thì bỏ qua
      setOn(false)
    }
    // hoãn 1 nhịp để không bắt luôn cú bấm vừa bật
    const t = setTimeout(() => document.addEventListener('pointerdown', onDown, true), 0)
    return () => { clearTimeout(t); document.removeEventListener('pointerdown', onDown, true) }
  }, [on])

  return (
    <>
      {/* Nút bật trong header */}
      <button
        data-autoscroll
        onClick={() => setOn((v) => !v)}
        title={on ? 'Dừng tự cuộn' : 'Tự cuộn'}
        aria-label="Tự cuộn"
        className={`grid place-items-center w-10 h-10 rounded-md border transition-colors ${on ? 'bg-primary text-primary-fg border-primary' : 'bg-surface text-muted border-border hover:text-foreground hover:bg-surface-2'}`}
      >
        {on ? <PauseIcon /> : <Play className="w-4 h-4" />}
      </button>

      {/* Điều khiển NỔI khi đang tự cuộn */}
      {on && (
        <div
          data-autoscroll
          ref={controlRef}
          className="fixed left-1/2 -translate-x-1/2 bottom-20 md:bottom-6 z-[70] flex items-center gap-0.5 rounded-full bg-surface/95 backdrop-blur-md border border-border shadow-pop pl-1.5 pr-1 h-12 animate-slide-up"
        >
          <button onClick={() => setOn(false)} className="flex items-center gap-1.5 pl-2 pr-3 h-9 rounded-full text-sm font-bold text-primary hover:bg-primary-soft transition-colors">
            <PauseIcon /> Dừng
          </button>
          <span className="w-px h-6 bg-border" />
          <button onClick={() => setSpeed((s) => Math.max(1, s - 1))} aria-label="Chậm hơn" className="grid place-items-center w-9 h-9 rounded-full text-muted hover:text-foreground text-xl leading-none">−</button>
          <span className="w-5 text-center text-sm font-bold text-foreground tabular-nums">{speed}</span>
          <button onClick={() => setSpeed((s) => Math.min(9, s + 1))} aria-label="Nhanh hơn" className="grid place-items-center w-9 h-9 rounded-full text-muted hover:text-foreground text-xl leading-none">+</button>
        </div>
      )}
    </>
  )
}
