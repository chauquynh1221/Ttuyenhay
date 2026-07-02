'use client'

import { useEffect } from 'react'

// Ẩn header khi cuộn xuống (đọc), hiện lại khi cuộn lên. Chỉ mount ở trang đọc.
export default function ImmersiveReading() {
  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const root = document.documentElement

    const update = () => {
      const y = window.scrollY
      if (Math.abs(y - last) > 6) {
        const goingDown = y > last && y > 140
        root.classList.toggle('chrome-hidden', goingDown)
        last = y
      }
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update) }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      root.classList.remove('chrome-hidden')
    }
  }, [])

  return null
}
