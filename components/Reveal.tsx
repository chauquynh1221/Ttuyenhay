'use client'

import { useEffect, useRef, useState } from 'react'

// Bọc nội dung → trồi lên mượt khi cuộn tới (scroll-reveal). Tôn trọng reduced-motion (xử lý ở CSS).
export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Nếu đã nằm trong/gần viewport ngay khi mount → hiện luôn
    if (el.getBoundingClientRect().top < window.innerHeight + 120) {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true)
            io.disconnect()
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px 10% 0px' }
    )
    io.observe(el)

    // An toàn: nếu vì lý do gì IO không kích hoạt, vẫn hiện nội dung
    const fallback = setTimeout(() => setShown(true), 1200)
    return () => { io.disconnect(); clearTimeout(fallback) }
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${shown ? 'reveal-in' : ''} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
