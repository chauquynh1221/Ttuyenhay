'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Chặn phím tắt mở DevTools / xem nguồn / lưu trang.
// ⚠️ CHỈ LÀ DETERRENT: mở DevTools từ menu trình duyệt, hoặc tắt JS, là bypass được.
// Không thể "tắt DevTools" thật sự bằng web. Chừa /admin để còn debug.
export default function AntiDevtools() {
  const pathname = usePathname() || ''

  useEffect(() => {
    if (pathname.startsWith('/admin')) return

    const onKey = (e: KeyboardEvent) => {
      const k = (e.key || '').toUpperCase()
      const block =
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'K'].includes(k)) || // DevTools / inspect / console
        (e.ctrlKey && k === 'U') || // view-source
        (e.ctrlKey && k === 'S')    // save page
      if (block) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }

    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true } as any)
  }, [pathname])

  return null
}
