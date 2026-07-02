'use client'

import { useEffect, useRef } from 'react'

const PREFIX = 'bm-pos:'

// Nhớ vị trí đọc trong chương: lưu tỉ lệ cuộn theo chapterId, khôi phục khi quay lại.
// Dùng tỉ lệ (không dùng px tuyệt đối) để đúng kể cả khi đổi cỡ chữ.
export default function ReadingPosition({ chapterKey }: { chapterKey: string }) {
  const restored = useRef(false)

  useEffect(() => {
    restored.current = false
    const key = PREFIX + chapterKey

    // Khôi phục sau khi layout ổn định
    const restore = () => {
      try {
        const raw = localStorage.getItem(key)
        const ratio = raw ? parseFloat(raw) : 0
        if (ratio > 0.02 && ratio < 0.98) {
          const h = document.documentElement.scrollHeight - window.innerHeight
          if (h > 0) window.scrollTo(0, Math.round(ratio * h))
        }
      } catch { }
      restored.current = true
    }
    const raf1 = requestAnimationFrame(() =>
      requestAnimationFrame(() => { timer = window.setTimeout(restore, 60) })
    )
    let timer = 0

    // Lưu tỉ lệ khi cuộn (throttle bằng rAF)
    let ticking = false
    const save = () => {
      ticking = false
      if (!restored.current) return
      const h = document.documentElement.scrollHeight - window.innerHeight
      if (h <= 0) return
      const ratio = window.scrollY / h
      try {
        if (ratio < 0.02 || ratio > 0.98) localStorage.removeItem(key) // đầu/cuối → xoá, lần sau đọc lại từ đầu
        else localStorage.setItem(key, ratio.toFixed(4))
      } catch { }
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(save) } }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf1)
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [chapterKey])

  return null
}
